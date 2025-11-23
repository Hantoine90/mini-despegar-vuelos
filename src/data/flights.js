// src/data/flights.js

const flightsData = [
  // ============================
  // LIMA → CUSCO (IDA)
  // ============================
  {
    id: 1,
    origin: "Lima",
    destination: "Cusco",
    airline: "LATAM",
    departureTime: "08:10",
    arrivalTime: "09:35",
    duration: "1h 25m",
    price: 289,
    currency: "PEN",
    stops: "Directo",
    fare: "Light",
    daysOfWeek: [0,1,2,3,4,5,6], // todos los días
  },
  {
    id: 2,
    origin: "Lima",
    destination: "Cusco",
    airline: "Sky Airline",
    departureTime: "06:30",
    arrivalTime: "07:55",
    duration: "1h 25m",
    price: 230,
    currency: "PEN",
    stops: "Directo",
    fare: "Promo",
    daysOfWeek: [1,3,5], // lun - mié - vie
  },
  {
    id: 3,
    origin: "Lima",
    destination: "Cusco",
    airline: "JetSMART",
    departureTime: "19:10",
    arrivalTime: "20:40",
    duration: "1h 30m",
    price: 310,
    currency: "PEN",
    stops: "Directo",
    fare: "Plus",
    daysOfWeek: [2,4,6], // mar - jue - sáb
  },

  // ============================
  // CUSCO → LIMA (VUELTA)
  // ============================
  {
    id: 10,
    origin: "Cusco",
    destination: "Lima",
    airline: "LATAM",
    departureTime: "10:30",
    arrivalTime: "11:55",
    duration: "1h 25m",
    price: 295,
    currency: "PEN",
    stops: "Directo",
    fare: "Light",
    daysOfWeek: [0,1,2,3,4,5,6],
  },
  {
    id: 11,
    origin: "Cusco",
    destination: "Lima",
    airline: "Sky Airline",
    departureTime: "14:15",
    arrivalTime: "15:40",
    duration: "1h 25m",
    price: 240,
    currency: "PEN",
    stops: "Directo",
    fare: "Promo",
    daysOfWeek: [1,3,5],
  },
  {
    id: 12,
    origin: "Cusco",
    destination: "Lima",
    airline: "JetSMART",
    departureTime: "21:10",
    arrivalTime: "22:40",
    duration: "1h 30m",
    price: 320,
    currency: "PEN",
    stops: "Directo",
    fare: "Plus",
    daysOfWeek: [2,4,6],
  },

  // ============================
  // LIMA → SANTIAGO (IDA)
  // ============================
  {
    id: 4,
    origin: "Lima",
    destination: "Santiago",
    airline: "LATAM",
    departureTime: "10:45",
    arrivalTime: "15:20",
    duration: "3h 35m",
    price: 820,
    currency: "PEN",
    stops: "Directo",
    fare: "Light",
    daysOfWeek: [0,1,2,3,4,5,6],
  },
  {
    id: 5,
    origin: "Lima",
    destination: "Santiago",
    airline: "Sky Airline",
    departureTime: "23:50",
    arrivalTime: "04:15",
    duration: "3h 25m",
    price: 690,
    currency: "PEN",
    stops: "Directo",
    fare: "Promo",
    daysOfWeek: [1,3,5],
  },

  // ============================
  // SANTIAGO → LIMA (VUELTA)
  // ============================
  {
    id: 13,
    origin: "Santiago",
    destination: "Lima",
    airline: "LATAM",
    departureTime: "08:00",
    arrivalTime: "10:35",
    duration: "3h 35m",
    price: 830,
    currency: "PEN",
    stops: "Directo",
    fare: "Light",
    daysOfWeek: [0,1,2,3,4,5,6],
  },
  {
    id: 14,
    origin: "Santiago",
    destination: "Lima",
    airline: "Sky Airline",
    departureTime: "18:20",
    arrivalTime: "21:45",
    duration: "3h 25m",
    price: 700,
    currency: "PEN",
    stops: "Directo",
    fare: "Promo",
    daysOfWeek: [1,3,5],
  },

  // ============================
  // LIMA → BOGOTÁ (IDA)
  // ============================
  {
    id: 6,
    origin: "Lima",
    destination: "Bogotá",
    airline: "Avianca",
    departureTime: "09:00",
    arrivalTime: "12:40",
    duration: "3h 40m",
    price: 950,
    currency: "PEN",
    stops: "Directo",
    fare: "Económica",
    daysOfWeek: [0,1,2,3,4,5,6],
  },
  {
    id: 7,
    origin: "Lima",
    destination: "Bogotá",
    airline: "Copa Airlines",
    departureTime: "02:20",
    arrivalTime: "08:10",
    duration: "5h 50m",
    price: 780,
    currency: "PEN",
    stops: "1 escala",
    fare: "Promo",
    daysOfWeek: [0,1,2,3,4,5,6],
  },

  // ============================
  // BOGOTÁ → LIMA (VUELTA)
  // ============================
  {
    id: 15,
    origin: "Bogotá",
    destination: "Lima",
    airline: "Avianca",
    departureTime: "13:30",
    arrivalTime: "17:10",
    duration: "3h 40m",
    price: 960,
    currency: "PEN",
    stops: "Directo",
    fare: "Económica",
    daysOfWeek: [0,1,2,3,4,5,6],
  },
  {
    id: 16,
    origin: "Bogotá",
    destination: "Lima",
    airline: "Copa Airlines",
    departureTime: "19:00",
    arrivalTime: "00:50",
    duration: "5h 50m",
    price: 790,
    currency: "PEN",
    stops: "1 escala",
    fare: "Promo",
    daysOfWeek: [0,1,2,3,4,5,6],
  },

  // ============================
  // LIMA → MÉXICO DF (IDA)
  // ============================
  {
    id: 8,
    origin: "Lima",
    destination: "Mexico DF",
    airline: "Aeroméxico",
    departureTime: "01:00",
    arrivalTime: "07:30",
    duration: "6h 30m",
    price: 1350,
    currency: "PEN",
    stops: "Directo",
    fare: "Económica",
    daysOfWeek: [0,1,2,3,4,5,6],
  },
  {
    id: 9,
    origin: "Lima",
    destination: "Mexico DF",
    airline: "LATAM",
    departureTime: "18:15",
    arrivalTime: "01:10",
    duration: "6h 55m",
    price: 1480,
    currency: "PEN",
    stops: "Directo",
    fare: "Light",
    daysOfWeek: [0,1,2,3,4,5,6],
  },

  // ============================
  // MÉXICO DF → LIMA (VUELTA)
  // ============================
  {
    id: 17,
    origin: "Mexico DF",
    destination: "Lima",
    airline: "Aeroméxico",
    departureTime: "09:00",
    arrivalTime: "15:30",
    duration: "6h 30m",
    price: 1360,
    currency: "PEN",
    stops: "Directo",
    fare: "Económica",
    daysOfWeek: [0,1,2,3,4,5,6],
  },
  {
    id: 18,
    origin: "Mexico DF",
    destination: "Lima",
    airline: "LATAM",
    departureTime: "23:10",
    arrivalTime: "05:55",
    duration: "6h 45m",
    price: 1490,
    currency: "PEN",
    stops: "Directo",
    fare: "Light",
    daysOfWeek: [0,1,2,3,4,5,6],
  },
];

export default flightsData;
