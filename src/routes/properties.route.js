import express from 'express';
import {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty
} from '../services/properties.service.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateProperty } from '../middleware/validation.middleware.js';

const router = express.Router();

// GET /properties - Haal alle properties op (query: location, pricePerNight)
router.get('/', async (req, res, next) => {
  try {
    const { location, pricePerNight } = req.query;
    const properties = await getAllProperties({ location, pricePerNight });
    
    // Return 404 only if specifically searching and no results
    if (properties.length === 0 && (location || pricePerNight)) {
      return res.status(404).json({ message: 'No properties found matching the criteria' });
    }
    
    res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
});

// GET /properties/:id - Haal property op via ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await getPropertyById(id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    res.status(200).json(property);
  } catch (error) {
    next(error);
  }
});

// POST /properties - Maak nieuwe property (beveiligd met JWT)
router.post('/', authenticate, validateProperty, async (req, res, next) => {
  try {
    const newProperty = await createProperty(req.body);
    res.status(201).json(newProperty);
  } catch (error) {
    // Prisma foreign key constraint error
    if (error.code === 'P2003') {
      return res.status(400).json({ 
        message: 'Invalid hostId - host does not exist' 
      });
    }
    next(error);
  }
});

// PUT /properties/:id - Update property (beveiligd met JWT)
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedProperty = await updateProperty(id, req.body);
    
    if (!updatedProperty) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    res.status(200).json(updatedProperty);
  } catch (error) {
    // Prisma foreign key constraint error
    if (error.code === 'P2003') {
      return res.status(400).json({ 
        message: 'Invalid hostId - host does not exist' 
      });
    }
    // Prisma record not found error
    if (error.code === 'P2025') {
      return res.status(404).json({ 
        message: 'Property not found' 
      });
    }
    next(error);
  }
});

// DELETE /properties/:id - Verwijder property (beveiligd met JWT)
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const success = await deleteProperty(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
