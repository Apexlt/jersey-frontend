import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import "./Checkout.css";
import { API_BASE } from "../config";

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const product = state?.product;
  const size = state?.size;

  const totalUsd = useMemo(
    () => (product ? product.price + 10 : 0),
    [product]
  );

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
    let ignore = false;

    fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
    )
      .then((res) => res.json())
      .then((data) => {
        if (ignore) return;
        setBtcRate(data.bitcoin.usd);
        setEthRate(data.ethereum.usd);
      })
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, []);

  if (!product || !size) {
    return (
      <div className="checkoutEmpty">
        <h2>No product selected</h2>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  const handleContinue = () => {
    const { email, phone, address, city, country } = form;

    if (!email || !phone || !address || !city || !country) {
      return alert("Please fill all fields");
    }

    // ⚡ INSTANT NAVIGATION (NO WAIT)
    navigate("/payment", {
      state: {
        product,
        size,
        customer: form,
        btcRate,
        ethRate,
        totalUsd,
        lockedAt: Date.now(),
        orderId: null,
      },
    });

    // ⚡ BACKGROUND API CALL (DOES NOT BLOCK UI)
    fetch(`${API_BASE}/api/payment/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product,
        size,
        customer: form,
        totalUsd,
        paymentMethod: "USDC",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("ORDER CREATED:", data);
      })
      .catch((err) => {
        console.error("BACKGROUND ORDER ERROR:", err);
      });
  };

  return (
    <div className="checkoutPage">

      <div className="checkoutLeft">
        <h2>Checkout</h2>
        <p className="sub">Secure Crypto Payment</p>

        <input
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          placeholder="Phone Number"
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <input
          placeholder="Address"
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
        />

        <input
          placeholder="City"
          onChange={(e) =>
            setForm({ ...form, city: e.target.value })
          }
        />

        <input
          placeholder="Country"
          onChange={(e) =>
            setForm({ ...form, country: e.target.value })
          }
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
          <img src={product.image} alt="product" />

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

          <h2>Total: ${totalUsd.toFixed(2)}</h2>
        </div>
      </div>

    </div>
  );
}
