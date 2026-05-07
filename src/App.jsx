import { useState } from "react";
import logo from "./assets/logo.jpg";
import "./App.css";

function App() {

  const [form, setForm] = useState({
    name: "",
    phone: "",
    amount: ""
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {

  const { name, phone, amount } = form;

  if (!name || !phone || !amount) {
    alert("Please fill all fields");
    return;
  }

  setLoading(true);

  try {

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/payment`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          ...form,
          employeeCode: "GENERAL"
        })
      }
    );

    const data = await res.json();

    if (!res.ok) {

      alert(data.message || "Payment failed");

      setLoading(false);

      return;
    }

    const formHTML = `
      <form id="ccavenueForm"
        method="post"
        action="https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction">

        <input
          type="hidden"
          name="encRequest"
          value="${data.encryptedData}" />

        <input
          type="hidden"
          name="access_code"
          value="${data.accessCode}" />

      </form>
    `;

    const div = document.createElement("div");

    div.innerHTML = formHTML;

    document.body.appendChild(div);

    document
      .getElementById("ccavenueForm")
      .submit();

  } catch (err) {

    console.log(err);

    alert("Cannot connect to server");

  } finally {

    setLoading(false);
  }
};

  return (
    <div className="app-container">

      <div className="donation-card">

        <div className="logo-wrapper">
          <img src={logo} alt="logo" />
        </div>

        <div className="card-header">
          <h2>Donate ❤️</h2>
          <p className="subtitle">
            Support Waves of Life
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>

          <div className="input-group">
            <input
              type="text"
              placeholder="Your Name"
              required
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value
                })
              }
            />
          </div>

          <div className="input-group">
            <input
              type="tel"
              placeholder="Phone Number"
              required
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value
                })
              }
            />
          </div>

          <div className="input-group">
            <input
              type="number"
              placeholder="Amount (₹)"
              required
              value={form.amount}
              onChange={(e) =>
                setForm({
                  ...form,
                  amount: e.target.value
                })
              }
            />
          </div>

         <button
      type="button"
      className="submit-btn"
      onClick={handleSubmit}
     disabled={loading}
    >
      {
        loading
          ? "Processing..."
          : "Submit & Pay"
      }
    </button>

        </form>

        <div className="card-footer">

          <a href="tel:9836440133">
            <span className="icon">📞</span>
            9836440133
          </a>

          <a
            href="https://wavesoflife.org.in/"
            target="_blank"
            rel="noreferrer"
          >
            <span className="icon">🌐</span>
            wavesoflife.org.in
          </a>

        </div>

      </div>

    </div>
  );
}

export default App;