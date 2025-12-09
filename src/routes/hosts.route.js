import express from 'express';
import {
  getAllHosts,
  getHostById,
  createHost,
  updateHost,
  deleteHost
} from '../services/hosts.service.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateHost } from '../middleware/validation.middleware.js';

const router = express.Router();

// GET /hosts - Haal alle hosts op (query: name)
router.get('/', async (req, res, next) => {
  try {
    const { name } = req.query;
    const hosts = await getAllHosts({ name });
    
    // Return empty array if no results, 404 only if specifically searching
    if (hosts.length === 0 && name) {
      return res.status(404).json({ message: 'No hosts found with that name' });
    }
    
    res.status(200).json(hosts);
  } catch (error) {
    next(error);
  }
});

// GET /hosts/:id - Haal host op via ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const host = await getHostById(id);
    
    if (!host) {
      return res.status(404).json({ message: 'Host not found' });
    }
    
    res.status(200).json(host);
  } catch (error) {
    next(error);
  }
});

// POST /hosts - Maak nieuwe host (beveiligd met JWT)
router.post('/', authenticate, validateHost, async (req, res, next) => {
  try {
    const newHost = await createHost(req.body);
    
    if (newHost.error) {
      return res.status(newHost.statusCode).json({ message: newHost.message });
    }
    
    res.status(201).json(newHost);
  } catch (error) {
    // Prisma unique constraint error
    if (error.code === 'P2002') {
      return res.status(409).json({ 
        message: 'A host with this username already exists' 
      });
    }
    next(error);
  }
});

// PUT /hosts/:id - Update host (beveiligd met JWT)
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedHost = await updateHost(id, req.body);
    
    if (!updatedHost) {
      return res.status(404).json({ message: 'Host not found' });
    }
    
    res.status(200).json(updatedHost);
  } catch (error) {
    next(error);
  }
});

// DELETE /hosts/:id - Verwijder host (beveiligd met JWT)
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const success = await deleteHost(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Host not found' });
    }
    
    res.status(200).json({ message: 'Host deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
