import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Haal alle users op (zonder password) - ondersteunt filters
export async function getAllUsers(filters = {}) {
  const { username, email } = filters;
  
  return await prisma.user.findMany({
    where: {
      ...(username && { username }),
      ...(email && { email }),
    },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      phoneNumber: true,
      profilePicture: true,
    },
  });
}

/**
 * Get user by ID (excluding password field)
 */
export async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      phoneNumber: true,
      profilePicture: true,
    },
  });
}

/**
 * Create a new user
 * Returns error object if user with username already exists
 */
export async function createUser(userData) {
  // Check if user with username already exists
  const existingUser = await prisma.user.findUnique({
    where: { username: userData.username }
  });
  
  if (existingUser) {
    return { 
      error: true, 
      statusCode: 409, 
      message: 'User with this username already exists' 
    };
  }
  
  return await prisma.user.create({
    data: userData,
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      phoneNumber: true,
      profilePicture: true,
    },
  });
}

/**
 * Update a user by ID
 */
export async function updateUser(id, userData) {
  try {
    return await prisma.user.update({
      where: { id },
      data: userData,
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
      },
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return null; // User not found
    }
    throw error;
  }
}

/**
 * Delete a user by ID
 */
export async function deleteUser(id) {
  try {
    await prisma.user.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    if (error.code === 'P2025') {
      return false; // User not found
    }
    throw error;
  }
}

/**
 * Get user by username (for authentication)
 */
export async function getUserByUsername(username) {
  return await prisma.user.findUnique({
    where: { username },
  });
}
