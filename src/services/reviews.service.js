import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get all reviews
 */
export async function getAllReviews() {
  return await prisma.review.findMany();
}

/**
 * Get review by ID
 */
export async function getReviewById(id) {
  return await prisma.review.findUnique({
    where: { id },
  });
}

/**
 * Create a new review
 */
export async function createReview(reviewData) {
  return await prisma.review.create({
    data: {
      ...reviewData,
      rating: parseInt(reviewData.rating),
    },
  });
}

/**
 * Update a review by ID
 */
export async function updateReview(id, reviewData) {
  try {
    const updateData = { ...reviewData };
    if (updateData.rating) {
      updateData.rating = parseInt(updateData.rating);
    }
    
    return await prisma.review.update({
      where: { id },
      data: updateData,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return null;
    }
    throw error;
  }
}

/**
 * Delete a review by ID
 */
export async function deleteReview(id) {
  try {
    await prisma.review.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    if (error.code === 'P2025') {
      return false;
    }
    throw error;
  }
}
