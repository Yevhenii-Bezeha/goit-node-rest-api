const { envsConfig } = require("../configs");
const { ctrlWrapper } = require("../decorators");
const { httpError } = require("../helpers");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const jimp = require("jimp");
const fs = require("fs");

const register = async (req, res) => {
  const { email } = req.body;
  const isExist = await User.findOne({ email });

  if (isExist) {
    throw httpError(409, "Email in use");
  }

  const avatarUrl = gravatar.url(email);

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const { email: userEmail, subscription } = await User.create({
    ...req.body,
    password: hashedPassword,
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

  if (!req.file) {
    throw httpError(401, "Not authorized");
  }

  const oldPath = req.file.path;
  const uniqueAvatarName = _id + "-" + req.file.originalname;
  const newPath = path.resolve("public/avatars", uniqueAvatarName);

  await jimp
    .read(oldPath)
    .then((image) => {
      return image.resize(250, 250).write(newPath);
    })
    .then(() => {
      fs.unlink(oldPath, (err) => {
        if (err) {
          console.error("Error deleting file:", err.message);
          throw new Error("Error deleting file");
        }
      });
    })
    .catch((err) => {
      console.error("Error processing file:", err.message);
      throw new Error("Error processing file");
    });

  const avatarUrl = "/avatars/" + uniqueAvatarName;

  await User.findByIdAndUpdate(_id, { avatarUrl }, { new: true });

  res.json({
    avatarUrl,
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  current: ctrlWrapper(current),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
};
