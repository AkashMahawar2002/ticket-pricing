import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { validateBody } from '../middleware/validate.js';
import { ticketItemsSchema, importSchema } from '../schemas/commerce.schemas.js';
import * as controller from '../controllers/commerce.controller.js';

const router = Router();
router.get('/catalog', controller.catalog);
router.get('/shows/:showId', controller.show);
router.post('/shows/:showId/quote', authenticate, validateBody(ticketItemsSchema), controller.quote);
router.post('/shows/:showId/import-prices', authenticate, validateBody(importSchema), controller.importPrices);
router.post('/shows/:showId/bookings', authenticate, validateBody(ticketItemsSchema), controller.createBooking);
router.get('/bookings', authenticate, controller.listBookings);
router.get('/bookings/:bookingId', authenticate, controller.getBooking);
export default router;
