import express from 'express';
import {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking
} from '../services/bookings.service.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateBooking } from '../middleware/validation.middleware.js';

const router = express.Router();

// GET /bookings - Haal alle bookings op (query: userId)
router.get('/', async (req, res, next) => {
  try {
    const { userId } = req.query;
    const bookings = await getAllBookings({ userId });
    
    // Only return 404 if specifically searching
    if (bookings.length === 0 && userId) {
      return res.status(404).json({ message: 'No bookings found for this user' });
    }
    
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
});

// GET /bookings/:id - Haal booking op via ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await getBookingById(id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
});

// POST /bookings - Maak nieuwe booking (beveiligd met JWT)
router.post('/', authenticate, validateBooking, async (req, res, next) => {
  try {
    const newBooking = await createBooking(req.body);
    res.status(201).json(newBooking);
  } catch (error) {
    // Prisma foreign key constraint error
    if (error.code === 'P2003') {
      return res.status(400).json({ 
        message: 'Invalid userId or propertyId - user or property does not exist' 
      });
    }
    next(error);
  }
});

// PUT /bookings/:id - Update booking (beveiligd met JWT)
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedBooking = await updateBooking(id, req.body);
    
    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.status(200).json(updatedBooking);
  } catch (error) {
    // Prisma foreign key constraint error
    if (error.code === 'P2003') {
      return res.status(400).json({ 
        message: 'Invalid userId or propertyId - user or property does not exist' 
      });
    }
    // Prisma record not found error
    if (error.code === 'P2025') {
      return res.status(404).json({ 
        message: 'Booking not found' 
      });
    }
    next(error);
  }
});

// DELETE /bookings/:id - Verwijder booking (beveiligd met JWT)
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const success = await deleteBooking(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
