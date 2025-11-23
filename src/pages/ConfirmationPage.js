// src/pages/ConfirmationPage.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";

function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  if (!state) {
    return (
      <main className="app-main">
        <h1>Confirmación de compra</h1>
        <p>No se encontró información de la reserva.</p>
        <button className="btn-primary" onClick={() => navigate("/")}>
          Volver a buscar vuelos
        </button>
      </main>
    );
  }

  const { item, passengers, bookingCode, purchaseDate } = state;
  const { searchDetails, outboundFlight, returnFlight, totals, extras, contact } =
    item;

  const isRoundTrip = searchDetails?.tripType === "roundTrip";

  const formattedPurchaseDate = new Date(purchaseDate).toLocaleString(
    "es-PE",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

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

  const handlePrint = () => {
    window.print(); // El usuario puede elegir "Guardar como PDF"
  };

  return (
    <main className="app-main">
      <header className="app-header no-print">
        <h1>Confirmación de compra</h1>
        <p>
          Este es el comprobante de tu reserva. Puedes imprimirlo o guardarlo
          como PDF.
        </p>
      </header>

      <div className="checkout-layout">
        {/* COLUMNA PRINCIPAL: E-TICKET */}
        <div className="checkout-main">
          <section className="ticket-card">
            {/* Header del ticket */}
            <div className="ticket-header">
              <div>
                <h2 className="ticket-title">E-ticket de vuelo</h2>
                <p className="ticket-subtitle">
                  Reserva confirmada · {formattedPurchaseDate}
                </p>
              </div>
              <div className="ticket-code-block">
                <span className="ticket-code-label">Código de reserva</span>
                <span className="ticket-code">{bookingCode}</span>
              </div>
            </div>

            {/* Datos principales de ruta */}
            <div className="ticket-route">
              <div className="ticket-route-main">
                <div className="ticket-route-city">
                  <span className="ticket-route-label">Origen</span>
                  <span className="ticket-route-value">
                    {outboundFlight.origin}
                  </span>
                </div>
                <div className="ticket-route-arrow">⇄</div>
                <div className="ticket-route-city">
                  <span className="ticket-route-label">Destino</span>
                  <span className="ticket-route-value">
                    {isRoundTrip ? returnFlight.destination : outboundFlight.destination}
                  </span>
                </div>
              </div>
              <div className="ticket-route-info">
                <span>
                  {isRoundTrip ? "Ida y vuelta" : "Solo ida"} ·{" "}
                  {searchDetails.travelClass}
                </span>
                <span>
                  Pasajeros: {searchDetails.numPassengers}
                </span>
              </div>
            </div>

            <div className="ticket-perforation" />

            {/* Tramos */}
            <div className="ticket-legs">
              {/* IDA */}
              <div className="ticket-leg">
                <h3>Tramo 1 · Vuelo de ida</h3>
                <div className="ticket-leg-grid">
                  <div>
                    <span className="ticket-leg-label">Ruta</span>
                    <p className="ticket-leg-value">
                      {outboundFlight.origin} → {outboundFlight.destination}
                    </p>
                  </div>
                  <div>
                    <span className="ticket-leg-label">Fecha salida</span>
                    <p className="ticket-leg-value">
                      {searchDetails.departDate || "-"}
                    </p>
                  </div>
                  <div>
                    <span className="ticket-leg-label">Aerolínea</span>
                    <p className="ticket-leg-value">
                      {outboundFlight.airline}
                    </p>
                  </div>
                  <div>
                    <span className="ticket-leg-label">Precio base</span>
                    <p className="ticket-leg-value">
                      S/. {outboundFlight.price}
                    </p>
                  </div>
                </div>
                {extras?.outbound && (
                  <p className="ticket-leg-extras">
                    <strong>Extras:</strong>{" "}
                    {baggageLabels[extras.outbound.baggage] ||
                      extras.outbound.baggage}
                    {" · "}
                    {fareLabels[extras.outbound.fare] || extras.outbound.fare}
                  </p>
                )}
              </div>

              {/* VUELTA */}
              {isRoundTrip && returnFlight && (
                <div className="ticket-leg">
                  <h3>Tramo 2 · Vuelo de vuelta</h3>
                  <div className="ticket-leg-grid">
                    <div>
                      <span className="ticket-leg-label">Ruta</span>
                      <p className="ticket-leg-value">
                        {returnFlight.origin} → {returnFlight.destination}
                      </p>
                    </div>
                    <div>
                      <span className="ticket-leg-label">Fecha regreso</span>
                      <p className="ticket-leg-value">
                        {searchDetails.returnDate || "-"}
                      </p>
                    </div>
                    <div>
                      <span className="ticket-leg-label">Aerolínea</span>
                      <p className="ticket-leg-value">
                        {returnFlight.airline}
                      </p>
                    </div>
                    <div>
                      <span className="ticket-leg-label">Precio base</span>
                      <p className="ticket-leg-value">
                        S/. {returnFlight.price}
                      </p>
                    </div>
                  </div>
                  {extras?.return && (
                    <p className="ticket-leg-extras">
                      <strong>Extras:</strong>{" "}
                      {baggageLabels[extras.return.baggage] ||
                        extras.return.baggage}
                      {" · "}
                      {fareLabels[extras.return.fare] || extras.return.fare}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="ticket-perforation" />

            {/* Pasajeros */}
            <section className="ticket-passengers">
              <h3>Pasajeros</h3>
              {passengers.map((p, idx) => (
                <div key={p.id} className="ticket-passenger-row">
                  <div>
                    <span className="ticket-passenger-label">
                      Pasajero {idx + 1}
                    </span>
                    <p className="ticket-passenger-name">
                      {p.fullName || "(sin nombre)"}
                    </p>
                  </div>
                  <div>
                    <span className="ticket-passenger-label">Documento</span>
                    <p className="ticket-passenger-detail">
                      {p.docType} · {p.document || "-"}
                    </p>
                  </div>
                  <div>
                    <span className="ticket-passenger-label">Asiento</span>
                    <p className="ticket-passenger-detail">
                      {p.seat || "-"}
                    </p>
                  </div>
                </div>
              ))}
            </section>

            <div className="ticket-perforation" />

            {/* Datos titular + pago */}
            <section className="ticket-footer-info">
              {contact && (
                <div className="ticket-footer-block">
                  <h3>Titular de la reserva</h3>
                  <p>
                    <strong>Nombre:</strong> {contact.name}
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
                      ? "Tarjeta de crédito / débito"
                      : contact.paymentMethod === "yape"
                      ? "Yape / Plin"
                      : "Transferencia bancaria"}
                  </p>
                </div>
              )}

              <div className="ticket-footer-block">
                <h3>Resumen de pago</h3>
                <p>
                  Subtotal vuelos: <strong>S/. {totals.baseTotal}</strong>
                </p>
                <p>
                  Extras (maletas y tarifa):{" "}
                  <strong>S/. {totals.extrasTotal}</strong>
                </p>
                <p className="ticket-total">
                  Total pagado:{" "}
                  <strong>S/. {totals.totalPrice}</strong>
                </p>
              </div>
            </section>

            {/* "Código de barras" decorativo */}
            <div className="ticket-barcode-wrapper">
              <div className="ticket-barcode" />
              <p className="ticket-barcode-text">
                Este documento es una simulación con fines académicos y no
                constituye un billete de avión válido.
              </p>
            </div>
          </section>
        </div>

        {/* COLUMNA DERECHA: RESUMEN RÁPIDO + BOTONES (no se imprime) */}
        <aside className="checkout-sidebar no-print">
          <h3>Resumen rápido</h3>
          <p>
            <strong>Código de reserva:</strong> {bookingCode}
          </p>
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
            <strong>Fechas:</strong>{" "}
            {searchDetails.departDate || "-"}
            {isRoundTrip && ` / ${searchDetails.returnDate || "-"}`}
          </p>
          <p>
            <strong>Pasajeros:</strong> {searchDetails.numPassengers}
          </p>
          <hr />
          <p>
            Total pagado: <strong>S/. {totals.totalPrice}</strong>
          </p>

          <button
            className="btn-primary"
            style={{ marginTop: 12, width: "100%" }}
            onClick={handlePrint}
          >
            Imprimir / Guardar como PDF
          </button>
          <button
            className="btn-secondary"
            style={{ marginTop: 8, width: "100%" }}
            onClick={() => navigate("/")}
          >
            Volver al inicio
          </button>
        </aside>
      </div>
    </main>
  );
}

export default ConfirmationPage;
