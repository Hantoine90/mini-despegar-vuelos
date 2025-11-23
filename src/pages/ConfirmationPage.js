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
    window.print(); // el usuario podrá “Guardar como PDF”
  };

  return (
    <main className="app-main">
      <header className="app-header">
        <h1>Confirmación de compra</h1>
        <p>
          Este es el comprobante de tu reserva. Puedes imprimirlo o guardarlo
          como PDF.
        </p>
      </header>

      <div className="checkout-layout">
        {/* COLUMNA PRINCIPAL: DETALLE DE LA RESERVA */}
        <div className="checkout-main">
          {/* Bloque tipo e-ticket */}
          <section className="purchase-summary">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ marginBottom: 4 }}>Reserva confirmada</h2>
                <p style={{ margin: 0 }}>
                  Fecha de compra: <strong>{formattedPurchaseDate}</strong>
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>
                  Código de reserva
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 24,
                    letterSpacing: 2,
                    fontWeight: "bold",
                  }}
                >
                  {bookingCode}
                </p>
              </div>
            </div>

            <hr />

            {/* Datos del titular */}
            {contact && (
              <>
                <h3>Datos del titular de la reserva</h3>
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
              </>
            )}

            <hr />

            {/* Resumen del viaje */}
            <h3>Detalle del viaje</h3>
            <p>
              <strong>Origen / destino:</strong> {outboundFlight.origin} →{" "}
              {isRoundTrip ? returnFlight.destination : outboundFlight.destination}
            </p>
            <p>
              <strong>Tipo de viaje:</strong>{" "}
              {isRoundTrip ? "Ida y vuelta" : "Solo ida"}
            </p>
            <p>
              <strong>Pasajeros:</strong> {searchDetails.numPassengers} ·{" "}
              <strong>Clase:</strong> {searchDetails.travelClass}
            </p>

            <div
              style={{
                border: "1px dashed #ccc",
                borderRadius: 8,
                padding: 12,
                marginTop: 12,
              }}
            >
              {/* Vuelo de ida */}
              <h4 style={{ marginTop: 0 }}>Tramo 1 · Vuelo de ida</h4>
              <p style={{ marginBottom: 4 }}>
                <strong>Ruta:</strong> {outboundFlight.origin} →{" "}
                {outboundFlight.destination}
              </p>
              <p style={{ marginBottom: 4 }}>
                <strong>Fecha de salida:</strong>{" "}
                {searchDetails.departDate || "-"}
              </p>
              <p style={{ marginBottom: 4 }}>
                <strong>Aerolínea:</strong> {outboundFlight.airline}
              </p>
              <p style={{ marginBottom: 4 }}>
                <strong>Precio base:</strong> S/. {outboundFlight.price}
              </p>
              {extras?.outbound && (
                <p style={{ marginBottom: 0 }}>
                  <strong>Extras:</strong>{" "}
                  {baggageLabels[extras.outbound.baggage] ||
                    extras.outbound.baggage}
                  {", "}
                  {fareLabels[extras.outbound.fare] || extras.outbound.fare}
                </p>
              )}
            </div>

            {/* Vuelo de vuelta */}
            {isRoundTrip && returnFlight && (
              <div
                style={{
                  border: "1px dashed #ccc",
                  borderRadius: 8,
                  padding: 12,
                  marginTop: 12,
                }}
              >
                <h4 style={{ marginTop: 0 }}>Tramo 2 · Vuelo de vuelta</h4>
                <p style={{ marginBottom: 4 }}>
                  <strong>Ruta:</strong> {returnFlight.origin} →{" "}
                  {returnFlight.destination}
                </p>
                <p style={{ marginBottom: 4 }}>
                  <strong>Fecha de regreso:</strong>{" "}
                  {searchDetails.returnDate || "-"}
                </p>
                <p style={{ marginBottom: 4 }}>
                  <strong>Aerolínea:</strong> {returnFlight.airline}
                </p>
                <p style={{ marginBottom: 4 }}>
                  <strong>Precio base:</strong> S/. {returnFlight.price}
                </p>
                {extras?.return && (
                  <p style={{ marginBottom: 0 }}>
                    <strong>Extras:</strong>{" "}
                    {baggageLabels[extras.return.baggage] ||
                      extras.return.baggage}
                    {", "}
                    {fareLabels[extras.return.fare] ||
                      extras.return.fare}
                  </p>
                )}
              </div>
            )}

            <hr />

            {/* Pasajeros */}
            <h3>Pasajeros</h3>
            {passengers.map((p, idx) => (
              <div
                key={p.id}
                style={{
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #eee",
                  marginBottom: 6,
                }}
              >
                <p style={{ marginBottom: 2 }}>
                  <strong>Pasajero {idx + 1}:</strong> {p.fullName || "(sin nombre)"}
                </p>
                <p style={{ marginBottom: 2 }}>
                  <strong>Documento:</strong> {p.docType} · {p.document || "-"}
                </p>
                <p style={{ marginBottom: 0 }}>
                  <strong>Asiento asignado:</strong> {p.seat || "-"}
                </p>
              </div>
            ))}

            <hr />

            {/* Resumen de pago */}
            <h3>Resumen de pago</h3>
            <p>
              Subtotal vuelos: <strong>S/. {totals.baseTotal}</strong>
            </p>
            <p>
              Extras (maletas y tarifa):{" "}
              <strong>S/. {totals.extrasTotal}</strong>
            </p>
            <p style={{ fontSize: 20, marginTop: 4 }}>
              Total pagado:{" "}
              <strong>S/. {totals.totalPrice}</strong>
            </p>

            <p style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
              * Este documento es una simulación académica inspirada en
              comprobantes de viaje reales. No constituye un billete de avión
              válido.
            </p>
          </section>
        </div>

        {/* COLUMNA DERECHA: PANEL RÁPIDO */}
        <aside className="checkout-sidebar">
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
