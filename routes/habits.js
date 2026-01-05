const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const habitController = require('../controllers/habitController');

/**
 * @swagger
 * /habits:
 *   post:
 *     summary: Create a new habit
 *     description: Add a habit to the database
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [good, bad]
 *               habit:
 *                 type: string
 *     responses:
 *       201:
 *         description: Habit added
 *       400:
 *         description: Type and habit are required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/', authenticateToken, habitController.addHabit);

/**
 * @swagger
 * /habits:
 *   delete:
 *     summary: deletes a habit
 *     tags: [Habits]
 *     description: Remove a habit from the user's database
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [good, bad]
 *               habit:
 *                 type: string
 *     responses:
 *       200:
 *         description: Habit removed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Habit not found
 *       500:
 *         description: Server error
 */
router.delete('/', authenticateToken, habitController.removeHabit);

/**
 * @swagger
 * /habits:
 *   get:
 *     summary: Gets all the habits
 *     description: Gets the habits info from user's database depends on the type
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: list of the habits
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/', authenticateToken, habitController.getHabits);

module.exports = router;