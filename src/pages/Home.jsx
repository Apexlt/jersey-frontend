import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

import { FaFacebook, FaInstagram, FaEnvelope } from "react-icons/fa";

import logo from "../assets/logo.webp";
import jersey1 from "../assets/ronaldo1.png";
import jersey2 from "../assets/ronaldo2.jpg";
import jersey3 from "../assets/ronaldo3.png";
import jersey4 from "../assets/ronaldo4.png";

export default function Home() {
  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSizes, setSelectedSizes] = useState({});

  const jerseys = [
    { id: 1, price: 149.99, image: jersey1 },
    { id: 4, price: 149.99, image: jersey4 },
    { id: 3, price: 149.99, image: jersey3 },
    { id: 2, price: 149.99, image: jersey2 },
  ];

  const sizes = ["S", "M", "L", "XL"];
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

  return (
    <div className="page">

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

            <button
              className="button"
              disabled={!selectedSizes[current.id]}
              onClick={() =>
                navigate("/checkout", {
                  state: {
                    product: current,
                    size: selectedSizes[current.id],
                  },
                })
              }
            >
              Buy Now
            </button>
          </div>
        </div>

        <button className="navBtn" onClick={next}>▶</button>
      </section>

      {/* 🔥 NEW FOOTER WITH ICONS */}
      <footer className="footer">

        <p>Verified Signed Jerseys • Crypto Payments • Worldwide Delivery</p>

        <div className="socials">
          <a href="https://facebook.com" target="_blank">
            <FaFacebook />
          </a>

          <a href="https://instagram.com" target="_blank">
            <FaInstagram />
          </a>

          <a href="mailto:your@email.com">
            <FaEnvelope />
          </a>
        </div>

      </footer>

    </div>
  );
}