
import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import restrictedIP from "./config/ipcheck.js";
import loginRouter from "./modules/auth.js";
import adminRouter from "./modules/admin.js";
import { isAdminLoggedIn } from "./middleware/auth.js";

dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.use(restrictedIP); // Apply the IP restriction middleware globally



app.get("/", (req, res) => {
  res.render("login");
});

app.get("/",isAdminLoggedIn, (req, res) => {
  res.render("home");
})


app.use("/", loginRouter);
app.use("/",adminRouter)

const PORT = process.env.PORT || 5000;
const address = process.env.ADDRESS || "http://localhost";
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit at ${address}:${PORT}`);
});
