// src/components/Header.js
import React from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <header className="header">
      {/* ===== Barra superior ===== */}
      <div className="top-bar">
        <div className="logo" onClick={() => navigate("/")}>
          <span className="logo-icon">D</span>
          <span className="logo-text">despegar</span>
        </div>

        <div className="top-options">
          <span className="top-link">Ventas 0 800 7 8484</span>
          <span className="top-link">Publica tu alojamiento</span>
          <span className="top-link">Ayuda</span>
          <span className="top-link">Mis Viajes</span>
          <span className="top-link">Beneficios Pasaporte</span>
          <span
            className="top-link carrito"
            onClick={() => navigate("/carrito")}
          >
            🛒 Carrito
          </span>
        </div>
      </div>

      {/* ===== Menú de categorías ===== */}
      <nav className="categories">
        <div className="cat-item">
          <span>🏨</span>
          <p>Alojamientos</p>
        </div>

        {/* Vuelos: categoría seleccionada / principal */}
        <div
          className="cat-item selected"
          onClick={() => navigate("/")}
        >
          <span>✈️</span>
          <p>Vuelos</p>
        </div>

        <div className="cat-item">
          <span>💼</span>
          <p>Paquetes</p>
        </div>

        <div className="cat-item">
          <span>🔥</span>
          <p>Ofertas</p>
        </div>

        <div className="cat-item">
          <span>🚗</span>
          <p>Autos</p>
        </div>

        <div className="cat-item">
          <span>🏝️</span>
          <p>Rentas</p>
        </div>

        <div className="cat-item">
          <span>🎢</span>
          <p>Disney</p>
        </div>

        <div className="cat-item">
          <span>🌎</span>
          <p>Universal</p>
        </div>
      </nav>
    </header>
  );
}

export default Header;
