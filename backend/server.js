const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------- MIDDLEWARE ----------------
app.use(cors());
app.use(express.json());

// ---------------- FILE PATHS ----------------
const CONTACT_FILE = path.join(__dirname, "contacts.json");
const USERS_FILE = path.join(__dirname, "users.json");

// ---------------- HELPERS ----------------
function readJson(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, "utf-8");
  if (!data.trim()) return [];
  return JSON.parse(data);
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ---------------- ROOT ----------------
app.get("/", (req, res) => {
  res.send("Luna Bakery backend running");
});

// ---------------- CONTACT ----------------
app.post("/api/contact", (req, res) => {
  const { name, email, phone, orderType, date, message, items, totalAmount } =
    req.body;

  if (!name || !email || !phone || !message) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  const contacts = readJson(CONTACT_FILE);

  contacts.push({
    name,
    email,
    phone,
    orderType: orderType || null,
    date: date || null,
    message,
    items: items || [],
    totalAmount: totalAmount || 0,
    createdAt: new Date().toISOString(),
  });

  writeJson(CONTACT_FILE, contacts);

  res.json({
    success: true,
    message: "Your order has been saved!",
  });
});

// ---------------- SIGNUP ----------------
app.post("/api/signup", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password required" });
  }

  const users = readJson(USERS_FILE);

  if (users.find((u) => u.email === email)) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }

  users.push({ email, password });
  writeJson(USERS_FILE, users);

  res.json({ success: true, message: "Signup successful" });
});

// ---------------- LOGIN ----------------
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const users = readJson(USERS_FILE);
  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email or password" });
  }

  res.json({ success: true, message: "Login successful" });
});

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
