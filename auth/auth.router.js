const { Router } = require("express");
const router = Router();

const { check, validationResult } = require("express-validator");

const { hash, compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");

const AuthModel = require("./auth.model");

router.post(
  "/signup",
  [
    check("email").isEmail().normalizeEmail(),
    check("password").isLength({ min: 6 }),
  ],
  async (req, res, next) => {
    const { email, password } = req.body;

    const reqValidationErrors = validationResult(req);
    if (!reqValidationErrors.isEmpty())
      return res.status(400).json(reqValidationErrors);

    let foundUser;
    try {
      foundUser = await AuthModel.findOne({ email: email });
    } catch (error) {
      return res.status(500).json({ error: "Could not fetch user data" });
    }

    if (foundUser) return res.status(400).json({ error: "Could not process" });

    let hashedPass;
    try {
      hashedPass = await hash(password, 10);
    } catch (error) {
      return res.status(500).json({ error: "Could not hash password" });
    }
    const user = new AuthModel({
      email: email,
      password: hashedPass,
    });

    let savedUser;
    try {
      savedUser = await user.save();
    } catch (error) {
      return res.status(500).json({ error: "Could not save new user" });
    }

    let token;
    try {
      token = await sign(
        { userId: savedUser._id, email: savedUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
    } catch (error) {
      return res.status(500).json({ error: "Could not sign token" });
    }

    res.status(201).json({
      userId: savedUser._id,
      email: savedUser.email,
      token,
    });
  }
);

router.post(
  "/login",
  [
    check("email").isEmail().normalizeEmail(),
    check("password").isLength({ min: 6 }),
  ],
  async (req, res, next) => {
    const { email, password } = req.body;

    const reqValidationErrors = validationResult(req);
    if (!reqValidationErrors.isEmpty())
      return res.status(400).json(reqValidationErrors);

    let foundUser;
    try {
      foundUser = await AuthModel.findOne({ email: email });
    } catch (error) {
      return res.status(500).json({ error: "Could not fetch user data" });
    }

    if (!foundUser)
      return res
        .status(400)
        .json({ error: "Could not find user with this email" });

    if (!compare(password, foundUser.password))
      return res.status(400).json({ error: "Not valid Password" });

    let token;
    try {
      token = await sign(
        { userId: foundUser._id, email: foundUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
    } catch (error) {
      return res.status(500).json({ error: "Could not sign token" });
    }

    res.status(200).json({
      userId: foundUser._id,
      email: foundUser.email,
      token,
    });
  }
);

module.exports = router;
