import { useState } from "react";
import logo from "./assets/logo.jpg";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    amount: ""
  });

  const [saved, setSaved] = useState(false);
  const [upiLink, setUpiLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const { name, phone, amount } = form;

    if (!name || !phone || !amount) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

  const upiLink = `upi://pay?pa=${encodeURIComponent("Vyapar.172928190868@hdfcbank")}&pn=${encodeURIComponent("WavesOfLife")}&am=${amount}&cu=INR`;

    try {
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
        setSaved(true);
        setUpiLink(link);
      } else {
        alert(data.message || "Failed to save data");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Cannot connect to server");
    }

    setLoading(false);
  };

  const handleClick = () => {
    if (!saved) {
      handleSubmit();
    } else {
      window.location.href = upiLink;
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

        <form onSubmit={(e) => e.preventDefault()}>

          <div className="input-group">
            <input
              type="text"
              placeholder="Your Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={saved}
            />
          </div>

          <div className="input-group">
            <input
              type="tel"
              placeholder="Phone Number"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              disabled={saved}
            />
          </div>

          <div className="input-group">
            <input
              type="number"
              placeholder="Amount (₹)"
              required
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              disabled={saved}
            />
          </div>

          <button
            type="button"
            className="submit-btn"
            onClick={handleClick}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : saved
              ? "Proceed to Pay"
              : "Submit & Continue"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default App;