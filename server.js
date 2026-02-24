const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// ================= DATABASE CONNECT =================
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected ✅"))
.catch((err) => console.log("MongoDB Connection Error:", err));

// ================= SCHEMA =================
const userSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  address: String,
  dob: String,
  idNumber: String
});

const User = mongoose.model("User", userSchema);

// ================= HOME ROUTE =================
app.get("/", (req, res) => {
  res.send("Backend Running Successfully ✅");
});

// ================= SEARCH ROUTE =================
app.get("/search", async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.json({ message: "Please provide search query ?q= " });
    }

    const user = await User.findOne({
      $or: [
        { name: query },
        { mobile: query },
        { idNumber: query }
      ]
    });

    if (!user) {
      return res.json({ message: "No data found ❌" });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

// ================= SERVER START =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
