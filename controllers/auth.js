const { envsConfig } = require("../configs");
const { ctrlWrapper } = require("../decorators");
const { httpError } = require("../helpers");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const jimp = require("jimp");
const sendEMail = require("../services/emailService");
const { v4: uuidv4 } = require("uuid");

const register = async (req, res) => {
  const { email } = req.body;
  const isExist = await User.findOne({ email });

  if (isExist) {
    throw httpError(409, "Email in use");
  }

  const avatarUrl = gravatar.url(email);

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const verificationToken = uuidv4();
  const emailSettings = {
    to: email,
    subject: "Verification",
    text: "Please verify your email",
    html: `<a href="${envsConfig.baseUrl}/api/users/verify/${verificationToken}" target="_blank">Click to verify</a>`,
  };

  await sendEMail(emailSettings);

  const { email: userEmail, subscription } = await User.create({
    ...req.body,
    password: hashedPassword,
    verificationToken,
    avatarUrl,
  });
  res.status(201).json({ user: { email: userEmail, subscription } });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const isExist = await User.findOne({ email });

  if (!isExist) {
    throw httpError(401, `Email or password is wrong`);
  }

  if (!isExist.verify) {
    throw httpError(401, "Email has not been verified");
  }

  const isPasswordSame = await bcrypt.compare(password, isExist.password);
  if (!isPasswordSame) {
    throw httpError(401, "Email or password is wrong");
  }

  const token = await jsonwebtoken.sign(
    { id: isExist.id },
    envsConfig.jwtSecret
  );
  await User.findByIdAndUpdate(isExist.id, { token });

  res.json({
    user: {
      email: isExist.email,
      subscription: isExist.subscription,
    },
    token,
  });
};

const current = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
};

const logout = async (req, res) => {
  const { id } = req.user;

  await User.findByIdAndUpdate(id, { token: null });

  res.status(204).json("No Content");
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const oldPath = req.file.path;
  const newPath = path.resolve("public/avatars", req.file.originalname);

  await jimp
    .read(oldPath)
    .then((image) => {
      return image.resize(250, 250).write(newPath);
    })
    .catch((err) => {
      console.error("Error resizing avatar:", err.message);
      throw new Error("Error resizing avatar");
    });

  const avatarUrl = req.file.originalname;
  await User.findByIdAndUpdate(_id, { avatarUrl }, { new: true });

  res.json({
    avatarUrl,
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw httpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verificationToken: "",
    verify: true,
  });
  res.json({ message: "Verification successful" });
};

const resend = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw httpError(400, "User is not found");
  }

  if (user.isVerified) {
    throw httpError(400, "Verification has already been passed");
  }

  const emailSettings = {
    to: email,
    subject: "Verification",
    text: "Please verify your email",
    html: `<a href="${envsConfig.baseUrl}/api/users/verify/${user.verificationToken}" target="_blank">Click to verify</a>`,
  };

  await sendEMail(emailSettings);

  res.json({ message: "Verification email sent" });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  current: ctrlWrapper(current),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
  verify: ctrlWrapper(verify),
  resend: ctrlWrapper(resend),
};
