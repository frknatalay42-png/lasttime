import { PrismaClient } from '@prisma/client';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  // Laad JSON data
  const usersData = JSON.parse(
    await readFile(join(__dirname, '../src/data/users.json'), 'utf-8')
  );
  const hostsData = JSON.parse(
    await readFile(join(__dirname, '../src/data/hosts.json'), 'utf-8')
  );
  const propertiesData = JSON.parse(
    await readFile(join(__dirname, '../src/data/properties.json'), 'utf-8')
  );
  const bookingsData = JSON.parse(
    await readFile(join(__dirname, '../src/data/bookings.json'), 'utf-8')
  );
  const reviewsData = JSON.parse(
    await readFile(join(__dirname, '../src/data/reviews.json'), 'utf-8')
  );

  // Seed users
  for (const user of usersData) {
    await prisma.user.create({ data: user });
  }

  // Seed hosts
  for (const host of hostsData) {
    await prisma.host.create({ data: host });
  }

  // Seed properties
  for (const property of propertiesData) {
    await prisma.property.create({ data: property });
  }

  // Seed bookings
  for (const booking of bookingsData) {
    await prisma.booking.create({ data: booking });
  }

  // Seed reviews
  for (const review of reviewsData) {
    await prisma.review.create({ data: review });
  }

  console.log('✅ Database seeded!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
