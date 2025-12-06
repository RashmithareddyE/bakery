const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

// file that stores contact form data (your "database")
const DATA_FILE = "contact-data.json";

function readContacts() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    const text = fs.readFileSync(DATA_FILE, "utf8");
    if (!text.trim()) return [];
    return JSON.parse(text);
  } catch (err) {
    console.error("Error reading contacts:", err);
    return [];
  }
}

function writeContacts(list) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2));
}

// simple test route
app.get("/", (req, res) => {
  res.send("Luna Bakery backend running");
});

// CONTACT FORM ROUTE
app.post("/api/contact", (req, res) => {
  const { name, email, phone, orderType, date, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  const contacts = readContacts();

  contacts.push({
    name,
    email,
    phone,
    orderType,
    date,
    message,
    createdAt: new Date().toISOString(),
  });

  writeContacts(contacts);

  res.json({ success: true, message: "Your request has been saved ✅" });
});

// start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log('Backend server running at http://localhost:${PORT}');
});
// ===== USERS (LOGIN / SIGNUP) =====
const USERS_FILE = "users.json";

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    const text = fs.readFileSync(USERS_FILE, "utf8");
    if (!text.trim()) return [];
    return JSON.parse(text);
  } catch (err) {
    console.error("Error reading users:", err);
    return [];
  }
}

function writeUsers(list) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(list, null, 2));
}
// SIGNUP
app.post("/api/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const users = readUsers();

  // check if user already exists
  if (users.find((u) => u.email === email)) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists with this email" });
  }

  users.push({
    name,
    email,
    password, // plain text just for project (not safe for real app)
    createdAt: new Date().toISOString(),
  });

  writeUsers(users);

  res.json({ success: true, message: "Signup successful " });
});
// LOGIN
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password required" });
  }

  const users = readUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  }

  // For project, just send success (no tokens)
  res.json({
    success: true,
    message: `Welcome back, ${user.name}!`,
    name: user.name,
    email: user.email,
  });
});