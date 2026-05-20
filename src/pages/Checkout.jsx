import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Checkout.css";
import { API_BASE } from "../config";

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const product = state?.product;
  const size = state?.size;

  const [btcRate, setBtcRate] = useState(null);
  const [ethRate, setEthRate] = useState(null);

  const [form, setForm] = useState({
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
  });

  useEffect(() => {
    async function getRates() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
        );
        const data = await res.json();

        setBtcRate(data.bitcoin.usd);
        setEthRate(data.ethereum.usd);
      } catch (err) {
        console.log("RATE ERROR:", err);
      }
    }

    getRates();
  }, []);

  if (!product || !size) {
    return (
      <div className="checkoutEmpty">
        <h2>No product selected</h2>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  const handleContinue = async () => {
    const { email, phone, address, city, country } = form;

    if (!email || !phone || !address || !city || !country) {
      return alert("Please fill all details including phone number");
    }

    try {
      const res = await fetch(`${API_BASE}/api/payment/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product,
          size,
          customer: form,
          totalUsd: product.price + 10,
          paymentMethod: "USDC",
        }),
      });

      const data = await res.json();

      console.log("ORDER RESPONSE:", data);

      if (!data.success) {
        return alert("Failed to create order");
      }

      navigate("/payment", {
        state: {
          product,
          size,
          customer: form,
          btcRate,
          ethRate,
          totalUsd: product.price + 10,
          lockedAt: Date.now(),
          orderId: data.orderId,
        },
      });

    } catch (err) {
      console.error("ORDER ERROR:", err);
      alert("Server error while creating order");
    }
  };

  return (
    <div className="checkoutPage">

      <div className="checkoutLeft">
        <h2>Checkout</h2>
        <p className="sub">Secure Crypto Payment</p>

        <input placeholder="Email"
          onChange={(e)=>setForm({...form,email:e.target.value})}
        />

        <input placeholder="Phone Number"
          onChange={(e)=>setForm({...form,phone:e.target.value})}
        />

        <input placeholder="Address"
          onChange={(e)=>setForm({...form,address:e.target.value})}
        />

        <input placeholder="City"
          onChange={(e)=>setForm({...form,city:e.target.value})}
        />

        <input placeholder="Country"
          onChange={(e)=>setForm({...form,country:e.target.value})}
        />

        <div className="btcBox">
          <p>Live Rates:</p>
          <h4>
            BTC: {btcRate ? `$${btcRate}` : "..."} <br />
            ETH: {ethRate ? `$${ethRate}` : "..."}
          </h4>
        </div>

        <button onClick={handleContinue}>
          Continue to Payment
        </button>
      </div>

      <div className="checkoutRight">
        <h3>Order Summary</h3>

        <div className="summaryCard">
          <img src={product.image} />
          <div>
            <p>{product.name || "Product"}</p>
            <p>Size: {size}</p>
            <p className="price">${product.price}</p>
          </div>
        </div>

        <div className="totalBox">
          <p>Subtotal</p>
          <p>${product.price}</p>

          <p>Delivery</p>
          <p>$10</p>

          <h2>Total: ${(product.price + 10).toFixed(2)}</h2>
        </div>
      </div>

    </div>
  );
}