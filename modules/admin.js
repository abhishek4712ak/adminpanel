import jwt from "jsonwebtoken";
import userSchema from "../models/user.model.js";
import { Router } from "express";
import bcrypt from "bcryptjs";
import ipSchema from "../models/ip.model.js"
import { verifyAdmin, isAdminLoggedIn } from "../middleware/auth.js";


const router = Router();


// GET: Show update role form for a user
router.get('/update-user/:id', verifyAdmin, async (req, res) => {
  const userId = req.params.id;
  const currentUsername = req.user && req.user.username ? req.user.username : null;
  try {
    const userToUpdate = await userSchema.findById(userId, 'username role');
    const users = await userSchema.find({}, 'username role');
    if (!userToUpdate) {
      return res.render('registerRole', {
        message: 'User not found.',
        success: false,
        users,
        username: currentUsername
      });
    }
    res.render('registerRole', {
      users,
      username: currentUsername,
      updateUser: userToUpdate
    });
  } catch (err) {
    console.error('Update user GET error:', err);
    const users = await userSchema.find({}, 'username role');
    res.render('registerRole', {
      message: 'Error loading user for update.',
      success: false,
      users,
      username: currentUsername
    });
  }
});

// POST: Update a user's role
router.post('/update-user/:id', verifyAdmin, async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;
  const currentUsername = req.user && req.user.username ? req.user.username : null;
  try {
    await userSchema.findByIdAndUpdate(userId, { role });
    const users = await userSchema.find({}, 'username role');
    res.render('registerRole', {
      message: 'User role updated successfully!',
      success: true,
      users,
      username: currentUsername
    });
  } catch (err) {
    console.error('Update user POST error:', err);
    const users = await userSchema.find({}, 'username role');
    res.render('registerRole', {
      message: 'Error updating user role.',
      success: false,
      users,
      username: currentUsername
    });
  }
});




// GET /tyro (only for admin)
router.get("/tyro", verifyAdmin, (req, res) => {
  console.log("/tyro accessed by:", req.user.username);
  const username = req.user && req.user.username ? req.user.username : null;
  res.render("tyro", { username });
});


import eventModel from "../models/event.js";

// GET /addEvents (only for admin)
router.get("/addEvents", verifyAdmin, async (req, res) => {
  console.log("/addEvents accessed by:", req.user.username);
  const username = req.user && req.user.username ? req.user.username : null;
  let events = [];
  try {
    events = await eventModel.find({});
  } catch (err) {
    console.error("Error fetching events:", err);
  }
  res.render("addEvents", { username, events });
});

// POST /addEvents (only for admin)
router.post("/addEvents", verifyAdmin, async (req, res) => {
  const { event, description, type, venue, time, limit } = req.body;
  const username = req.user && req.user.username ? req.user.username : null;
  try {
    await eventModel.create({ event, description, type, venue, time, limit });
    console.log("Added event:", event);
  } catch (err) {
    console.error("Error adding event:", err);
  }
  // After adding, fetch updated list
  let events = [];
  try {
    events = await eventModel.find({});
  } catch (err) {
    console.error("Error fetching events:", err);
  }
  res.render("addEvents", { username, events });
});

// GET /addip (only for admin)

router.get("/addip", verifyAdmin, async (req, res) => {
  console.log("/addip accessed by:", req.user.username);
  const username = req.user && req.user.username ? req.user.username : null;
  let ips = [];
  let message = req.query.message || null;
  try {
    ips = await ipSchema.find({});
  } catch (err) {
    console.error("Error fetching IPs:", err);
  }
  res.render("addip", { username, ips, message });
});

// Add new IP
router.post("/addip", verifyAdmin, async (req, res) => {
  const { ipAddress, name } = req.body;
  // const username = req.user && req.user.username ? req.user.username : null;
  let message = '';
  try {
    await ipSchema.create({ ipAddress, name });
    console.log("Added IP:", ipAddress, name);
    message = encodeURIComponent("IP added successfully!");
  } catch (err) {
    console.error("Error adding IP:", err);
    message = encodeURIComponent("Error adding IP.");
  }
  res.redirect(`/addip?message=${message}`);
});

