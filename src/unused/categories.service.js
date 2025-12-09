import { readJSON, writeJSON } from './utils/fileHelper.js';
const filePath = 'data/categories.json';

export async function getAllCategories() {
  return await readJSON(filePath);
}

export async function getCategoryById(id) {
  const categories = await readJSON(filePath);
  return categories.find(c => c.id === Number(id));
}

export async function createCategory(newCategory) {
  const categories = await readJSON(filePath);
  newCategory.id = categories.length ? categories[categories.length - 1].id + 1 : 1;
  categories.push(newCategory);
  await writeJSON(filePath, categories);
  return newCategory;
}

export async function updateCategory(id, updatedCategory) {
  const categories = await readJSON(filePath);
  const index = categories.findIndex(c => c.id === Number(id));
  if (index === -1) return null;
  categories[index] = { ...categories[index], ...updatedCategory };
  await writeJSON(filePath, categories);
  return categories[index];
}

export async function deleteCategory(id) {
  const categories = await readJSON(filePath);
  const index = categories.findIndex(c => c.id === Number(id));
  if (index === -1) return false;
  categories.splice(index, 1);
  await writeJSON(filePath, categories);
  return true;
}
