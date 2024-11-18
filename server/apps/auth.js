import { Router } from "express";
import bcrypt from "bcrypt";
import { db } from "../utils/db.js";
import jwt from "jsonwebtoken";

const authRouter = Router();

// 🐨 Todo: Exercise #1
// ให้สร้าง API เพื่อเอาไว้ Register ตัว User แล้วเก็บข้อมูลไว้ใน Database ตามตารางที่ออกแบบไว้
authRouter.post("/register", async (req, res) => {
  try {
    const user = {
      username: req.body.username,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    };

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(user.password, salt);

    const collection = db.collection("users");
    await collection.insertOne(user);

    return res.status(201).json({
      message: "User has been created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: `${error.message}`,
    });
  }
});

// 🐨 Todo: Exercise #3
// ให้สร้าง API เพื่อเอาไว้ Login ตัว User ตามตารางที่ออกแบบไว้
authRouter.post("/login", async (req, res) => {
  try {
    const user = await db.collection("users").findOne({
      username: req.body.username,
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Password is not valid",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
      },
      process.env.SECRET_KEY,
      { expiresIn: "900000" }
    );

    return res.json({
      message: "Login successfully",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: `${error.message}`,
    });
  }
});
export default authRouter;
