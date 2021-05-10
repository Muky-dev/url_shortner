import express from 'express';
import * as controller from '../controller/controller.js';

const router = express.Router();

router.post('/api/shorturl', controller.postUrl);
router.get('/api/shorturl/:short_url', controller.getUrl);

export default router