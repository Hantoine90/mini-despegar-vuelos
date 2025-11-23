// src/pages/SummaryPage.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import "../components/FlightCard.css";

function SummaryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  // ---------------- CONFIGURACIÓN DE EXTRAS ----------------
  const baggageOptions = [
    { value: "ninguna", label: "Sin equipaje extra", cost: 0 },
    { value: "mano", label: "Equipaje de mano (10 kg)", cost: 50 },
    { value: "bodega", label: "Equipaje en bodega (23 kg)", cost: 100 },
  ];

  const fareOptions = [
    { value: "basica", label: "Tarifa Básica", cost: 0 },
    { value: "clasica", label: "Tarifa Clásica", cost: 80 },
    { value: "vip", label: "Tarifa Flexible (VIP)", cost: 150 },
  ];

  // ---------------- HOOKS DE ESTADO ----------------
  // Ida
  const [outboundBaggage, setOutboundBaggage] = useState("ninguna");
  const [outboundFare, setOutboundFare] = useState("basica");

  // Vuelta
  const [returnBaggage, setReturnBaggage] = useState("ninguna");
  const [returnFare, setReturnFare] = useState("basica");

  // Contacto / pago
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("tarjeta");
  const [acceptTerms, setAcceptTerms] = useState(false);

  // ---------------- DATOS DESDE location.state ----------------
  const hasState = !!state;
  const searchDetails = hasState ? state.searchDetails : null;
  const outboundFlight = hasState ? state.outboundFlight : null;
  const returnFlight = hasState ? state.returnFlight : null;

  const isRoundTrip =
    searchDetails && searchDetails.tripType === "roundTrip";

  const findOptionCost = (list, value) => {
    const opt = list.find((o) => o.value === value);
    return opt ? opt.cost : 0;
  };

  const baseTotal =
    (outboundFlight ? outboundFlight.price : 0) +
    (returnFlight ? returnFlight.price : 0);

  let extrasTotal = 0;
  if (outboundFlight) {
    extrasTotal += findOptionCost(baggageOptions, outboundBaggage);
    extrasTotal += findOptionCost(fareOptions, outboundFare);
  }
  if (returnFlight && isRoundTrip) {
    extrasTotal += findOptionCost(baggageOptions, returnBaggage);
    extrasTotal += findOptionCost(fareOptions, returnFare);
  }

  const totalPrice = baseTotal + extrasTotal;

  // ---------------- MANEJADORES ----------------
  const handleGoBackToFlights = () => {
    navigate("/");
  };

  const validateContact = () => {
    const name = contactName.trim();
    const email = contactEmail.trim();
    const phoneDigits = contactPhone.replace(/\D/g, "");

    if (!name) {
      alert("Ingresa el nombre y apellido del contacto.");
      return false;
    }
    if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/.test(name)) {
      alert("El nombre de contacto solo debe contener letras y espacios.");
      return false;
    }

    if (!email) {
      alert("Ingresa un correo electrónico de contacto.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Ingresa un correo electrónico válido.");
      return false;
    }

    if (!phoneDigits) {
      alert("Ingresa un teléfono de contacto.");
      return false;
    }
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      alert("El teléfono de contacto debe tener entre 7 y 15 dígitos.");
      return false;
    }

    return true;
  };

  const handleGoToCart = () => {
    if (!hasState || !outboundFlight) {
      alert("No hay información suficiente para continuar con la compra.");
      return;
    }

    if (!validateContact()) return;

    if (!acceptTerms) {
      alert("Debes aceptar los términos y condiciones para continuar.");
      return;
    }

    // Definimos extras de vuelta solo si es viaje redondo
    const returnExtras = isRoundTrip && returnFlight
      ? {
          baggage: returnBaggage,
          fare: returnFare,
        }
      : null;

    const item = {
      searchDetails,
      outboundFlight,
      returnFlight: isRoundTrip ? returnFlight : null,
      extras: {
        outbound: {
          baggage: outboundBaggage,
          fare: outboundFare,
        },
        return: returnExtras,
      },
      totals: {
        baseTotal,
        extrasTotal,
        totalPrice,
      },
      contact: {
        name: contactName.trim(),
        email: contactEmail.trim(),
        phone: contactPhone.trim(),
        paymentMethod,
      },
    };

    try {
      localStorage.setItem("currentCartItem", JSON.stringify(item));
    } catch (e) {
      console.warn("No se pudo guardar el carrito en localStorage:", e);
    }

    navigate("/carrito", { state: { item } });
  };

  // ---------------- PANTALLA SIN STATE ----------------
  if (!hasState) {
    return (
      <main className="app-main">
        <header className="app-header">
          <h1>Resumen de compra</h1>
          <p>No hay datos de viaje. Vuelve a la página de vuelos.</p>
        </header>
        <button className="btn-primary" onClick={handleGoBackToFlights}>
          Volver a Vuelos
        </button>
      </main>
    );
  }

  // ---------------- PANTALLA NORMAL ----------------
  return (
    <main className="app-main">
      <header className="app-header">
        <h1>Resumen de compra</h1>
        <p>
          Revisa los detalles de tu viaje y completa los datos para finalizar la
          simulación.
        </p>
      </header>

      <div className="checkout-layout">
        {/* COLUMNA IZQUIERDA */}
        <div className="checkout-main">
          {/* ===== RESUMEN DE VUELOS Y EXTRAS ===== */}
          <div className="purchase-summary">
            <h3>Resumen del viaje</h3>

            <p>
              <strong>Tipo de viaje:</strong> {searchDetails.tripType}
            </p>
            <p>
              <strong>Pasajeros:</strong> {searchDetails.numPassengers}
            </p>
            <p>
              <strong>Clase base:</strong> {searchDetails.travelClass}
            </p>

            <hr />

            {/* VUELO DE IDA */}
            <h3>Vuelo de ida</h3>
            {outboundFlight ? (
              <div className="summary-flight">
                <p>
                  <strong>Ruta:</strong> {outboundFlight.origin} →{" "}
                  {outboundFlight.destination}
                </p>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {searchDetails.departDate || "(sin fecha seleccionada)"}
                </p>
                <p>
                  <strong>Aerolínea:</strong> {outboundFlight.airline}
                </p>
                <p>
                  <strong>Precio base:</strong> S/. {outboundFlight.price}
                </p>

                <div className="extras-section">
                  <div>
                    <label>
                      Maletas (ida):{" "}
                      <select
                        value={outboundBaggage}
                        onChange={(e) => setOutboundBaggage(e.target.value)}
                      >
                        {baggageOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}{" "}
                            {opt.cost > 0 ? `(+S/. ${opt.cost})` : ""}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div>
                    <label>
                      Tipo de tarifa (ida):{" "}
                      <select
                        value={outboundFare}
                        onChange={(e) => setOutboundFare(e.target.value)}
                      >
                        {fareOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}{" "}
                            {opt.cost > 0 ? `(+S/. ${opt.cost})` : ""}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <p>No se seleccionó vuelo de ida.</p>
            )}

            {/* VUELO DE VUELTA */}
            {isRoundTrip && (
              <>
                <hr />
                <h3>Vuelo de vuelta</h3>
                {returnFlight ? (
                  <div className="summary-flight">
                    <p>
                      <strong>Ruta:</strong> {returnFlight.origin} →{" "}
                      {returnFlight.destination}
                    </p>
                    <p>
                      <strong>Fecha:</strong>{" "}
                      {searchDetails.returnDate || "(sin fecha seleccionada)"}
                    </p>
                    <p>
                      <strong>Aerolínea:</strong> {returnFlight.airline}
                    </p>
                    <p>
                      <strong>Precio base:</strong> S/. {returnFlight.price}
                    </p>

                    <div className="extras-section">
                      <div>
                        <label>
                          Maletas (vuelta):{" "}
                          <select
                            value={returnBaggage}
                            onChange={(e) =>
                              setReturnBaggage(e.target.value)
                            }
                          >
                            {baggageOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}{" "}
                                {opt.cost > 0 ? `(+S/. ${opt.cost})` : ""}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>

                      <div>
                        <label>
                          Tipo de tarifa (vuelta):{" "}
                          <select
                            value={returnFare}
                            onChange={(e) => setReturnFare(e.target.value)}
                          >
                            {fareOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}{" "}
                                {opt.cost > 0 ? `(+S/. ${opt.cost})` : ""}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>No se seleccionó vuelo de vuelta.</p>
                )}
              </>
            )}

            <hr />
            <h3>
              Total base vuelos: <strong>S/. {baseTotal}</strong>
            </h3>
            <h3>
              Extras (maletas + tipo tarifa):{" "}
              <strong>S/. {extrasTotal}</strong>
            </h3>
            <h2 style={{ marginTop: 4 }}>
              Total a pagar: <strong>S/. {totalPrice}</strong>
            </h2>
          </div>

          {/* ===== FORMULARIO CONTACTO / PAGO ===== */}
          <div className="checkout-form">
            <h3>Datos de contacto</h3>
            <div className="form-row">
              <div className="form-field">
                <label>Nombre y apellido</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Nombre completo del titular"
                />
              </div>
              <div className="form-field">
                <label>Correo electrónico</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                />
              </div>
              <div className="form-field">
                <label>Teléfono de contacto</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+51 999 999 999"
                />
              </div>
            </div>

            <h3>Método de pago (simulado)</h3>
            <div className="payment-methods">
              <label>
                <input
                  type="radio"
                  value="tarjeta"
                  checked={paymentMethod === "tarjeta"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Tarjeta de crédito / débito
              </label>
              <label>
                <input
                  type="radio"
                  value="yape"
                  checked={paymentMethod === "yape"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Yape / Plin (simulado)
              </label>
              <label>
                <input
                  type="radio"
                  value="transferencia"
                  checked={paymentMethod === "transferencia"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Transferencia bancaria
              </label>
            </div>

            <div style={{ marginTop: 8 }}>
              <label className="checkbox-inline">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
                <span>
                  Acepto los términos y condiciones y autorizo el tratamiento
                  de mis datos para la simulación de compra.
                </span>
              </label>
            </div>

            <div style={{ marginTop: 12 }}>
              <button className="btn-primary" onClick={handleGoToCart}>
                Continuar al carrito / pasajeros
              </button>{" "}
              <button className="btn-secondary" onClick={handleGoBackToFlights}>
                Volver a buscar vuelos
              </button>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: RESUMEN RÁPIDO */}
        <aside className="checkout-sidebar">
          <h3>Resumen rápido</h3>
          <p>
            <strong>Ruta ida:</strong> {outboundFlight.origin} →{" "}
            {outboundFlight.destination}
          </p>
          {isRoundTrip && returnFlight && (
            <p>
              <strong>Ruta vuelta:</strong> {returnFlight.origin} →{" "}
              {returnFlight.destination}
            </p>
          )}
          <p>
            <strong>Pasajeros:</strong> {searchDetails.numPassengers}
          </p>
          <p>
            <strong>Fechas:</strong>{" "}
            {searchDetails.departDate || "-"}{" "}
            {isRoundTrip ? ` / ${searchDetails.returnDate || "-"}` : ""}
          </p>
          <hr />
          <p>
            Subtotal vuelos: <strong>S/. {baseTotal}</strong>
          </p>
          <p>
            Extras: <strong>S/. {extrasTotal}</strong>
          </p>
          <p>
            Total: <strong>S/. {totalPrice}</strong>
          </p>
        </aside>
      </div>
    </main>
  );
}

export default SummaryPage;
