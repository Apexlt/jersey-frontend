import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./PaymentMethod.css";

export default function PaymentMethod() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const product = state?.product;
  const size = state?.size;
  const customer = state?.customer;

  const btcRate = state?.btcRate;
  const ethRate = state?.ethRate;
  const lockedAt = state?.lockedAt;
  const totalUsd = state?.totalUsd;

  const [coin, setCoin] = useState("BTC");
  const [animKey, setAnimKey] = useState(0);
  const [proof, setProof] = useState(null);

  // popupType: "success" | "expired" | null
  const [popupType, setPopupType] = useState(null);

  // ⏳ 10-minute expiry logic
  useEffect(() => {
    if (!lockedAt) return;

    const check = () => {
      const now = Date.now();

      if (now - lockedAt > 10 * 60 * 1000) {
        setPopupType("expired");
      }
    };

    check();
    const interval = setInterval(check, 1000);

    return () => clearInterval(interval);
  }, [lockedAt]);

  if (!product || !size || !customer) {
    return (
      <div className="paymentEmpty">
        <h2>No session found</h2>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  const wallet = {
    BTC: "bc1q7yj0k4x0l0u5s9z8m3d5u6v7w8x9y0z3a4",
    ETH: "0xexampleethwallet123",
    USDT: "TetherTRC20Wallet123",
  };

  const selectedWallet = wallet[coin];

  const btcAmount =
    btcRate && totalUsd ? (totalUsd / btcRate).toFixed(6) : "...";

  const ethAmount =
    ethRate && totalUsd ? (totalUsd / ethRate).toFixed(6) : "...";

  const amount =
    coin === "BTC"
      ? `${btcAmount} BTC ≈ $${totalUsd}`
      : coin === "ETH"
      ? `${ethAmount} ETH ≈ $${totalUsd}`
      : `$${totalUsd}`;

  return (
    <div className="paymentPage">

      {/* STEPS */}
      <div className="steps">
        <span>1. HOME</span>
        <span>2. CHECKOUT</span>
        <span className="active">3. PAYMENT</span>
      </div>

      <div className="paymentCard">

        {/* LEFT */}
        <div className="paymentLeft">
          <h2>Choose Payment Method</h2>
          <p className="sub">Rates locked for 10 minutes</p>

          <div className="coinGrid">
            {["BTC", "ETH", "USDT"].map((c) => (
              <div
                key={c}
                className={`coinCard ${coin === c ? "active" : ""}`}
                onClick={() => {
                  setCoin(c);
                  setAnimKey((p) => p + 1);
                }}
              >
                <h4>{c}</h4>
                <p>{c === "BTC" ? "Bitcoin" : c === "ETH" ? "Ethereum" : "USDT"}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div key={animKey} className="paymentRight">

          <h3>{coin} Payment</h3>

          <div className="walletBox">
            <input value={amount} readOnly />
            <button onClick={() => navigator.clipboard.writeText(amount)}>
              COPY
            </button>
          </div>

          <div className="walletBox" style={{ marginTop: "10px" }}>
            <input value={selectedWallet} readOnly />
            <button onClick={() => navigator.clipboard.writeText(selectedWallet)}>
              COPY
            </button>
          </div>

          {/* UPLOAD */}
          <div className="uploadBox">
            <label className="uploadBtn">
              📤 Upload Payment Screenshot
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setProof(e.target.files[0])}
              />
            </label>

            {proof && <p className="fileName">✅ {proof.name}</p>}
          </div>

          <button
            className={`paidBtn ${!proof ? "disabled" : ""}`}
            disabled={!proof}
            onClick={() => setPopupType("success")}
          >
            {proof ? "I HAVE PAID" : "Upload Proof First"}
          </button>

        </div>
      </div>

      {/* ================= POPUPS ================= */}

      {/* SUCCESS POPUP */}
      {popupType === "success" && (
        <div className="popupOverlay">
          <div className="popupCard successState">

            <div className="stateIcon">✅</div>

            <h2 className="stateTitle">Payment Submitted</h2>

            <p className="stateText">
              Your payment proof has been received.<br />
              We are currently verifying your transaction.
            </p>

            <div className="stateBadge successBadge">
              IN REVIEW
            </div>

            <button
              className="stateBtn successBtn"
              onClick={() => navigate("/")}
            >
              Back to Home
            </button>

          </div>
        </div>
      )}

      {/* EXPIRED POPUP */}
      {popupType === "expired" && (
        <div className="popupOverlay">
          <div className="popupCard expiredState">

            <div className="stateIcon">⏳</div>

            <h2 className="stateTitle">Payment Expired</h2>

            <p className="stateText">
              Your 10-minute payment window has ended.<br />
              Please restart checkout to continue.
            </p>

            <div className="stateBadge expiredBadge">
              SESSION CLOSED
            </div>

            <button
              className="stateBtn expiredBtn"
              onClick={() => navigate("/")}
            >
              Restart Checkout
            </button>

          </div>
        </div>
      )}

    </div>
  );
}