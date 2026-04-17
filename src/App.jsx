import { useState } from "react";
import logo from "./assets/logo.jpg"
import "./App.css";

function App() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    amount: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Sending data:", form);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/donate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = { message: "Invalid response" };
      }

      if (res.ok) {
        alert("Data saved! Redirecting to payment...");

        const upiLink = `upi://pay?pa=Vyapar.172928190868@hdfcbank&pn=WavesOfLife&am=${form.amount}&cu=INR&tn=${form.phone}`;

        window.location.href = upiLink;
      } else {
        alert("Failed to save data");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Cannot connect to server");
    }
  };

  return (
    <div className="app-container">
      <div className="donation-card">

        <img
    src={logo}
    alt="logo"
    className="card-logo"
  />
        
        <div className="card-header">
          <h2>Donate ❤️</h2>
          <p className="subtitle">Support Waves of Life</p>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div className="input-group">
            <input
              type="text"
              placeholder="Your Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="input-group">
            <input
              type="tel"
              placeholder="Phone Number"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div className="input-group">
            <input
              type="number"
              placeholder="Amount (₹)"
              required
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>

          <button type="submit" className="submit-btn">
            Proceed to Pay
          </button>

        </form>
      </div>
    </div>
  );
}

export default App;