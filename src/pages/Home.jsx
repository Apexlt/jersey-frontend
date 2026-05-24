import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

import { FaFacebook, FaInstagram, FaEnvelope } from "react-icons/fa";

import logo from "../assets/logo.webp";
import jersey1 from "../assets/ronaldo100.webp";
import jersey2 from "../assets/ronaldo200.webp";
import jersey3 from "../assets/ronaldo300.webp";
import jersey4 from "../assets/ronaldo400.webp";

export default function Home() {
  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [popup, setPopup] = useState(false);

  const jerseys = useMemo(
    () => [
      { id: 1, price: 149.99, image: jersey1 },
      { id: 4, price: 149.99, image: jersey4 },
      { id: 3, price: 149.99, image: jersey3 },
      { id: 2, price: 149.99, image: jersey2 },
    ],
    []
  );

  const sizes = useMemo(() => ["S", "M", "L", "XL"], []);
  const current = jerseys[activeIndex];

  const next = () =>
    setActiveIndex((p) => (p + 1) % jerseys.length);

  const prev = () =>
    setActiveIndex((p) =>
      p === 0 ? jerseys.length - 1 : p - 1
    );

  const selectSize = (id, size) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [id]: size,
    }));
  };

  const handleBuy = () => {
    const size = selectedSizes[current.id];

    if (!size) {
      setPopup(true);
      return;
    }

    navigate("/checkout", {
      state: {
        product: current,
        size,
      },
    });
  };

  return (
    <div className="page">

      {/* POPUP */}
      {popup && (
        <div className="popupOverlay" onClick={() => setPopup(false)}>
          <div className="popupCard errorState">
            <h2>⚠️ Select a size first</h2>
            <p>You need to choose a jersey size before continuing.</p>
            <button onClick={() => setPopup(false)}>OK</button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="header">
        <div className="headerLeft">
          <div className="divider"></div>
          <img src={logo} alt="Al Nassr Logo" className="logo" />
        </div>

        <div className="menu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <h1 className="title">Al Nassr Signed Collection</h1>
        <p className="subtitle">Limited jerseys</p>
      </section>

      {/* SLIDER */}
      <section className="sliderWrapper">
        <button className="navBtn" onClick={prev}>◀</button>

        <div className="card">
          <img src={current.image} className="image" />

          <div className="overlay">
            <p className="price">${current.price}</p>

            {/* SIZE */}
            <div className="sizeContainer">
              {sizes.map((size) => (
                <button
                  key={size}
                  className="sizeButton"
                  onClick={() => selectSize(current.id, size)}
                  style={{
                    background:
                      selectedSizes[current.id] === size
                        ? "#FFD700"
                        : "rgba(255,255,255,0.05)",
                    color:
                      selectedSizes[current.id] === size
                        ? "black"
                        : "white",
                  }}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* BUY */}
            <button className="button" onClick={handleBuy}>
              Buy Now
            </button>
          </div>
        </div>

        <button className="navBtn" onClick={next}>▶</button>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>Verified Signed Jerseys • Crypto Payments • Worldwide Delivery</p>

        <div className="socials">
          <a href="https://facebook.com"><FaFacebook /></a>
          <a href="https://instagram.com"><FaInstagram /></a>
          <a href="mailto:your@email.com"><FaEnvelope /></a>
        </div>
      </footer>

    </div>
  );
}
