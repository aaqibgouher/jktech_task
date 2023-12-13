const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel, TokenModel } = require("../models");

const register = async (payload) => {
  // validate
  if (!payload || !payload.name || !payload.name.trim())
    throw "Name is required";
  if (!payload || !payload.email || !payload.email.trim())
    throw "Email is required";
  if (!payload || !payload.password || !payload.password.trim())
    throw "Password is required";

  const { name, email, password } = payload;

  if (!isEmail(email)) throw "Email is not valid";

  // check if user exist by that email, if exists throw error
  let user = await getUserByEmail(email);

  if (user)
    throw "User already exist with this email, please use another email";

  // if not, create user
  user = new UserModel({
    name,
    email,
    password: await encodePassword(password),
  });

  await user.save();

  return {
    name,
    email,
  };
};

const isEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const getUserByEmail = async (email) => {
  return UserModel.findOne({ email });
};

const encodePassword = async (password) => {
  const saltRounds = process.env.SALT_ROUNDS;
  return await bcrypt.hash(password, +saltRounds);
};

const login = async (payload) => {
  // validate
  if (!payload || !payload.email || !payload.email.trim())
    throw "Email is required";
  if (!payload || !payload.password || !payload.password.trim())
    throw "Password is required";

  const { email, password } = payload;

  if (!isEmail(email)) throw "Email invalid";

  // check if user exist by that email, if exists throw error
  let user = await getUserByEmail(email);

  if (!user) throw "Invalid email";

  //   check for password
  if (!(await isPasswordCorrect(password, user.password)))
    throw "Email/Password is invalid";

  //   generate the token
  const token = await generateToken({ userId: user._id });

  // save on tokens table
  await TokenModel.create({
    user: user._id,
    token,
  });

  return {
    email,
    token,
    userId: user._id,
  };
};

const isPasswordCorrect = async (password, correctPassword) => {
  return await bcrypt.compare(password, correctPassword);
};

const generateToken = async (payload) => {
  return await jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "1d" });
};

const verifyToken = async (payload) => {
  return await jwt.verify(payload.token, process.env.TOKEN_SECRET);
};

const getUserTokenByUserIdAndToken = async (userId, token) => {
  return await TokenModel.findOne({ user: userId, token });
};

const getUserById = async (id) => {
  return await UserModel.findOne({ _id: id });
};

const logout = async (payload) => {
  const { userId, token } = payload;

  //   remove token from db
  return TokenModel.deleteOne({ user: userId, token });
};

module.exports = {
  register,
  isEmail,
  getUserByEmail,
  encodePassword,
  login,
  isPasswordCorrect,
  generateToken,
  verifyToken,
  getUserTokenByUserIdAndToken,
  getUserById,
  logout,
};
