// src/pages/FlightsPage.js
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import flightsData from "../data/flights";
import FlightSearch from "../components/FlightSearch";
import FlightList from "../components/FlightList";
import "../App.css";
import "../components/FlightCard.css";

function FlightsPage() {
  const [filters, setFilters] = useState(null);
  const [searchDetails, setSearchDetails] = useState(null);
  const [selectionStep, setSelectionStep] = useState(null); // "outbound" | "return" | null
  const [selectedOutboundFlight, setSelectedOutboundFlight] = useState(null);

  const navigate = useNavigate();

  const handleSearch = (data) => {
    setFilters(data);
    setSearchDetails(data);
    setSelectionStep("outbound");
    setSelectedOutboundFlight(null);
  };

  const {
    flights: filteredFlights,
    noValidReturnAfterTime,
    noFlightsForDay,
  } = useMemo(() => {
    if (!filters) {
      return {
        flights: [],
        noValidReturnAfterTime: false,
        noFlightsForDay: false,
      };
    }

    let result = [...flightsData];
    let noValidReturnAfterTime = false;
    let noFlightsForDay = false;

    const { origin, destination, airline, maxPrice, onlyDirect, order } =
      filters;

    // Filtro de origen/destino
    if (selectionStep === "return" && searchDetails?.tripType === "roundTrip") {
      if (origin && destination) {
        result = result.filter(
          (f) => f.origin === destination && f.destination === origin
        );
      }
    } else {
      if (origin && origin !== "Todos") {
        result = result.filter((f) => f.origin === origin);
      }
      if (destination && destination !== "Todos") {
        result = result.filter((f) => f.destination === destination);
      }
    }

    // Filtro por día de operación del vuelo
    const getDayOfWeek = (dateStr) =>
      dateStr ? new Date(dateStr).getDay() : null;

    if (searchDetails?.tripType === "roundTrip") {
      if (selectionStep === "outbound" && searchDetails.departDate) {
        const dow = getDayOfWeek(searchDetails.departDate);
        const before = result.length;
        result = result.filter(
          (f) => !f.daysOfWeek || f.daysOfWeek.includes(dow)
        );
        if (before > 0 && result.length === 0) {
          noFlightsForDay = true;
        }
      } else if (selectionStep === "return" && searchDetails.returnDate) {
        const dow = getDayOfWeek(searchDetails.returnDate);
        const before = result.length;
        result = result.filter(
          (f) => !f.daysOfWeek || f.daysOfWeek.includes(dow)
        );
        if (before > 0 && result.length === 0) {
          noFlightsForDay = true;
        }
      }
    } else if (selectionStep === "outbound" && searchDetails?.departDate) {
      const dow = getDayOfWeek(searchDetails.departDate);
      const before = result.length;
      result = result.filter(
        (f) => !f.daysOfWeek || f.daysOfWeek.includes(dow)
      );
      if (before > 0 && result.length === 0) {
        noFlightsForDay = true;
      }
    }

    // ⭐ Validación: si ida y vuelta son el mismo día, vuelta mínimo 2h después
    if (
      selectionStep === "return" &&
      searchDetails?.tripType === "roundTrip" &&
      searchDetails?.departDate === searchDetails?.returnDate &&
      selectedOutboundFlight
    ) {
      const toMinutes = (t) => {
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m;
      };

      const outboundTimeMinutes = toMinutes(
        selectedOutboundFlight.departureTime
      );
      const MIN_GAP_MINUTES = 120; // 2 horas

      const beforeFilterLength = result.length;

      result = result.filter(
        (f) => toMinutes(f.departureTime) >= outboundTimeMinutes + MIN_GAP_MINUTES
      );

      if (beforeFilterLength > 0 && result.length === 0) {
        noValidReturnAfterTime = true;
      }
    }

    // Resto de filtros
    if (airline && airline !== "Todas") {
      result = result.filter((f) => f.airline === airline);
    }

    if (maxPrice != null) {
      result = result.filter((f) => f.price <= maxPrice);
    }

    if (onlyDirect) {
      result = result.filter((f) => f.stops === "Directo");
    }

    if (order === "Precio (menor primero)") {
      result.sort((a, b) => a.price - b.price);
    } else if (order === "Precio (mayor primero)") {
      result.sort((a, b) => b.price - a.price);
    } else if (order === "Horario de salida") {
      result.sort((a, b) => (a.departureTime > b.departureTime ? 1 : -1));
    }

    return { flights: result, noValidReturnAfterTime, noFlightsForDay };
  }, [filters, selectionStep, searchDetails, selectedOutboundFlight]);

  const goToSummary = (outboundFlight, returnFlight) => {
    navigate("/resumen", {
      state: {
        searchDetails,
        outboundFlight,
        returnFlight,
      },
    });
  };

  const handleSelectFlight = (flight) => {
    if (!searchDetails) {
      alert("Primero realiza una búsqueda de vuelos.");
      return;
    }

    if (!selectionStep || selectionStep === "outbound") {
      setSelectedOutboundFlight(flight);

      if (searchDetails.tripType === "oneWay") {
        goToSummary(flight, null);
        setSelectionStep(null);
      } else {
        setSelectionStep("return");
      }
    } else if (selectionStep === "return") {
      if (!selectedOutboundFlight) {
        alert("Primero elige tu vuelo de ida.");
        return;
      }

      goToSummary(selectedOutboundFlight, flight);
      setSelectionStep(null);
    }
  };

  const stepMessage = () => {
    if (!searchDetails) return "";
    if (searchDetails.tripType === "oneWay") return "Selecciona tu vuelo de ida.";
    if (selectionStep === "return") return "Selecciona tu vuelo de vuelta.";
    return "Selecciona tu vuelo de ida.";
  };

  const currentRouteLabel = () => {
    if (!searchDetails) return "";
    const { origin, destination } = searchDetails;
    if (!origin || !destination || origin === "Todos" || destination === "Todos")
      return "";
    if (searchDetails.tripType === "roundTrip" && selectionStep === "return") {
      return `${destination} → ${origin}`;
    }
    return `${origin} → ${destination}`;
  };

  const noFlightsMessage = () => {
    if (!searchDetails) return "";

    if (selectionStep === "return") {
      if (noFlightsForDay) {
        return (
          "No hay vuelos de vuelta operando el día seleccionado. " +
          "Prueba cambiando la fecha de regreso."
        );
      }
      if (noValidReturnAfterTime) {
        return (
          "No hay vuelos de vuelta disponibles al menos 2 horas después " +
          "de la hora de tu vuelo de ida. Prueba cambiando la fecha de regreso " +
          "o el horario de salida."
        );
      }
      return "No se encontraron vuelos de vuelta con los criterios seleccionados.";
    }

    if (noFlightsForDay) {
      return (
        "No hay vuelos de ida operando el día seleccionado. " +
        "Prueba cambiando la fecha de salida."
      );
    }

    return "No se encontraron vuelos de ida con los criterios seleccionados.";
  };

  return (
    <main className="app-main">
      <header className="app-header">
        <h1>Mini Despegar · Vuelos</h1>
        <p>Simulador de búsqueda de vuelos similar a despegar.com</p>
      </header>

      <FlightSearch flights={flightsData} onFilter={handleSearch} />

      {!searchDetails && (
        <div className="promo-panel">
          <h2>Promociones destacadas</h2>
          <p>Encuentra las mejores ofertas de vuelos nacionales e internacionales.</p>
          <div className="promo-cards">
            <div className="promo-card">
              <h3>Lima → Cusco</h3>
              <p>Desde S/. 230</p>
            </div>
            <div className="promo-card">
              <h3>Lima → Santiago</h3>
              <p>Desde S/. 690</p>
            </div>
            <div className="promo-card">
              <h3>Lima → Ciudad de México</h3>
              <p>Desde S/. 1350</p>
            </div>
          </div>
          <p style={{ fontSize: "13px", marginTop: "8px" }}>
            Elige origen, destino y fechas en el buscador para ver vuelos disponibles.
          </p>
        </div>
      )}

      {searchDetails && (
        <>
          <h2 className="results-title">Resultados</h2>

          <div className="trip-step-banner">
            <span
              className={
                "plane-icon " +
                (selectionStep === "return" &&
                searchDetails.tripType === "roundTrip"
                  ? "plane-return"
                  : "plane-outbound")
              }
            >
              ✈️
            </span>
            <div className="trip-step-text">
              <div>{stepMessage()}</div>
              {currentRouteLabel() && (
                <div className="trip-route-label">{currentRouteLabel()}</div>
              )}
            </div>
          </div>

          {filteredFlights.length > 0 ? (
            <FlightList
              flights={filteredFlights}
              onSelectFlight={handleSelectFlight}
            />
          ) : (
            <p style={{ fontSize: "13px", marginTop: "12px" }}>
              {noFlightsMessage()}
            </p>
          )}
        </>
      )}
    </main>
  );
}

export default FlightsPage;
