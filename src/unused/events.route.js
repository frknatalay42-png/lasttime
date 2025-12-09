import express from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} from './services/events.service.js';
import { authenticate } from './middleware/auth.middleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { title } = req.query;
  const events = await getAllEvents(title);
  res.json(events);
});

router.get('/:id', async (req, res) => {
  const event = await getEventById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json(event);
});

router.post('/', authenticate, async (req, res) => {
  const newEvent = await createEvent(req.body);
  res.status(201).json(newEvent);
});

router.put('/:id', authenticate, async (req, res) => {
  const updated = await updateEvent(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: 'Event not found' });
  res.json(updated);
});

router.delete('/:id', authenticate, async (req, res) => {
  const success = await deleteEvent(req.params.id);
  if (!success) return res.status(404).json({ message: 'Event not found' });
  res.json({ message: 'Event deleted' });
});

export default router;
