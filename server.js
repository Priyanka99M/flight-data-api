// ── Flight Data REST API ─────────────────────────────────────
// A RESTful API built with Node.js and Express
// Exposes aviation fleet and flight data as JSON endpoints
// Built for: Airbus Data Engineering Internship Portfolio

const express = require('express');
const app     = express();
const PORT    = 3000;

app.use(express.json());

// ── Data ─────────────────────────────────────────────────────

const aircraft = [
    {
        id           : 'AC001',
        model        : 'Airbus A220-300',
        manufacturer : 'Airbus',
        capacity     : 160,
        range_km     : 6300,
        engine_type  : 'CFM LEAP-1A',
        status       : 'Active'
    },
    {
        id           : 'AC002',
        model        : 'Airbus A320neo',
        manufacturer : 'Airbus',
        capacity     : 194,
        range_km     : 6300,
        engine_type  : 'CFM LEAP-1A',
        status       : 'Active'
    },
    {
        id           : 'AC003',
        model        : 'Airbus A350-900',
        manufacturer : 'Airbus',
        capacity     : 440,
        range_km     : 15000,
        engine_type  : 'Rolls-Royce Trent XWB',
        status       : 'Active'
    },
    {
        id           : 'AC004',
        model        : 'Airbus A380-800',
        manufacturer : 'Airbus',
        capacity     : 555,
        range_km     : 15200,
        engine_type  : 'Engine Alliance GP7200',
        status       : 'Maintenance'
    },
    {
        id           : 'AC005',
        model        : 'Airbus A321XLR',
        manufacturer : 'Airbus',
        capacity     : 220,
        range_km     : 8700,
        engine_type  : 'CFM LEAP-1A',
        status       : 'Active'
    }
];

const flights = [
    {
        id             : 'FL001',
        flight_number  : 'AI101',
        aircraft_id    : 'AC001',
        origin         : 'BLR',
        destination    : 'DEL',
        departure_time : '2026-05-04T06:00:00',
        arrival_time   : '2026-05-04T08:30:00',
        duration_mins  : 150,
        distance_km    : 1740,
        status         : 'On Time',
        passengers     : 142
    },
    {
        id             : 'FL002',
        flight_number  : 'AI202',
        aircraft_id    : 'AC002',
        origin         : 'BOM',
        destination    : 'LHR',
        departure_time : '2026-05-04T09:00:00',
        arrival_time   : '2026-05-04T14:30:00',
        duration_mins  : 570,
        distance_km    : 7189,
        status         : 'Delayed',
        passengers     : 178
    },
    {
        id             : 'FL003',
        flight_number  : 'AI303',
        aircraft_id    : 'AC003',
        origin         : 'DEL',
        destination    : 'JFK',
        departure_time : '2026-05-04T11:00:00',
        arrival_time   : '2026-05-04T22:00:00',
        duration_mins  : 900,
        distance_km    : 11760,
        status         : 'On Time',
        passengers     : 412
    },
    {
        id             : 'FL004',
        flight_number  : 'AI404',
        aircraft_id    : 'AC004',
        origin         : 'DXB',
        destination    : 'SYD',
        departure_time : '2026-05-04T14:00:00',
        arrival_time   : '2026-05-05T06:00:00',
        duration_mins  : 960,
        distance_km    : 12004,
        status         : 'Cancelled',
        passengers     : 0
    },
    {
        id             : 'FL005',
        flight_number  : 'AI505',
        aircraft_id    : 'AC005',
        origin         : 'MAA',
        destination    : 'SIN',
        departure_time : '2026-05-04T16:00:00',
        arrival_time   : '2026-05-04T22:30:00',
        duration_mins  : 390,
        distance_km    : 3573,
        status         : 'On Time',
        passengers     : 198
    },
    {
        id             : 'FL006',
        flight_number  : 'AI606',
        aircraft_id    : 'AC001',
        origin         : 'HYD',
        destination    : 'BOM',
        departure_time : '2026-05-04T18:00:00',
        arrival_time   : '2026-05-04T19:30:00',
        duration_mins  : 90,
        distance_km    : 711,
        status         : 'On Time',
        passengers     : 135
    }
];

const routes = [
    { origin: 'BLR', destination: 'DEL', total_flights: 42, avg_passengers: 145 },
    { origin: 'BOM', destination: 'LHR', total_flights: 28, avg_passengers: 182 },
    { origin: 'DEL', destination: 'JFK', total_flights: 21, avg_passengers: 398 },
    { origin: 'MAA', destination: 'SIN', total_flights: 35, avg_passengers: 201 },
    { origin: 'HYD', destination: 'BOM', total_flights: 56, avg_passengers: 138 }
];

// ── ROUTES ───────────────────────────────────────────────────

