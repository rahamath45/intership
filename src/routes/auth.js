// routes/auth.js
const express = require("express");
const router = express.Router();
const knex = require("../config/db");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

// ---------------- REGISTER ----------------
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, age, dob, contact } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "Missing required fields" });

    // Already exists?
    const exists = await knex("users").where({ email }).first();
    if (exists)
      return res.status(400).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const [id] = await knex("users").insert({
      name,
      email,
      password: hashed,
      age: age || null,
      dob: dob || null,
      contact: contact || null
    });

    return res.json({ success: true, user_id: id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ---------------- LOGIN ----------------
// Uses KNEX + MySQL sessions table
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Missing email/password" });

    const user = await knex("users").where({ email }).first();

    if (!user)
      return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: "Invalid credentials" });

    // Create session token
    const token = uuidv4();

    await knex("sessions").insert({
      token,
      user_id: user.id
    });

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ---------------- LOGOUT ----------------
router.post("/logout", async (req, res) => {
  try {
    const token = req.headers["authorization"] || req.body.token;

    if (!token)
      return res.status(400).json({ error: "No token provided" });

    await knex("sessions").where({ token }).del();

    return res.json({ success: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
