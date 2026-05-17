import express from 'express'
import { addKeyword, deleteKeyword, getKeyword, getKeywords, refreshKeyword, toggleAutoRefresh } from '../controllers/rank.controller.js'

const router = express.Router()

router.post('/add', addKeyword);
router.get('/list', getKeywords);
router.get('/:id', getKeyword);
router.put('/:id/toggle', toggleAutoRefresh);
router.post('/:id/refresh', refreshKeyword);
router.delete('/:id', deleteKeyword);

export default router