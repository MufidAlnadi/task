const jwt = require("jsonwebtoken");
require('dotenv').config();

function verifyToken(req, res, next) {
   // Get the token from the request header (you can customize the header field)
   const token = req.header("Authorization");

   // Check if a token is present
   if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
   }

   try {
      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.jwtSecret);

      // Attach the decoded payload to the request object
      req.user = decoded;

      // Continue with the next middleware or route handler
      next();
   } catch (error) {
      return res.status(401).json({ message: "Invalid token." });
   }
}

module.exports = verifyToken;
