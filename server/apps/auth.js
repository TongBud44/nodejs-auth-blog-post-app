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
// step 2 :อันดับแรก เราจะเริ่มจากการสร้าง API POST: /auth/login เพื่อใช้ Login
authRouter.post("/login", async (req, res) => {
  try {
    const user = await db.collection("users").findOne({
      username: req.body.username,
    });
    //step 2 :ขั้นแรกเราจะตรวจสอบว่า Username นี้มีในระบบหรือไม่ ด้วยการ Query หาใน Collection users ถ้าไม่มีก็ให้ Return ตัว Response กลับไปด้วย message ว่า user not found
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    //step 2 :ถ้ามี Username ในระบบ เราจะไปตรวจสอบ Password ต่อ ว่าตรงกับใน Database หรือไม่
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Password is not valid",
      });
    }
    //step 3 ต่อเนื่องจากด้านบน เมื่อ Password ตรงกันกับใน Database แล้ว ฝั่ง Server ก็จะต้องสร้าง Token ขึ้นมา ด้วย Function jwt.sign จาก Package jsonwebtoken
    const token = jwt.sign(
      {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
      },
      process.env.SECRET_KEY,
      { expiresIn: "900000" }
    );
    //Step 4: เมื่อสร้าง Token เสร็จเรียบร้อยแล้ว เราจะส่ง Response พร้อม Token ออกไปให้ Client
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
