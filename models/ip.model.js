import mongoose from "mongoose";

const ipSchema = new mongoose.Schema({
    ipAddress: { type: String, required: true, unique: true },
    name: { type: String, required: true }
});

export default mongoose.model("ip", ipSchema);