const express = require('express');
const router = express.Router();
const {
  createPaste,
  getAllPastes,
  getPasteById,
  updatePaste,
  deletePaste,
  toggleFavorite,
  getPublicPastes,
} = require('../controllers/pasteController');
const { protect, optionalAuth } = require('../middleware/auth');

router.get('/public', getPublicPastes);
router.get('/:id', optionalAuth, getPasteById);

router.use(protect);
router.get('/', getAllPastes);
router.post('/', createPaste);
router.put('/:id', updatePaste);
router.delete('/:id', deletePaste);
router.patch('/:id/favorite', toggleFavorite);

module.exports = router;
