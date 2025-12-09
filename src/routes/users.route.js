import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../services/users.service.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateUser } from '../middleware/validation.middleware.js';

const router = express.Router();

// GET /users - Haal alle users op (query: username, email)
router.get('/', async (req, res, next) => {
  try {
    const { username, email } = req.query;
    const users = await getAllUsers({ username, email });
    
    // Only return 404 if specifically searching
    if (users.length === 0 && (username || email)) {
      return res.status(404).json({ message: 'No users found matching the criteria' });
    }
    
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

// GET /users/:id - Haal user op via ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// POST /users - Maak nieuwe user (beveiligd met JWT)
router.post('/', authenticate, validateUser, async (req, res, next) => {
  try {
    const newUser = await createUser(req.body);
    
    if (newUser.error) {
      return res.status(newUser.statusCode).json({ message: newUser.message });
    }
    
    res.status(201).json(newUser);
  } catch (error) {
    // Prisma unique constraint error
    if (error.code === 'P2002') {
      return res.status(409).json({ 
        message: 'A user with this username already exists' 
      });
    }
    next(error);
  }
});

// PUT /users/:id - Update user (beveiligd met JWT)
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedUser = await updateUser(id, req.body);
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
});

// DELETE /users/:id - Verwijder user (beveiligd met JWT)
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const success = await deleteUser(id);
    
    if (!success) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
