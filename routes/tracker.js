const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const trackerController = require('../controllers/trackerController');

/**
 * @swagger
 * /tracker:
 *   post:
 *     summary: Log a new entry
 *     tags: [Tracker]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *               trackedHours:
 *                 type: number
 *               completedTasksCount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Entry created
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', authenticateToken, trackerController.logEntry);

/**
 * @swagger
 * /tracker:
 *   get:
 *     summary: Get all tracking entries
 *     tags: [Tracker]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tracking entries
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', authenticateToken, trackerController.getTracker);

module.exports = router;