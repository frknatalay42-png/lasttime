import express from 'express';
import jwt from 'jsonwebtoken';
import { getUserByUsername } from '../services/users.service.js';

const router = express.Router();

// POST /login - Login met JWT token
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    const user = await getUserByUsername(username);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.AUTH_SECRET_KEY,
      { expiresIn: '24h' }
    );
    
    res.status(200).json({ message: 'Successfully logged in!', token });
  } catch (error) {
    next(error);
  }
});

export default router;
