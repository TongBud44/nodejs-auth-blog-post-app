import { Router } from "express";
import { db } from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
    return res.status(500).json({ message: error.message });
  }
});
// 🐨 Todo: Exercise #3
// ให้สร้าง API เพื่อเอาไว้ Login ตัว User ตามตารางที่ออกแบบไว้
authRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "username and password are required" });
    }

    const user = await db.collection("users").findOne({ username });
    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const isValidpassword = await bcrypt.compare(password, user.password);

    if (!isValidpassword) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, firstname: user.firstname, lastname: user.lastname },
      process.env.SECRET_KEY,
      { expiresIn: "15m" }
    );

    return res.status(200).json({
      message: "login successfully",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
export default authRouter;
