const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// where we'll store contact form data (a simple JSON file)
const CONTACT_FILE = path.join(__dirname, "contact-data.json");

// read existing data
function readContacts() {
  try {
    const data = fs.readFileSync(CONTACT_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return []; // if file doesn't exist / empty
  }
}

// write data back to file
function writeContacts(list) {
  fs.writeFileSync(CONTACT_FILE, JSON.stringify(list, null, 2));
}

// ---------- ROUTES ----------

// just to test server
app.get("/", (req, res) => {
  res.send("Luna Bakery backend running ");
});

// CONTACT FORM ROUTE
app.post("/api/contact", (req, res) => {
  const { name, email, phone, orderType, date, message } = req.body;

  if (!name || !email || !phone || !orderType || !message) {
    return res.status(400).json({ success: false, message: "Missing fields" });
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

  res.json({ success: true, message: "Your request has been saved " });
});

// start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log('Backend server running at http://localhost:${PORT}');
});
