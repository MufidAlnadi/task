const jwt = require("jsonwebtoken");
require('dotenv').config();

function jwtGenerator(user) {
   try {
      const payload = {
         user_id: user._id,
         username: user.username,
         email: user.email,
         role: user.role
      };
      const token = jwt.sign(payload, process.env.jwtSecret, { expiresIn: "5hr" });
      return token;
   } catch (error) {
      throw error;
   }
}

function getItem(token) {
   try {
      const decoded = jwt.verify(token, process.env.jwtSecret);
      return decoded;
   } catch (error) {
      throw error;
   }
}

module.exports = { jwtGenerator, getItem };
