import express from 'express';
import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview
} from '../services/reviews.service.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateReview } from '../middleware/validation.middleware.js';

const router = express.Router();

// GET /reviews - Haal alle reviews op
router.get('/', async (req, res, next) => {
  try {
    const reviews = await getAllReviews();
    
    // Return empty array instead of 404 for reviews list
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
});

// GET /reviews/:id - Haal review op via ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await getReviewById(id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
});

// POST /reviews - Maak nieuwe review (beveiligd met JWT)
router.post('/', authenticate, validateReview, async (req, res, next) => {
  try {
    const newReview = await createReview(req.body);
    res.status(201).json(newReview);
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

// PUT /reviews/:id - Update review (beveiligd met JWT)
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedReview = await updateReview(id, req.body);
    
    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.status(200).json(updatedReview);
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
        message: 'Review not found' 
      });
    }
    next(error);
  }
});

// DELETE /reviews/:id - Verwijder review (beveiligd met JWT)
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const success = await deleteReview(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
