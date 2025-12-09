import express from 'express';
import dotenv from 'dotenv';
import * as Sentry from '@sentry/node';

// Routes
import authRoute from './routes/auth.route.js';
import usersRoute from './routes/users.route.js';
import hostsRoute from './routes/hosts.route.js';
import propertiesRoute from './routes/properties.route.js';
import bookingsRoute from './routes/bookings.route.js';
import reviewsRoute from './routes/reviews.route.js';

// Middleware
import logger from './middleware/logger.middleware.js';
import errorHandler from './middleware/error.middleware.js';

dotenv.config();

const app = express();

// Sentry initialisatie - rapporteert alle onbehandelde errors
if (process.env.SENTRY_DSN) {
  Sentry.init({ 
    dsn: process.env.SENTRY_DSN, 
    tracesSampleRate: 1.0 
  });
}

// Middleware - logger voor request duration
app.use(express.json());
app.use(logger);

// Routes - alle CRUD endpoints voor users, hosts, properties, bookings, reviews
app.use('/', authRoute); // Login endpoint met JWT
app.use('/users', usersRoute);
app.use('/hosts', hostsRoute);
app.use('/properties', propertiesRoute);
app.use('/bookings', bookingsRoute);
app.use('/reviews', reviewsRoute);

// Error handler - vangt alle errors op en rapporteert naar Sentry
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});



