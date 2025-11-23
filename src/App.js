// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import FlightsPage from "./pages/FlightsPage";
import SummaryPage from "./pages/SummaryPage";
import CartPage from "./pages/CartPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import "./App.css";

function App() {
  return (
    <div className="app">
      {/* Cabecera fija en todas las páginas */}
      <Header />

      {/* Contenido según la ruta */}
      <Routes>
        <Route path="/" element={<FlightsPage />} />
        <Route path="/resumen" element={<SummaryPage />} />
        <Route path="/carrito" element={<CartPage />}/>
        <Route path="/confirmacion" element={<ConfirmationPage />} />
      </Routes>
    </div>
  );
}

export default App;
