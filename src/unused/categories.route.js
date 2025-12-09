import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from './services/categories.service.js';
import { authenticate } from './middleware/auth.middleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const categories = await getAllCategories();
  res.json(categories);
});

router.get('/:id', async (req, res) => {
  const category = await getCategoryById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json(category);
});

router.post('/', authenticate, async (req, res) => {
  const newCategory = await createCategory(req.body);
  res.status(201).json(newCategory);
});

router.put('/:id', authenticate, async (req, res) => {
  const updated = await updateCategory(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: 'Category not found' });
  res.json(updated);
});

router.delete('/:id', authenticate, async (req, res) => {
  const success = await deleteCategory(req.params.id);
  if (!success) return res.status(404).json({ message: 'Category not found' });
  res.json({ message: 'Category deleted' });
});

export default router;
