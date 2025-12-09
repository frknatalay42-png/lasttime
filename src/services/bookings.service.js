import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get all bookings
 * Supports query parameter: userId
 */
export async function getAllBookings(filters = {}) {
  const { userId } = filters;
  
  return await prisma.booking.findMany({
    where: {
      ...(userId && { userId }),
    },
  });
}

/**
 * Get booking by ID
 */
export async function getBookingById(id) {
  return await prisma.booking.findUnique({
    where: { id },
  });
}

/**
 * Create a new booking
 */
export async function createBooking(bookingData) {
  return await prisma.booking.create({
    data: {
      ...bookingData,
      totalPrice: parseFloat(bookingData.totalPrice),
    },
  });
}

/**
 * Update a booking by ID
 */
export async function updateBooking(id, bookingData) {
  try {
    const updateData = { ...bookingData };
    if (updateData.totalPrice) {
      updateData.totalPrice = parseFloat(updateData.totalPrice);
    }
    
    return await prisma.booking.update({
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
 * Delete a booking by ID
 */
export async function deleteBooking(id) {
  try {
    await prisma.booking.delete({
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
