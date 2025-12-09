/**
 * Validation Middleware
 * Valideert input data voor verschillende resources
 */

/**
 * Valideer host input
 */
export const validateHost = (req, res, next) => {
  const { username, password, name, email, phoneNumber, profilePicture, aboutMe } = req.body;
  
  const missingFields = [];
  
  if (!username) missingFields.push('username');
  if (!password) missingFields.push('password');
  if (!name) missingFields.push('name');
  if (!email) missingFields.push('email');
  if (!phoneNumber) missingFields.push('phoneNumber');
  if (!profilePicture) missingFields.push('profilePicture');
  if (!aboutMe) missingFields.push('aboutMe');
  
  if (missingFields.length > 0) {
    return res.status(400).json({ 
      message: `Missing required fields: ${missingFields.join(', ')}` 
    });
  }
  
  next();
};

/**
 * Valideer property input
 */
export const validateProperty = (req, res, next) => {
  const { 
    title, 
    description, 
    location, 
    pricePerNight, 
    bedroomCount, 
    bathRoomCount, 
    maxGuestCount, 
    hostId, 
    rating 
  } = req.body;
  
  const missingFields = [];
  
  if (!title) missingFields.push('title');
  if (!description) missingFields.push('description');
  if (!location) missingFields.push('location');
  if (pricePerNight === undefined) missingFields.push('pricePerNight');
  if (bedroomCount === undefined) missingFields.push('bedroomCount');
  if (bathRoomCount === undefined) missingFields.push('bathRoomCount');
  if (maxGuestCount === undefined) missingFields.push('maxGuestCount');
  if (!hostId) missingFields.push('hostId');
  if (rating === undefined) missingFields.push('rating');
  
  if (missingFields.length > 0) {
    return res.status(400).json({ 
      message: `Missing required fields: ${missingFields.join(', ')}` 
    });
  }
  
  next();
};

/**
 * Valideer user input
 */
export const validateUser = (req, res, next) => {
  const { username, password, name, email, phoneNumber, profilePicture } = req.body;
  
  const missingFields = [];
  
  if (!username) missingFields.push('username');
  if (!password) missingFields.push('password');
  if (!name) missingFields.push('name');
  if (!email) missingFields.push('email');
  if (!phoneNumber) missingFields.push('phoneNumber');
  if (!profilePicture) missingFields.push('profilePicture');
  
  if (missingFields.length > 0) {
    return res.status(400).json({ 
      message: `Missing required fields: ${missingFields.join(', ')}` 
    });
  }
  
  next();
};

/**
 * Valideer booking input
 */
export const validateBooking = (req, res, next) => {
  const { userId, propertyId, checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus } = req.body;
  
  const missingFields = [];
  
  if (!userId) missingFields.push('userId');
  if (!propertyId) missingFields.push('propertyId');
  if (!checkinDate) missingFields.push('checkinDate');
  if (!checkoutDate) missingFields.push('checkoutDate');
  if (numberOfGuests === undefined) missingFields.push('numberOfGuests');
  if (totalPrice === undefined) missingFields.push('totalPrice');
  if (!bookingStatus) missingFields.push('bookingStatus');
  
  if (missingFields.length > 0) {
    return res.status(400).json({ 
      message: `Missing required fields: ${missingFields.join(', ')}` 
    });
  }
  
  next();
};

/**
 * Valideer review input
 */
export const validateReview = (req, res, next) => {
  const { userId, propertyId, rating, comment } = req.body;
  
  const missingFields = [];
  
  if (!userId) missingFields.push('userId');
  if (!propertyId) missingFields.push('propertyId');
  if (rating === undefined) missingFields.push('rating');
  if (!comment) missingFields.push('comment');
  
  if (missingFields.length > 0) {
    return res.status(400).json({ 
      message: `Missing required fields: ${missingFields.join(', ')}` 
    });
  }
  
  next();
};
