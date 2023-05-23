import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const checkAuth = async (req, res, next) => {
  try {
    let token = req.cookies.jwt;
    if (token) {
      const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(verifiedToken.userId).select(-password);
      next();
    } else {
      res
        .status(401)
        .json({ error: "UNAUTHORIZED", message: "No JWT provided" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { checkAuth };
