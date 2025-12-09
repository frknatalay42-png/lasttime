import { readJSON, writeJSON } from './utils/fileHelper.js';
const filePath = 'data/events.json';

export async function getAllEvents(title) {
  const events = await readJSON(filePath);
  if (title) {
    return events.filter(e =>
      e.title.toLowerCase().includes(title.toLowerCase())
    );
  }
  return events;
}

export async function getEventById(id) {
  const events = await readJSON(filePath);
  return events.find(e => e.id === Number(id));
}

export async function createEvent(newEvent) {
  const events = await readJSON(filePath);
  newEvent.id = events.length ? events[events.length - 1].id + 1 : 1;
  events.push(newEvent);
  await writeJSON(filePath, events);
  return newEvent;
}

export async function updateEvent(id, updatedEvent) {
  const events = await readJSON(filePath);
  const index = events.findIndex(e => e.id === Number(id));
  if (index === -1) return null;
  events[index] = { ...events[index], ...updatedEvent };
  await writeJSON(filePath, events);
  return events[index];
}

export async function deleteEvent(id) {
  const events = await readJSON(filePath);
  const index = events.findIndex(e => e.id === Number(id));
  if (index === -1) return false;
  events.splice(index, 1);
  await writeJSON(filePath, events);
  return true;
}
