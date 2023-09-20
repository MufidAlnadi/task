const bcrypt = require("bcrypt");
const User = require("../models/user");

const jwt = require("jsonwebtoken");
const { jwtGenerator } = require("../utils/JwtGenerator");

// Register route
const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).send("User already exists. Please log in.");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "user",
      activated: false,
    });
    const token = jwtGenerator(newUser);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Login route
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json("Email or password is incorrect");
    }
    if (user.activated === false) {
      return res.status(401).json("Unauthorized");
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json("Email or password is incorrect");
    }
    const token = jwtGenerator(user);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const activateUser = async (req, res) => {
  try {
    const { userId, activated } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.activated = activated;
    await user.save();
    return res
      .status(200)
      .json({ message: "User activation status updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAdminUsers = async (req, res) => {
  try {
    const adminUsers = await User.find({ role: 'admin' }); 
    res.status(200).json(adminUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId, username, email } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.username = username;
    user.email = email;
    await user.save();
    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId, deleted } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.deleted = deleted;
    user.activated=false;
    await user.save();
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ deleted: false, role: { $ne: 'admin' } }); 
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);

  if (!token) {
    return res.status(401).json({ error: "Not found" });
  }

  jwt.verify(token, process.env.jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid" });
    }

    req.user = decoded;
    next();
  });
}
const getUserRoleById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ role: user.role });
  } catch (error) {
    console.error("Error getting user role:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  signup,
  login,
  deleteUser,
  updateUser,
  getAllUsers,
  activateUser,
  authenticateToken,
  getUserRoleById,
  getAdminUsers
};
