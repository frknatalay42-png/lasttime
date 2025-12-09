import jwt from 'jsonwebtoken';

// JWT authenticatie middleware - beveiligt routes
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing' });
  }
  
  const token = authHeader.split(' ')[1]; // Bearer <token>
  
  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.AUTH_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