// Remove IP
router.post("/addip/remove/:id", verifyAdmin, async (req, res) => {
  const ipId = req.params.id;
  try {
    await ipSchema.findByIdAndDelete(ipId);
    console.log("Removed IP with id:", ipId);
  } catch (err) {
    console.error("Error removing IP:", err);
  }
  res.redirect("/addip");
});

// GET /halt (only for admin)
router.get("/halt", verifyAdmin, async (req, res) => {
  console.log("/halt accessed by:", req.user);
  const username = req.user && req.user.username ? req.user.username : null;
  let events = [];
  try {
    events = await eventModel.find({});
  } catch (err) {
    console.error("Error fetching events:", err);
  }
  res.render("halt", { username, events });
});

// POST /halt/:id (only for admin) - Toggle halt status for individual event
router.post("/halt/:id", verifyAdmin, async (req, res) => {
  const eventId = req.params.id;
  const username = req.user && req.user.username ? req.user.username : null;
  try {
    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).send("Event not found");
    }
    // Toggle halt: if 0 (active), set to 1 (halted); if 1, set to 0
    event.halt = event.halt === 0 ? 1 : 0;
    await event.save();
    console.log(`Event ${event.event} halt status toggled to ${event.halt}`);
  } catch (err) {
    console.error("Error toggling halt status:", err);
  }
  // Redirect back to /halt to show updated list
  res.redirect("/halt");
});


// GET /register-role (only for admin)
router.get("/register-role", verifyAdmin, async (req, res) => {
  try {
    console.log("/register-role accessed by:", req.user);
    const users = await userSchema.find({}, "username role");
    const username = req.user && req.user.username ? req.user.username : null;
    res.render("registerRole", { users, username });
  } catch (err) {
    const username = req.user && req.user.username ? req.user.username : null;
    res.render("registerRole", {
      users: [],
      message: "Could not fetch users",
      success: false,
      username,
    });
  }
});

// POST /register-role (only for admin)
router.post("/register-role", verifyAdmin, async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const existingUser = await userSchema.findOne({ username });
    const currentUsername =
      req.user && req.user.username ? req.user.username : null;
    if (existingUser) {
      const users = await userSchema.find({}, "username role");
      return res.render("registerRole", {
        message: "Username already exists. Please choose another.",
        success: false,
        users,
        username: currentUsername,
      });
    }
    const newUser = new userSchema({
      username, role,password
    });
    await newUser.save();
    // After successful registration, show updated user list and success message
    const users = await userSchema.find({}, "username role");
    return res.render("registerRole", {
      message: "User registered successfully!",
      success: true,
      users,
      username: currentUsername,
    });
  } catch (err) {
    console.error("Register role error:", err);
    const users = await userSchema.find({}, "username role");
    const currentUsername =
      req.user && req.user.username ? req.user.username : null;
    res.render("registerRole", {
      message: "Internal server error during role registration",
      success: false,
      users,
      username: currentUsername,
    });
  }
});


// DELETE USER ROUTE
router.get('/delete-user/:id', verifyAdmin, async (req, res) => {
  const userId = req.params.id;
  const currentUsername = req.user && req.user.username ? req.user.username : null;
  try {
    await userSchema.findByIdAndDelete(userId);
    const users = await userSchema.find({}, 'username role');
    res.render('registerRole', {
      message: 'User deleted successfully!',
      success: true,
      users,
      username: currentUsername
    });
  } catch (err) {
    console.error('Delete user error:', err);
    const users = await userSchema.find({}, 'username role');
    res.render('registerRole', {
      message: 'Error deleting user.',
      success: false,
      users,
      username: currentUsername
    });
  }
});

// Redirect /registerRole to /register-role (for convenience)
router.get('/registerRole', (req, res) => {
  res.redirect('/register-role');
});

export default router;
