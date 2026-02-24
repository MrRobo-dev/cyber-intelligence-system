const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 🔴 Yaha apna MongoDB Atlas connection string paste karna
mongoose.connect("PASTE_YOUR_MONGODB_CONNECTION_STRING")
.then(() => console.log("Database Connected"))
.catch(err => console.log(err));

const userSchema = new mongoose.Schema({
    name: String,
    mobile: String,
    address: String,
    dob: String,
    idNumber: String
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.send("Backend Running Successfully 🚀");
});

app.post("/search", async (req, res) => {
    const { type, value } = req.body;

    let result;
    if (type === "mobile") {
        result = await User.findOne({ mobile: value });
    } else {
        result = await User.findOne({ name: value });
    }

    if (result) {
        res.json({ found: true, data: result });
    } else {
        res.json({ found: false });
    }
});

app.post("/add", async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.json({ message: "Data Added" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
