import express from 'express'
import { addKeyword, deleteKeyword, getKeyword, getKeywords, refreshKeyword, toggleAutoRefresh } from '../controllers/rank.controller.js'
import { auth } from '../middlewares/auth.middleware.js';

const router = express.Router()

router.post('/add', auth, addKeyword);
router.get('/list', auth, getKeywords);
router.get('/:id', auth, getKeyword);
router.put('/:id/toggle', auth, toggleAutoRefresh);
router.post('/:id/refresh', auth, refreshKeyword);
router.delete('/:id', auth, deleteKeyword);

export default router