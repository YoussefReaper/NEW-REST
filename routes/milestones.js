const express = require('express');
const Milestone = require('../models/Milestone');
const router = express.Router();
const milestoneController = require('../controllers/milestoneController');
const authenticateToken = require('../middleware/authMiddleware');

/**
 * @swagger
 * /milestones:
 *   post:
 *     summary: Create a new milestone
 *     tags: [Milestones]
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
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Milestone's info
 *       500:
 *         description: Server error
 */
router.post('/', authenticateToken, milestoneController.createMilestone);

/**
 * @swagger
 * /milestones:
 *   get:
 *     summary: Get all milestones
 *     tags: [Milestones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of milestones
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', authenticateToken, milestoneController.getMilestones);

/**
 * @swagger
 * /milestones/{id}:
 *   put:
 *     summary: Update a milestone by ID
 *     tags: [Milestones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the milestone to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Milestone's info
 *       404:
 *         description: Milestone not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticateToken, milestoneController.updateMilestone);

/**
 * @swagger
 * /milestones/{id}:
 *   delete:
 *     summary: Delete a milestone by ID
 *     tags: [Milestones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the milestone to delete
 *     responses:
 *       200:
 *         description: Milestone deleted
 *       404:
 *         description: Milestone not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticateToken, milestoneController.deleteMilestone);

module.exports = router;