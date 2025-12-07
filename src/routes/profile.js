// routes/profile.js
const express = require('express');
const router = express.Router();
const knex = require("../config/db");
const bcrypt = require("bcrypt");

// Middleware: Validate token from MySQL sessions table
async function authMiddleware(req, res, next) {
  try {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized. No token provided" });
    }

    // Find session in database
    const session = await knex("sessions").where({ token }).first();

    if (!session) {
      return res.status(401).json({ error: "Session expired or invalid" });
    }

    req.session = session; // contains user_id
    next();

  } catch (err) {
    console.error("Middleware Error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// -------------------------------
// GET PROFILE
// -------------------------------
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.session.user_id;

    const user = await knex("users")
      .select("id", "name", "email", "age", "dob", "contact")
      .where({ id: userId })
      .first();

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });

  } catch (err) {
    console.error("Profile GET Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------------------
// UPDATE PROFILE
// -------------------------------
router.put("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.session.user_id;
    const { name, age, dob, contact } = req.body;

    await knex("users")
      .where({ id: userId })
      .update({
        name,
        age: age || null,
        dob: dob || null,
        contact: contact || null,
        updated_at: knex.fn.now()
      });

    // update name inside sessions table also
    await knex("sessions")
      .where({ token: req.headers["authorization"] })
      .update({ updated_at: knex.fn.now() });

    res.json({ success: true });

  } catch (err) {
    console.error("Profile UPDATE Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------------------
// CHANGE PASSWORD
// -------------------------------
router.post("/change-password", authMiddleware, async (req, res) => {
  try {
    const userId = req.session.user_id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const user = await knex("users")
      .where({ id: userId })
      .first();

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(400).json({ error: "Old password incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);

    await knex("users")
      .where({ id: userId })
      .update({
        password: hashed,
        updated_at: knex.fn.now()
      });

    res.json({ success: true });

  } catch (err) {
    console.error("Password Change Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
