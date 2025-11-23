// src/components/FlightSearch.js
import React, { useMemo, useState } from "react";
import "./FlightSearch.css";

function FlightSearch({ flights, onFilter }) {
  // Filtros reales
  const [origin, setOrigin] = useState("Todos");
  const [destination, setDestination] = useState("Todos");
  const [maxPrice, setMaxPrice] = useState("");

  // Estados visuales
  const [tripType, setTripType] = useState("roundTrip"); // ida/vuelta | oneWay | multi
  const [productType, setProductType] = useState("flight"); // vuelo | vuelo+hotel
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [numPassengers, setNumPassengers] = useState(1);
  const [travelClass, setTravelClass] = useState("Económica");
  const [cheapestAnyDate, setCheapestAnyDate] = useState(false);
  const [dateError, setDateError] = useState("");

  // ====== FECHAS ======
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split("T")[0];

  const tripDays = useMemo(() => {
    if (!departDate || !returnDate) return null;
    const start = new Date(departDate);
    const end = new Date(returnDate);
    const diffMs = end.getTime() - start.getTime();
    if (diffMs < 0) return null;
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
  }, [departDate, returnDate]);

  const MAX_TRIP_DAYS = 30;

  const passengersLabel =
    `${numPassengers} ` +
    (numPassengers === 1 ? "persona" : "personas") +
    `, ${travelClass}`;

  // ====== ORIGEN / DESTINO ======
  const origins = useMemo(
    () => ["Todos", ...Array.from(new Set(flights.map((f) => f.origin)))],
    [flights]
  );

  const destinationsBase = useMemo(
    () => ["Todos", ...Array.from(new Set(flights.map((f) => f.destination)))],
    [flights]
  );

  const destinations = useMemo(() => {
    if (!origin || origin === "Todos") return destinationsBase;
    return destinationsBase.filter(
      (d) => d === "Todos" || d !== origin
    );
  }, [destinationsBase, origin]);

  const isSearchDisabled =
    origin === "Todos" ||
    destination === "Todos" ||
    !departDate ||
    (tripType === "roundTrip" && !returnDate);

  // SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();
    setDateError("");

    // Validar duración máxima
    if (tripType === "roundTrip" && departDate && returnDate) {
      const start = new Date(departDate);
      const end = new Date(returnDate);
      const diffMs = end.getTime() - start.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      if (diffDays > MAX_TRIP_DAYS) {
        setDateError(
          `La duración del viaje no puede superar los ${MAX_TRIP_DAYS} días.`
        );
        return;
      }
    }

    if (departDate && departDate < minDateStr) {
      setDateError("La fecha de ida debe ser desde mañana en adelante.");
      return;
    }

    if (tripType === "roundTrip" && departDate && returnDate) {
      if (returnDate < departDate) {
        setDateError("La fecha de vuelta no puede ser anterior a la ida.");
        return;
      }
    }

    onFilter({
      origin,
      destination,
      airline: null,
      maxPrice: maxPrice ? Number(maxPrice) : null,
      onlyDirect: false,
      order: "Sin orden",
      tripType,
      productType,
      departDate,
      returnDate,
      numPassengers,
      travelClass,
      cheapestAnyDate,
    });
  };

  return (
    <div className="search-card-wrapper">
      <form className="search-card" onSubmit={handleSubmit}>
        {/* Cabecera */}
        <div className="search-card-header">
          <div className="search-title">Vuelos</div>

          <div className="header-right">
            {/* Tipo de viaje */}
            <div className="trip-tabs">
              <button
                type="button"
                className={tripType === "roundTrip" ? "trip-tab active" : "trip-tab"}
                onClick={() => setTripType("roundTrip")}
              >
                Ida y vuelta
              </button>
              <button
                type="button"
                className={tripType === "oneWay" ? "trip-tab active" : "trip-tab"}
                onClick={() => setTripType("oneWay")}
              >
                Solo ida
              </button>
              <button
                type="button"
                className={tripType === "multi" ? "trip-tab active" : "trip-tab"}
                onClick={() => setTripType("multi")}
              >
                Multidestino
              </button>
            </div>

            {/* Tipo de producto */}
            <div className="product-tabs">
              <button
                type="button"
                className={productType === "flight" ? "product-tab active" : "product-tab"}
                onClick={() => setProductType("flight")}
              >
                ✈ Vuelo
              </button>
              <button
                type="button"
                className={
                  productType === "flightHotel" ? "product-tab active" : "product-tab"
                }
                onClick={() => setProductType("flightHotel")}
              >
                ✈ Vuelo + 🏨 Alojamiento
              </button>
            </div>
          </div>
        </div>

        {/* Grid principal */}
        <div className="search-grid">
          {/* ORIGEN */}
          <div className="search-cell">
            <span className="cell-label">ORIGEN</span>
            <select
              value={origin}
              onChange={(e) => {
                const value = e.target.value;
                setOrigin(value);
                if (value === destination) {
                  setDestination("Todos");
                }
              }}
              className="cell-select"
            >
              {origins.map((o) => (
                <option key={o} value={o}>
                  {o === "Todos" ? "Selecciona origen" : o}
                </option>
              ))}
            </select>
          </div>

          {/* DESTINO */}
          <div className="search-cell">
            <span className="cell-label">DESTINO</span>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="cell-select"
            >
              {destinations.map((d) => (
                <option key={d} value={d}>
                  {d === "Todos" ? "Selecciona destino" : d}
                </option>
              ))}
            </select>
          </div>

          {/* FECHAS */}
          <div className="search-cell">
            <span className="cell-label">FECHAS</span>
            <div className="cell-dates">
              {/* Ida */}
              <div className="date-field">
                <small>Ida</small>
                <input
                  type="date"
                  value={departDate}
                  min={minDateStr}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value && value < minDateStr) {
                      setDepartDate(minDateStr);
                      return;
                    }
                    if (returnDate && value && returnDate < value) {
                      setReturnDate(value);
                    }
                    setDepartDate(value);
                  }}
                />
              </div>
              {/* Vuelta */}
              <div className="date-field">
                <small>Vuelta</small>
                <input
                  type="date"
                  value={returnDate}
                  min={departDate || minDateStr}
                  disabled={tripType === "oneWay"}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value && value < minDateStr) {
                      setReturnDate(departDate || minDateStr);
                      return;
                    }
                    if (departDate && value && value < departDate) {
                      setReturnDate(departDate);
                      return;
                    }
                    setReturnDate(value);
                  }}
                />
              </div>
            </div>

            {tripType === "roundTrip" && tripDays !== null && (
              <div className="trip-days-info">
                {tripDays === 0
                  ? "Viaje de 1 día"
                  : `${tripDays} días entre ida y vuelta`}
              </div>
            )}
          </div>

          {/* PASAJEROS */}
          <div className="search-cell">
            <span className="cell-label">PASAJEROS Y CLASE</span>
            <div className="passenger-select-group">
              <select
                value={numPassengers}
                onChange={(e) => setNumPassengers(Number(e.target.value))}
              >
                {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "persona" : "personas"}
                  </option>
                ))}
              </select>

              <select
                value={travelClass}
                onChange={(e) => setTravelClass(e.target.value)}
              >
                <option value="Económica">Económica</option>
                <option value="Premium Economy">Premium Economy</option>
                <option value="Ejecutiva">Ejecutiva</option>
                <option value="Primera">Primera</option>
              </select>
            </div>
            <div className="passengers-summary">{passengersLabel}</div>
          </div>

          {/* BOTÓN BUSCAR */}
          <div className="search-cell search-cell-button">
            <button
              type="submit"
              className="btn-search-big"
              disabled={isSearchDisabled}
            >
              🔍 Buscar
            </button>
          </div>
        </div>

        {/* Fila inferior */}
        <div className="search-footer-row">
          <div className="footer-left">
            <label className="price-label">
              Precio máximo (S/.)
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Opcional"
              />
            </label>
          </div>

          <div className="footer-right">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={cheapestAnyDate}
                onChange={(e) => setCheapestAnyDate(e.target.checked)}
              />
              <span>Cualquier fecha más barata</span>
            </label>
          </div>
        </div>

        {dateError && <p className="date-error">{dateError}</p>}
      </form>
    </div>
  );
}

export default FlightSearch;
