// src/components/FlightCard.js
import React from "react";
import "./FlightCard.css";

function FlightCard({ flight, onSelect }) {
  return (
    <div className="flight-card">
      <div className="flight-header">
        <div>
          <div className="flight-route">
            {flight.origin} → {flight.destination}
          </div>
          <div className="flight-airline">
            {flight.airline} · {flight.fare}
          </div>
        </div>
        <div className="flight-price">S/. {flight.price}</div>
      </div>

      <div className="flight-body">
        <div className="flight-times">
          <span>Salida: {flight.departureTime}</span>
          <span>Llegada: {flight.arrivalTime}</span>
          <span>Duración: {flight.duration}</span>
        </div>
        <div className="flight-extra">
          <span>{flight.stops}</span>
        </div>
      </div>

      <div className="flight-footer">
        <span>ID vuelo: {flight.id}</span>
        <button
          className="btn-choose-flight"
          onClick={() => onSelect && onSelect(flight)}
        >
          Elegir viaje
        </button>
      </div>
    </div>
  );
}

export default FlightCard;
