// src/components/FlightList.js
import React from "react";
import FlightCard from "./FlightCard";

function FlightList({ flights, onSelectFlight }) {
  if (!flights.length) {
    return <p>No se encontraron vuelos con esos criterios.</p>;
  }

  return (
    <div>
      {flights.map((f) => (
        <FlightCard key={f.id} flight={f} onSelect={onSelectFlight} />
      ))}
    </div>
  );
}

export default FlightList;
