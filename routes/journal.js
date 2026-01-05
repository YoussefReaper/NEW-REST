const express = require('express');
const Journal = require('../models/Journal');
const router = express.Router();
const journalController = require('../controllers/journalController');
const authenticateToken = require('../middleware/authMiddleware');

/**
 * @swagger
 * /journals:
 *   post:
 *     summary: Create a new journal entry
 *     tags: [Journals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               mood:
 *                 type: string
 *                 enum: ['happy', 'sad', 'angry', 'neutral', 'excited', 'stressed']
 *     responses:
 *       201:
 *         description: Journal's info
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', authenticateToken, journalController.createJournal);

/**
 * @swagger
 * /journals:
 *   get:
 *     summary: Get all journal entries
 *     tags: [Journals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of journal entries
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', authenticateToken, journalController.getJournals);

/**
 * @swagger
 * /journals/{id}:
 *   delete:
 *     summary: Delete a journal entry
 *     tags: [Journals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the journal entry to delete
 *     responses:
 *       200:
 *         description: Journal deleted
 *       404:
 *         description: Journal not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticateToken, journalController.deleteJournal);

/**
 * @swagger
 * /journals/{id}:
 *   get:
 *     summary: Get a journal entry by ID
 *     tags: [Journals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the journal entry to retrieve
 *     responses:
 *       200:
 *         description: Journal's info
 *       404:
 *         description: Journal not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authenticateToken, journalController.getJournalById);

/**
 * @swagger
 * /journals/{id}:
 *   put:
 *     summary: Update a journal entry
 *     tags: [Journals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the journal entry to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               mood:
 *                 type: string
 *                 enum: ['happy', 'sad', 'angry', 'neutral', 'excited', 'stressed']
 *     responses:
 *       200:
 *         description: Journal's info
 *       404:
 *         description: Journal not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticateToken, journalController.updateJournal);

module.exports = router;