// Route 1: Welcome
app.get('/', (req, res) => {
    res.json({
        message  : '✈️  Flight Data REST API',
        version  : '1.0.0',
        built_by : 'Priyanka Makineni',
        endpoints: [
            'GET /flights              — all flights',
            'GET /flights/:id          — single flight by ID',
            'GET /flights/status/:status — flights by status',
            'GET /aircraft             — all aircraft',
            'GET /aircraft/:id         — single aircraft by ID',
            'GET /aircraft/status/:status — aircraft by status',
            'GET /routes               — all routes',
            'GET /routes/busiest       — top 3 busiest routes',
            'GET /summary              — fleet summary'
        ]
    });
});

// Route 2: Get all flights
app.get('/flights', (req, res) => {
    res.json({
        total   : flights.length,
        flights : flights
    });
});

// Route 3: Get single flight by ID
app.get('/flights/:id', (req, res) => {
    const flight = flights.find(
        f => f.id === req.params.id.toUpperCase()
    );

    if (!flight) {
        return res.status(404).json({
            error   : 'Flight not found',
            message : `No flight found with ID: ${req.params.id}`
        });
    }

    // Attach aircraft details
    const aircraft_details = aircraft.find(
        a => a.id === flight.aircraft_id
    );

    res.json({ ...flight, aircraft: aircraft_details });
});

// Route 4: Get flights by status
app.get('/flights/status/:status', (req, res) => {
    const status  = req.params.status.toLowerCase();
    const results = flights.filter(
        f => f.status.toLowerCase().replace(' ', '') ===
             status.replace(' ', '')
    );

    if (results.length === 0) {
        return res.status(404).json({
            error   : 'No flights found',
            message : `No flights with status: ${status}`
        });
    }

    res.json({
        status  : status,
        total   : results.length,
        flights : results
    });
});

// Route 5: Get all aircraft
app.get('/aircraft', (req, res) => {
    res.json({
        total    : aircraft.length,
        aircraft : aircraft
    });
});

// Route 6: Get single aircraft by ID
app.get('/aircraft/:id', (req, res) => {
    const plane = aircraft.find(
        a => a.id === req.params.id.toUpperCase()
    );

    if (!plane) {
        return res.status(404).json({
            error   : 'Aircraft not found',
            message : `No aircraft found with ID: ${req.params.id}`
        });
    }

    res.json(plane);
});

// Route 7: Get aircraft by status
app.get('/aircraft/status/:status', (req, res) => {
    const status  = req.params.status.toLowerCase();
    const results = aircraft.filter(
        a => a.status.toLowerCase() === status
    );

    if (results.length === 0) {
        return res.status(404).json({
            error   : 'No aircraft found',
            message : `No aircraft with status: ${status}`
        });
    }

    res.json({
        status   : status,
        total    : results.length,
        aircraft : results
    });
});

// Route 8: Get all routes
app.get('/routes', (req, res) => {
    res.json({
        total  : routes.length,
        routes : routes
    });
});

// Route 9: Get top 3 busiest routes
app.get('/routes/busiest', (req, res) => {
    const busiest = [...routes]
        .sort((a, b) => b.total_flights - a.total_flights)
        .slice(0, 3);

    res.json({
        message : 'Top 3 busiest routes by total flights',
        routes  : busiest
    });
});

// Route 10: Fleet summary
app.get('/summary', (req, res) => {
    const total_passengers = flights.reduce(
        (sum, f) => sum + f.passengers, 0
    );
    const on_time = flights.filter(
        f => f.status === 'On Time'
    ).length;
    const on_time_rate = (
        (on_time / flights.length) * 100
    ).toFixed(1);

    const avg_duration = (
        flights.reduce((sum, f) => sum + f.duration_mins, 0) /
        flights.length
    ).toFixed(0);

    res.json({
        fleet_summary : {
            total_aircraft     : aircraft.length,
            active_aircraft    : aircraft.filter(a => a.status === 'Active').length,
            total_flights      : flights.length,
            total_passengers   : total_passengers,
            on_time_rate_pct   : parseFloat(on_time_rate),
            avg_duration_mins  : parseInt(avg_duration),
            total_routes       : routes.length
        }
    });
});

// ── Start server ─────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n✅ Flight Data API running on http://localhost:${PORT}`);
    console.log(`\nEndpoints:`);
    console.log(`  GET http://localhost:${PORT}/`);
    console.log(`  GET http://localhost:${PORT}/flights`);
    console.log(`  GET http://localhost:${PORT}/flights/FL001`);
    console.log(`  GET http://localhost:${PORT}/flights/status/on-time`);
    console.log(`  GET http://localhost:${PORT}/aircraft`);
    console.log(`  GET http://localhost:${PORT}/aircraft/AC001`);
    console.log(`  GET http://localhost:${PORT}/aircraft/status/active`);
    console.log(`  GET http://localhost:${PORT}/routes`);
    console.log(`  GET http://localhost:${PORT}/routes/busiest`);
    console.log(`  GET http://localhost:${PORT}/summary`);
});