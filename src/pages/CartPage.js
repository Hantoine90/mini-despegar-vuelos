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
      // China: 2 letras + 7 dígitos (ej: EA0000001)
      const ok = /^[A-Za-z]{2}\d{7}$/.test(passport);
      return {
        ok,
        message: ok
          ? ""
          : "Para China: 2 letras seguidas de 7 dígitos (ej: EA0000001).",
      };
    }
    case "IT": {
      // Italia: 2 letras o dígitos + 7 dígitos
      const ok = /^[A-Za-z0-9]{2}\d{7}$/.test(passport);
      return {
        ok,
        message: ok
          ? ""
          : "Para Italia: 2 letras o números seguidos de 7 dígitos.",
      };
    }
    case "SE": {
      // Suecia: 8 dígitos
      const ok = /^\d{8}$/.test(passport);
      return {
        ok,
        message: ok ? "" : "Para Suecia: el pasaporte debe tener 8 dígitos.",
      };
    }
    case "RO": {
      // Rumania: 8 o 9 dígitos
      const ok = /^\d{8,9}$/.test(passport);
      return {
        ok,
        message: ok
          ? ""
          : "Para Rumania: el pasaporte debe tener 8 o 9 dígitos.",
      };
    }
    case "US": {
      // Estados Unidos: 9 dígitos o 1 letra + 8 dígitos
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
      // Perú / Guatemala: 9 dígitos
      const ok = /^\d{9}$/.test(passport);
      return {
        ok,
        message: ok
          ? ""
          : "Para este país: el pasaporte debe tener 9 dígitos.",
      };
    }
    case "JP": {
      // Japón: 9 caracteres, normalmente 2 letras + 7 dígitos
      const ok = /^[A-Za-z]{2}\d{7}$/.test(passport);
      return {
        ok,
        message: ok
          ? ""
          : "Para Japón: 2 letras seguidas de 7 dígitos (9 caracteres).",
      };
    }
    case "TH": {
      // Tailandia: 8 o 9 caracteres alfanuméricos
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
      // Genérico: 6–12 caracteres alfanuméricos
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

function CartPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item || null;

  // Cantidad de pasajeros (si no hay item, 1 para evitar errores)
  const numPassengers = item?.searchDetails?.numPassengers || 1;

  // =======================
  // ESTADO: CONTACTO
  // =======================
  const [contact, setContact] = useState({
    fullname: "",
    email: "",
    phone: "",
  });

  const [contactErrors, setContactErrors] = useState({
    fullname: "",
    email: "",
    phone: "",
  });

  // Validaciones de contacto
  const validateFullname = (value) => {
    if (!value.trim()) return "El nombre no puede estar vacío.";
    if (!/^[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ\s]+$/.test(value))
      return "Solo se permiten letras y espacios.";
    return "";
  };

  const validateEmail = (value) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Ingresa un correo electrónico válido.";
    return "";
  };

  const validatePhone = (value) => {
    if (!/^[0-9]+$/.test(value)) return "Solo números permitidos.";
    if (value.length < 6) return "Debe tener mínimo 6 dígitos.";
    if (value.length > 12) return "Máximo 12 dígitos.";
    return "";
  };

  const handleContactChange = (field, value) => {
    // Actualizar valor
    setContact((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Actualizar error
    setContactErrors((prev) => {
      const next = { ...prev };
      if (field === "fullname") next.fullname = validateFullname(value);
      if (field === "email") next.email = validateEmail(value);
      if (field === "phone") next.phone = validatePhone(value);
      return next;
    });
  };

  const validateContact = () => {
    const newErrors = {
      fullname: validateFullname(contact.fullname),
      email: validateEmail(contact.email),
      phone: validatePhone(contact.phone),
    };

    setContactErrors(newErrors);

    return !newErrors.fullname && !newErrors.email && !newErrors.phone;
  };

  const isContactValid =
    contact.fullname &&
    contact.email &&
    contact.phone &&
    !contactErrors.fullname &&
    !contactErrors.email &&
    !contactErrors.phone;

  // =======================
  // ESTADO: PASAJEROS
  // =======================
  const [passengers, setPassengers] = useState(() =>
    Array.from({ length: numPassengers }, (_, i) => ({
      id: i + 1,
      fullName: "",
      docType: "DNI", // DNI | Pasaporte
      passportCountry: "OTHER", // solo aplica si es pasaporte
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

  // === Handlers generales de pasajeros ===
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
      // Solo números, máximo 8
      value = value.replace(/\D/g, "").slice(0, 8);
    } else {
      // Pasaporte: alfanumérico, máximo 12
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

  const handleConfirmPurchase = () => {
    if (!item) return;

    const okContact = validateContact();
    const okPassengers = validatePassengers();

    if (!okContact || !okPassengers) {
      alert("Por favor corrige los datos marcados antes de confirmar.");
      return;
    }

    // Aquí luego puedes enviar a Firebase
    console.log("Compra confirmada:", {
      item,
      contact,
      passengers,
    });

    alert(
      "Compra simulada registrada en consola.\n(A futuro esto se enviaría a Firebase)."
    );
  };

  // Si no hay item en el carrito
  if (!item) {
    return (
      <main className="app-main">
        <h1>Carrito</h1>
        <p>No hay viajes en el carrito.</p>
        <button className="btn-primary" onClick={() => navigate("/")}>
          Ir a buscar vuelos
        </button>
      </main>
    );
  }

  const { searchDetails, outboundFlight, returnFlight, totals } = item;

  return (
    <main className="app-main">
      <header className="app-header">
        <h1>Carrito · Datos de contacto y pasajeros</h1>
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
        {searchDetails.tripType === "roundTrip" && returnFlight && (
          <p>
            <strong>Vuelta:</strong> {returnFlight.origin} →{" "}
            {returnFlight.destination} · Fecha:{" "}
            {searchDetails.returnDate || "-"}
          </p>
        )}

        <p style={{ marginTop: 8 }}>
          <strong>Total a pagar:</strong> S/. {totals.totalPrice}
        </p>
      </div>

      {/* ===== DATOS DE CONTACTO ===== */}
      <div className="purchase-summary" style={{ marginTop: 16 }}>
        <h3>Datos de contacto</h3>

        <label className="contact-label">
          Nombre y apellido:
          <input
            type="text"
            value={contact.fullname}
            onChange={(e) => handleContactChange("fullname", e.target.value)}
          />
          {contactErrors.fullname && (
            <span className="field-error">{contactErrors.fullname}</span>
          )}
        </label>

        <label className="contact-label">
          Correo electrónico:
          <input
            type="email"
            value={contact.email}
            onChange={(e) => handleContactChange("email", e.target.value)}
          />
          {contactErrors.email && (
            <span className="field-error">{contactErrors.email}</span>
          )}
        </label>

        <label className="contact-label">
          Teléfono de contacto:
          <input
            type="text"
            value={contact.phone}
            onChange={(e) => handleContactChange("phone", e.target.value)}
          />
          {contactErrors.phone && (
            <span className="field-error">{contactErrors.phone}</span>
          )}
        </label>
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
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder="Ej: Juan Pérez"
              />
              {errors[index]?.fullName && (
                <span className="field-error">{errors[index].fullName}</span>
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
                  handleDocumentChange(index, e.target.value, p.docType)
                }
                placeholder={
                  p.docType === "DNI"
                    ? "8 dígitos"
                    : "Formato depende del país seleccionado"
                }
              />
              {errors[index]?.document && (
                <span className="field-error">{errors[index].document}</span>
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
                <span className="field-error">{errors[index].seat}</span>
              )}
            </label>
          </div>
        ))}

        <div style={{ marginTop: 12 }}>
          <button
            className="btn-primary"
            onClick={handleConfirmPurchase}
            disabled={!isContactValid}
          >
            Confirmar compra (simulada)
          </button>{" "}
          <button className="btn-secondary" onClick={() => navigate("/resumen")}>
            Volver al resumen
          </button>
        </div>
      </div>
    </main>
  );
}

export default CartPage;
