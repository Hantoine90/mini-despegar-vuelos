// src/pages/CartPage.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";

// Lista base de asientos
const seatOptions = [
  "1A", "1B", "1C", "1D",
  "2A", "2B", "2C", "2D",
  "3A", "3B", "3C", "3D",
];

// Etiquetas para mostrar las opciones de maletas / tarifas
const baggageLabels = {
  ninguna: "Sin equipaje extra",
  mano: "Equipaje de mano (10 kg)",
  bodega: "Equipaje en bodega (23 kg)",
};

const fareLabels = {
  basica: "Tarifa Básica",
  clasica: "Tarifa Clásica",
  vip: "Tarifa Flexible (VIP)",
};

// Países para pasaporte
const passportCountryOptions = [
  { value: "CN", label: "China" },
  { value: "IT", label: "Italia" },
  { value: "SE", label: "Suecia" },
  { value: "RO", label: "Rumania" },
  { value: "US", label: "Estados Unidos" },
  { value: "PE", label: "Perú" },
  { value: "GT", label: "Guatemala" },
  { value: "JP", label: "Japón" },
  { value: "TH", label: "Tailandia" },
  { value: "OTHER", label: "Otro país" },
];

// Validación de pasaporte según país
function validatePassportByCountry(country, passport) {
  switch (country) {
    case "CN": {
      const ok = /^[A-Za-z]{2}\d{7}$/.test(passport);
      return {
        ok,
        message: ok
          ? ""
          : "Para China: 2 letras seguidas de 7 dígitos (ej: EA0000001).",
      };
    }
    case "IT": {
      const ok = /^[A-Za-z0-9]{2}\d{7}$/.test(passport);
      return {
        ok,
        message: ok
          ? ""
          : "Para Italia: 2 letras o números seguidos de 7 dígitos.",
      };
    }
    case "SE": {
      const ok = /^\d{8}$/.test(passport);
      return {
        ok,
        message: ok ? "" : "Para Suecia: el pasaporte debe tener 8 dígitos.",
      };
    }
    case "RO": {
      const ok = /^\d{8,9}$/.test(passport);
      return {
        ok,
        message: ok
          ? ""
          : "Para Rumania: el pasaporte debe tener 8 o 9 dígitos.",
      };
    }
    case "US": {
      const ok = /^(\d{9}|[A-Za-z]\d{8})$/.test(passport);
      return {
        ok,
        message: ok
          ? ""
          : "Para Estados Unidos: 9 dígitos o 1 letra seguida de 8 dígitos.",
      };
    }
    case "PE":
    case "GT": {
      const ok = /^\d{9}$/.test(passport);
      return {
        ok,
        message: ok
          ? ""
          : "Para este país: el pasaporte debe tener 9 dígitos.",
      };
    }
    case "JP": {
      const ok = /^[A-Za-z]{2}\d{7}$/.test(passport);
      return {
        ok,
        message: ok
          ? ""
          : "Para Japón: 2 letras seguidas de 7 dígitos (9 caracteres).",
      };
    }
    case "TH": {
      const ok = /^[A-Za-z0-9]{8,9}$/.test(passport);
      return {
        ok,
        message: ok
          ? ""
          : "Para Tailandia: 8 o 9 caracteres alfanuméricos.",
      };
    }
    case "OTHER":
    default: {
      const ok = /^[A-Za-z0-9]{6,12}$/.test(passport);
      return {
        ok,
        message: ok
          ? ""
          : "Para otros países: 6 a 12 caracteres alfanuméricos.",
      };
    }
  }
}

// 🔹 Generador de código de reserva
const generateBookingCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

function CartPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Siempre llamamos a este useState, sin returns antes
  const [item] = useState(() => {
    const fromState = location.state?.item;
    if (fromState) return fromState;

    try {
      const stored = localStorage.getItem("currentCartItem");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Error leyendo currentCartItem de localStorage:", e);
    }

    return null;
  });

  // Derivados seguros aun si item es null
  const searchDetails = item?.searchDetails || null;
  const outboundFlight = item?.outboundFlight || null;
  const returnFlight = item?.returnFlight || null;
  const totals = item?.totals || { totalPrice: 0 };
  const extras = item?.extras || null;
  const contact = item?.contact || null;

  const numPassengers = searchDetails?.numPassengers || 1;
  const isRoundTrip = searchDetails?.tripType === "roundTrip";

  // Datos de pasajeros
  const [passengers, setPassengers] = useState(() =>
    Array.from({ length: numPassengers }, (_, i) => ({
      id: i + 1,
      fullName: "",
      docType: "DNI", // DNI | Pasaporte
      passportCountry: "OTHER",
      document: "",
      seat: "",
    }))
  );

  // Errores por pasajero
  const [errors, setErrors] = useState(() =>
    Array.from({ length: numPassengers }, () => ({
      fullName: "",
      document: "",
      seat: "",
    }))
  );

  // === Handlers generales ===
  const handlePassengerChange = (index, field, value) => {
    setPassengers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });

    // Limpia error del campo editado
    setErrors((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: "" };
      return next;
    });
  };

  // Nombre: solo letras y espacios
  const handleNameChange = (index, rawValue) => {
    const value = rawValue
      .replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]/g, "")
      .slice(0, 50);
    handlePassengerChange(index, "fullName", value);
  };

  // Documento según tipo
  const handleDocumentChange = (index, rawValue, docType) => {
    let value = rawValue;

    if (docType === "DNI") {
      value = value.replace(/\D/g, "").slice(0, 8);
    } else {
      value = value.replace(/[^A-Za-z0-9]/g, "").slice(0, 12);
    }

    handlePassengerChange(index, "document", value);
  };

  // Asientos disponibles para un pasajero X
  const getAvailableSeats = (currentIndex) => {
    const takenSeats = passengers
      .map((p, idx) => (idx === currentIndex ? null : p.seat))
      .filter((s) => s);
    return seatOptions.filter((s) => !takenSeats.includes(s));
  };

  // 🔍 Validación de todos los pasajeros
  const validatePassengers = () => {
    let isValid = true;
    const newErrors = passengers.map(() => ({
      fullName: "",
      document: "",
      seat: "",
    }));

    passengers.forEach((p, index) => {
      const name = p.fullName.trim();
      const doc = p.document.trim();

      // Nombre
      if (!name) {
        newErrors[index].fullName = "El nombre es obligatorio.";
        isValid = false;
      } else if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/.test(name)) {
        newErrors[index].fullName = "Solo se permiten letras y espacios.";
        isValid = false;
      }

      // Documento
      if (!doc) {
        newErrors[index].document = "El documento es obligatorio.";
        isValid = false;
      } else if (p.docType === "DNI") {
        if (!/^\d{8}$/.test(doc)) {
          newErrors[index].document =
            "El DNI debe tener exactamente 8 dígitos numéricos.";
          isValid = false;
        }
      } else if (p.docType === "Pasaporte") {
        const { ok, message } = validatePassportByCountry(
          p.passportCountry,
          doc
        );
        if (!ok) {
          newErrors[index].document = message;
          isValid = false;
        }
      }

      // Asiento
      if (!p.seat) {
        newErrors[index].seat = "Selecciona un asiento.";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // 🔹 AHORA CONFIRMA Y VA A /confirmacion CON CÓDIGO Y FECHA
  const handleConfirmPurchase = () => {
    if (!item) {
      alert("No hay viaje en el carrito.");
      return;
    }

    if (!validatePassengers()) {
      alert("Por favor corrige los datos marcados antes de confirmar.");
      return;
    }

    const bookingCode = generateBookingCode();
    const purchaseDate = new Date().toISOString();

    console.log("Compra confirmada:", {
      item,
      passengers,
      bookingCode,
      purchaseDate,
    });

    // Limpiamos el carrito almacenado
    try {
      localStorage.removeItem("currentCartItem");
    } catch (e) {
      console.warn("No se pudo borrar currentCartItem de localStorage:", e);
    }

    // Navegamos a la página de confirmación / ticket
    navigate("/confirmacion", {
      state: {
        item,
        passengers,
        bookingCode,
        purchaseDate,
      },
    });
  };

  return (
    <main className="app-main">
      {/* Si NO hay item, mostramos solo esto */}
      {!item ? (
        <>
          <h1>Carrito</h1>
          <p>No hay viajes en el carrito.</p>
          <button className="btn-primary" onClick={() => navigate("/")}>
            Ir a buscar vuelos
          </button>
        </>
      ) : (
        <>
          <header className="app-header">
            <h1>Carrito · Datos de pasajeros</h1>
            <p>Completa los datos para finalizar la simulación de compra.</p>
          </header>

          {/* Resumen del viaje */}
          <div className="purchase-summary">
            <h3>Resumen del viaje seleccionado</h3>
            <p>
              <strong>Tipo de viaje:</strong> {searchDetails.tripType}
            </p>
            <p>
              <strong>Pasajeros:</strong> {numPassengers}
            </p>

            <p>
              <strong>Ida:</strong> {outboundFlight.origin} →{" "}
              {outboundFlight.destination} · Fecha:{" "}
              {searchDetails.departDate || "-"}
            </p>
            {isRoundTrip && returnFlight && (
              <p>
                <strong>Vuelta:</strong> {returnFlight.origin} →{" "}
                {returnFlight.destination} · Fecha:{" "}
                {searchDetails.returnDate || "-"}
              </p>
            )}

            {/* Resumen de extras */}
            {extras && (
              <>
                <hr />
                <h4>Extras seleccionados</h4>
                {extras.outbound && (
                  <p>
                    <strong>Ida:</strong>{" "}
                    {baggageLabels[extras.outbound.baggage] ||
                      extras.outbound.baggage}{" "}
                    ·{" "}
                    {fareLabels[extras.outbound.fare] ||
                      extras.outbound.fare}
                  </p>
                )}
                {isRoundTrip && extras.return && (
                  <p>
                    <strong>Vuelta:</strong>{" "}
                    {baggageLabels[extras.return.baggage] ||
                      extras.return.baggage}{" "}
                    ·{" "}
                    {fareLabels[extras.return.fare] ||
                      extras.return.fare}
                  </p>
                )}
              </>
            )}

            {/* Datos de contacto / pago */}
            {contact && (
              <>
                <hr />
                <h4>Datos de contacto</h4>
                <p>
                  <strong>Titular:</strong> {contact.name}
                </p>
                <p>
                  <strong>Correo:</strong> {contact.email}
                </p>
                <p>
                  <strong>Teléfono:</strong> {contact.phone}
                </p>
                <p>
                  <strong>Método de pago:</strong>{" "}
                  {contact.paymentMethod === "tarjeta"
                    ? "Tarjeta"
                    : contact.paymentMethod === "yape"
                    ? "Yape / Plin"
                    : "Transferencia bancaria"}
                </p>
              </>
            )}

            <p style={{ marginTop: 8 }}>
              <strong>Total a pagar:</strong> S/. {totals.totalPrice}
            </p>
          </div>

          {/* Formulario de pasajeros */}
          <div className="purchase-summary" style={{ marginTop: 16 }}>
            <h3>Datos de los pasajeros</h3>

            {passengers.map((p, index) => (
              <div key={p.id} className="passenger-card">
                <h4>Pasajero {index + 1}</h4>

                {/* Tipo de documento */}
                <label className="passenger-field">
                  Tipo de documento:
                  <select
                    value={p.docType}
                    onChange={(e) =>
                      handlePassengerChange(index, "docType", e.target.value)
                    }
                  >
                    <option value="DNI">DNI</option>
                    <option value="Pasaporte">Pasaporte</option>
                  </select>
                </label>

                {/* País del pasaporte (solo si es pasaporte) */}
                {p.docType === "Pasaporte" && (
                  <label className="passenger-field">
                    País del pasaporte:
                    <select
                      value={p.passportCountry}
                      onChange={(e) =>
                        handlePassengerChange(
                          index,
                          "passportCountry",
                          e.target.value
                        )
                      }
                    >
                      {passportCountryOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </label>
                )}

                {/* Nombre completo */}
                <label className="passenger-field">
                  Nombre completo:
                  <input
                    type="text"
                    maxLength={50}
                    value={p.fullName}
                    onChange={(e) =>
                      handleNameChange(index, e.target.value)
                    }
                    placeholder="Ej: Juan Pérez"
                  />
                  {errors[index]?.fullName && (
                    <span className="field-error">
                      {errors[index].fullName}
                    </span>
                  )}
                </label>

                {/* Documento */}
                <label className="passenger-field">
                  Documento ({p.docType}):
                  <input
                    type="text"
                    value={p.document}
                    maxLength={p.docType === "DNI" ? 8 : 12}
                    inputMode={p.docType === "DNI" ? "numeric" : "text"}
                    onChange={(e) =>
                      handleDocumentChange(
                        index,
                        e.target.value,
                        p.docType
                      )
                    }
                    placeholder={
                      p.docType === "DNI"
                        ? "8 dígitos"
                        : "Formato depende del país seleccionado"
                    }
                  />
                  {errors[index]?.document && (
                    <span className="field-error">
                      {errors[index].document}
                    </span>
                  )}
                </label>

                {/* Asiento */}
                <label className="passenger-field">
                  Asiento:
                  <select
                    value={p.seat}
                    onChange={(e) =>
                      handlePassengerChange(index, "seat", e.target.value)
                    }
                  >
                    <option value="">Selecciona asiento</option>
                    {getAvailableSeats(index).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {errors[index]?.seat && (
                    <span className="field-error">
                      {errors[index].seat}
                    </span>
                  )}
                </label>
              </div>
            ))}

            <div style={{ marginTop: 12 }}>
              <button className="btn-primary" onClick={handleConfirmPurchase}>
                Confirmar compra (simulada)
              </button>{" "}
              <button
                className="btn-secondary"
                onClick={() =>
                  navigate("/resumen", {
                    state: {
                      searchDetails,
                      outboundFlight,
                      returnFlight,
                    },
                  })
                }
              >
                Volver al resumen
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

export default CartPage;
