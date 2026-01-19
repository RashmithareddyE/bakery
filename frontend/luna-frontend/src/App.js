import "./style2.css";
import { useState } from "react";
import axios from "axios";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  //  CONTACT FORM HANDLER
  const handleContactSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value;
    const phone = form.phone.value;
 
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[6-9]\d{9}$/;

  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address");
    return;
  }

  if (!phonePattern.test(phone)) {
    alert("Please enter a valid 10-digit mobile number");
    return;
  }


    const hasCartItems = cart.length > 0;
    const orderTypeText = form.orderType.value.trim();

    // Either: cart has items OR user must describe cake manually
    if (!hasCartItems && !orderTypeText) {
      alert(
        "Either add items to your cart OR describe your cake in 'Cake / order type'."
      );
      return;
    }

    const data = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      orderType: orderTypeText, // can be empty if using cart only
      date: form.date.value,
      message: form.message.value,
      items: hasCartItems ? cart : [],
      totalAmount: hasCartItems ? totalAmount : 0,
    };

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      alert(result.message || "Form submitted!");

      form.reset();
      if (hasCartItems) {
        setCart([]); // clear cart only if it was used
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  // 🟣 SIGNUP FUNCTION (FRONTEND -> BACKEND)
  const handleSignup = async () => {
    if (!signupEmail || !signupPassword) {
      alert("Enter email & password");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/signup", {
        email: signupEmail,
        password: signupPassword,
      });

      alert(res.data.message || "Signup successful");
      setShowSignup(false);
    } catch (err) {
      console.error("SIGNUP ERROR:", err);
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  // 🔵 LOGIN FUNCTION (FRONTEND -> BACKEND)
  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      alert("Enter email & password");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email: loginEmail,
        password: loginPassword,
      });

      alert(res.data.message || "Login successful");
      setShowLogin(false);
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      alert(err.response?.data?.message || "Invalid login details");
    }
  };

  // 🛒 CART LOGIC
  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  const totalAmount = cart.reduce((sum, item) => {
    const num = Number(item.price.replace(/[^\d]/g, ""));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  return (
    <>
      {/* HERO + NAVBAR */}
      <section className="hero" id="home">
        <nav className="navbar">
          <div className="nav-inner">
            <div className="nav-brand">
              <div className="brand-name">Luna Bakery</div>
              <div className="brand-caption">Moonlit flavors, freshly baked.</div>
            </div>

            <form
              className="nav-search"
              onSubmit={(e) => {
                e.preventDefault();
                document
                  .getElementById("menu")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              <input
                type="text"
                id="searchInput"
                placeholder="Search cakes..."
                value={search}
                onChange={(e) => setSearch(e.target.value.toLowerCase())}
              />
            </form>

            <div className="nav-links">
              <a href="#home">Home</a>
              <a href="#about">About</a>
              <a href="#menu">Menu</a>
              <a href="#gallery">Gallery</a>
              <a href="#services">Services</a>
              <a href="#contact">Contact</a>
              <a href="#cart">Cart</a>

              <span className="auth-btn" onClick={() => setShowSignup(true)}>
                Sign Up
              </span>
              <span className="auth-btn login" onClick={() => setShowLogin(true)}>
                Login
              </span>
            </div>
          </div>
        </nav>

        <div className="hero-content">
          <h1 className="hero-brand italic">Luna Bakery</h1>
          <p className="hero-caption">
            Treat yourself to freshly baked happiness.
          </p>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section" id="about">
        <div className="section-inner">
          <h2 className="section-title">About Us</h2>
          <p className="section-text center">
            At Luna Bakery, we believe every treat should feel like a little
            piece of magic. From freshly baked cakes to handcrafted pastries, we
            bring sweetness to your moments with love and care. Our mission is
            simple to make your day brighter, one bite at a time.
          </p>
        </div>
      </section>

      {/* MENU */}
      <section className="section" id="menu">
        <div className="section-inner">
          <h2 className="section-title">Our Menu</h2>
          <p className="section-text center">
            Choose from our customer-favorite cakes and sweet treats.
          </p>

          <div className="menu-grid">
            {[
              {
                name: "chocolate",
                title: "Classic Chocolate Cake",
                price: "₹550",
                img: "/images/classychocolate.jpg",
              },
              {
                name: "red velvet",
                title: "Red Velvet Delight",
                price: "₹580",
                img: "/images/redvelvet.jpeg",
              },
              {
                name: "black forest",
                title: "Black Forest Bliss",
                price: "₹520",
                img: "/images/balckforest.jpeg",
              },
              {
                name: "butterscotch",
                title: "Butterscotch Crunch",
                price: "₹540",
                img: "/images/butterscotch.jpg",
              },
              {
                name: "strawberry",
                title: "Strawberry Cream Cake",
                price: "₹560",
                img: "/images/STRAWBERRYCAKE.webp",
              },
              {
                name: "vanilla",
                title: "Vanilla Sprinkle Cake",
                price: "₹500",
                img: "/images/venilasprinkle.jpg",
              },
              {
                name: "caramel",
                title: "Caramel Drizzle Cake",
                price: "₹590",
                img: "/images/carameldrizzle.webp",
              },
              {
                name: "oreo",
                title: "Oreo Crunch Cake",
                price: "₹570",
                img: "/images/oreocrunch.jpeg",
              },
              {
                name: "mango",
                title: "Mango Fresh Cream Cake",
                price: "₹580",
                img: "/images/mango.jpeg",
              },
              {
                name: "coffee mocha",
                title: "Coffee Mocha Cake",
                price: "₹600",
                img: "/images/coffee2.jpeg",
              },
            ]
              .filter((item) => item.name.includes(search))
              .map((item) => (
                <div className="menu-card" key={item.name}>
                  <div className="menu-img-wrapper">
                    <img src={item.img} alt={item.title} />
                  </div>
                  <h3>{item.title}</h3>
                  <p className="price">{item.price}</p>
                  <button className="add-btn" onClick={() => addToCart(item)}>
                    Add to Cart
                  </button>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="section" id="gallery">
        <div className="section-inner">
          <h2 className="section-title">Gallery</h2>
          <p className="section-text center">
            A peek at some of our favorite creations for birthdays, weddings and
            special days.
          </p>

          <div className="gallery-grid">
            <div className="gallery-item gallery-birthday">
              <span>Birthday Cake</span>
            </div>
            <div className="gallery-item gallery-wedding">
              <span>Wedding Cake</span>
            </div>
            <div className="gallery-item gallery-cupcakes">
              <span>Cupcakes</span>
            </div>
            <div className="gallery-item gallery-photo">
              <span>Photo Cake</span>
            </div>
            <div className="gallery-item gallery-theme">
              <span>Theme Cake</span>
            </div>
            <div className="gallery-item gallery-pastries">
              <span>Pastries</span>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section" id="services">
        <div className="section-inner">
          <h2 className="section-title">Our Services</h2>
          <p className="section-text center">
            We bake for every occasion and customize your order the way you like
            it.
          </p>

          <div className="card-grid">
            <div className="card">
              <h3>Custom Birthday Cakes</h3>
              <p>Personalized designs in your favorite flavors and themes.</p>
            </div>
            <div className="card">
              <h3>Wedding Cakes</h3>
              <p>Elegant multi-tier cakes to make your big day even sweeter.</p>
            </div>
            <div className="card">
              <h3>Cupcake & Pastry Orders</h3>
              <p>Perfect for parties, office events and small gatherings.</p>
            </div>
            <div className="card">
              <h3>Photo & Theme Cakes</h3>
              <p>Cartoon, character and photo cakes for kids and adults.</p>
            </div>
            <div className="card">
              <h3>Bulk / Corporate Orders</h3>
              <p>Special pricing and packaging for bulk celebrations.</p>
            </div>
            <div className="card">
              <h3>Same-Day Orders*</h3>
              <p>Limited flavors available for same-day pickup (T&amp;C apply).</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section" id="contact">
        <div className="section-inner contact-layout">
          <div className="contact-info">
            <h2 className="section-title">Contact & Orders</h2>
            <p className="section-text">
              Have a cake in mind? Share your details and we’ll get back to you
              with confirmation and pricing.
            </p>
            <p className="section-text">
              <strong>Address:</strong> Moonlight Street, Sweet Town, India
              <br />
              <strong>Phone:</strong> +91-98765-43210
              <br />
              <strong>Email:</strong> hello@lunabakery.com
            </p>
          </div>

          <form className="contact-form" onSubmit={handleContactSubmit}>
            <div className="form-row">
              <input
                name="name"
                type="text"
                placeholder="Your name"
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Your email"
                required
              />
            </div>
            <div className="form-row">
              <input
                name="phone"
                type="text"
                placeholder="Phone number"
                required
              />
              <input
                name="orderType"
                type="text"
                placeholder="Cake / order type (only if custom)"
              />
            </div>
            <div className="form-row">
              <input name="date" type="date" />
            </div>
            <div className="form-row">
              <textarea
                name="message"
                rows="4"
                placeholder="Message / design details"
                required
              ></textarea>
            </div>
            <button type="submit" className="hero-btn">
              Send Request
            </button>
          </form>
        </div>
      </section>

      {/* 🛒 CART SECTION */}
      <section className="section" id="cart">
        <div className="section-inner">
          <h2 className="section-title">Your Cart</h2>

          {cart.length === 0 ? (
            <p className="section-text center">
              No items in cart yet. Please add some cakes from the menu. ✨
            </p>
          ) : (
            <>
              <ul className="cart-list">
                {cart.map((item, index) => (
                  <li key={index} className="cart-item">
                    <div>
                      Selected item {index + 1}: <span>"{item.title}"</span> :{" "}
                      <strong>{item.price}</strong>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(index)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>

              <p className="cart-total">
                Total amount: <strong>₹{totalAmount}</strong>
              </p>
              

              {/* Go to Contact & Orders */}
              <button
                className="hero-btn"
                onClick={() =>
                  document
                    .getElementById("contact")
                    .scrollIntoView({ behavior: "smooth" })
                }
              >
                Proceed to Checkout
              </button>

              <p className="section-text center">
                Payment mode: <strong>Cash on Delivery</strong>
                <br />
                Thank you for choosing Luna Bakery! 🎂
              </p>
            </>
          )}
        </div>
      </section>

      {/* LOGIN POPUP */}
      {showLogin && (
        <div className="popup">
          <div className="popup-box">
            <h2>Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <input  
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            <button className="close-btn" onClick={() => setShowLogin(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* SIGNUP POPUP */}
      {showSignup && (
        <div className="popup">
          <div className="popup-box">
            <h2>Sign Up</h2>
            <input
              type="email"
              placeholder="Email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
            />
            <button onClick={handleSignup}>Sign Up</button>
            <button className="close-btn" onClick={() => setShowSignup(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <span className="brand-name small">Luna Bakery</span>
          <span className="footer-text">
            © 2025 Luna Bakery. All rights reserved.
          </span>
        </div>
      </footer>
    </>
  );
}

export default App;