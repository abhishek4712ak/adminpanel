
import userSchema from "../models/user.model.js";
import cookieParser from "cookie-parser";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Router } from "express";
import { isAdminLoggedIn } from "../middleware/auth.js";


const router = Router();
router.use(cookieParser());
router.use(express.urlencoded({ extended: true }));

// Before Login page
router.get("/beforelogin", (req, res) => {
    res.render("login", { username: null });
});

// Admin Panel Home Route
router.get("/login", isAdminLoggedIn, async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.render("login", { message: null, username: null })
})

router.get("/home", isAdminLoggedIn, (req, res) => {
    console.log("/home accessed by:", req.user);
    const username = req.user && req.user.username ? req.user.username : null;
    res.render("home", { username });
})

// Login Route

router.post("/login", async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    //check whether the user exists

    const user = await userSchema.findOne({ username: username });
    if (!user) {
        console.log("Username not found")
        return res.render("login", { message: "Username Not Found!", username: null })
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
        return res.render("login", { message: "Wrong Credentials!", username: null })
    }

    //create a payload for serialize

    const userPayload = {
        username: user.username,
        role: user.role
    }

    //generate a token for the payload

    const token = await jwt.sign(userPayload, process.env.JWT_SECRET, {
        expiresIn: '300m', // Token expiration time

    });

    // Set the JWT token as a cookie in the response
    await res.cookie('jwt', token, {
        httpOnly: true // Make the cookie accessible only via HTTP (not JavaScript)

    });



    //if the login is successfull
    res.redirect(302, "/home")



})

router.get('/logout',async (req, res) => {

     res.clearCookie('jwt');
    res.redirect('/login'); // Redirect to the login page or any other appropriate destination
});



export default router;














