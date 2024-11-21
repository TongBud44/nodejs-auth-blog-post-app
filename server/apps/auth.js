import { Router } from "express";
// import bcrypt from "bcrypt";
// import { db } from "../utils/db.js";
// import jwt from "jsonwebtoken";
import { supabase } from "../utils/supabase.js";
import connectionPool from "../utils/db.js";

const authRouter = Router();

// 🐨 Todo: Exercise #1
// ให้สร้าง API เพื่อเอาไว้ Register ตัว User แล้วเก็บข้อมูลไว้ใน Database ตามตารางที่ออกแบบไว้
authRouter.post("/register", async (req, res) => {
  const { email, password, username, name } = req.body;

  try {
    // Sign up the new user using Supabase
    const { data: authData, error: supabaseError } = await supabase.auth.signUp(
      {
        email,
        password,
      }
    );

    // Check for Supabase errors
    if (supabaseError) {
      if (supabaseError.code === "user_already_exists") {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }
      // Handle other Supabase errors
      return res
        .status(400)
        .json({ error: "Failed to create user. Please try again." });
    }
    const supabaseUserId = authData.user.id;

    // Insert user details into your PostgreSQL database
    const query = `
        INSERT INTO users (id, username, name, role)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;

    const values = [supabaseUserId, username, name, "user"];

    const { rows } = await connectionPool.query(query, values);

    return res.status(201).json({
      message: "User has been created successfully",
      user: rows[0],
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
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Check if the error is due to incorrect credentials
      if (
        error.code === "invalid_credentials" ||
        error.message.includes("Invalid login credentials")
      ) {
        return res.status(400).json({
          error: "Your password is incorrect or this email doesn’t exist",
        });
      }
      return res.status(400).json({ error: error.message });
    }
    console.log(data);
    return res.status(200).json({
      message: "Signed in successfully",
      access_token: data.session.access_token,
    });
  } catch {
    return res.status(500).json({ error: "An error occurred during login" });
  }
});
export default authRouter;
