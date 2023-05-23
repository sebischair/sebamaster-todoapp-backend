import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// ROUTE POST /api/users/register
// adds new user
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // TODO: error handling for missing values
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      throw new Error("User already exists");
    }
    // add user to database
    const newUser = await User.create({ username, email, password });
    genToken(res, newUser._id);
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ROUTE POST /api/users/login
// logs in a user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.checkPassword(password))) {
      genToken(res, user._id);
      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
      });
    } else {
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// ROUTE POST /api/users/logout
// logs out a user
const logout = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User logged out successfully" });
};

const genToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: 86400,
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 86400,
  });
};

export { register, login, logout };
