import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import client from 'prom-client';
import cookieParser from 'cookie-parser';
import userAuth from './routes/auth.js';
import voting from './routes/voting.js';
import { redisConnect } from './config/redisConnect.js';
import { connectDB } from './config/connectDB.js';

const app = express();  
const metricServer = express();

app.use(express.json());
app.use(cookieParser());
// app.use(cors({
//     origin: [
//         process.env.FRONTEND_PRODUCTION_URL,
//         process.env.FRONTEND_DEVELOPMENT_URL,
//         'http://localhost:5173'
//     ],
//     methods: ['GET', 'POST', 'PUT'],
//     credentials: true,
// }));
app.use(cors());

async function initConnection() {
    if (!redisConnect.isOpen) {
        await redisConnect.connect();
        console.log(`Redis connected`);
    }

    await connectDB(process.env.NODE_ENV);
}

initConnection();

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Backend running..."
    })
});

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status'],
    registers: [register],
});
              
metricServer.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

app.use((req, res, next) => {
    res.on('finish', () => {
        httpRequestCounter.inc({
            method: req.method,
            route: req.route?.path || req.path,
            status: res.statusCode,
        });
    });
    next();
});
app.use(voting);
app.use(userAuth);

const port = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
    app.listen(port, "0.0.0.0", () => {
        console.log('Server started');
    });

    metricServer.listen(7000, "0.0.0.0", () => {
        console.log("Metrics server started");
    });
}


export default app;

