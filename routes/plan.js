const express = require('express');
const Plan = require('../models/Plan');
const router = express.Router();
const planController = require('../controllers/planController');
const authenticateToken = require('../middleware/authMiddleware');

/**
 * @swagger
 * /plans:
 *   post:
 *     summary: Create a new plan
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the plan
 *               description:
 *                 type: string
 *                 description: Detailed description of the plan
 *               deadline:
 *                 type: string
 *                 format: date
 *                 description: Deadline for the plan
 *               references:
 *                 type: object
 *                 properties:
 *                   links:
 *                     type: array
 *                     items:
 *                       type: string
 *                   books:
 *                     type: array
 *                     items:
 *                       type: string
 *     responses:
 *       201:
 *         description: Plan created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', authenticateToken, planController.createPlan);

/**
 * @swagger
 * /plans:
 *   get:
 *     summary: Get all plans for the authenticated user
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of plans retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   deadline:
 *                     type: string
 *                     format: date
 *                   milestones:
 *                     type: array
 *                   notes:
 *                     type: array
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', authenticateToken, planController.getPlans);

/**
 * @swagger
 * /plans/{id}:
 *   get:
 *     summary: Get a specific plan by ID
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the plan to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Plan retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 deadline:
 *                   type: string
 *                   format: date
 *                 milestones:
 *                   type: array
 *                 notes:
 *                   type: array
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Plan not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/:id', authenticateToken, planController.getPlanById);

/**
 * @swagger
 * /plans/{id}:
 *   put:
 *     summary: Update a plan by ID
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the plan to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the plan
 *               description:
 *                 type: string
 *                 description: Detailed description of the plan
 *               deadline:
 *                 type: string
 *                 format: date
 *                 description: Deadline for the plan
 *               references:
 *                 type: object
 *                 properties:
 *                   links:
 *                     type: array
 *                     items:
 *                       type: string
 *                   books:
 *                     type: array
 *                     items:
 *                       type: string
 *     responses:
 *       200:
 *         description: Plan updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Plan not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticateToken, planController.updatePlan);

/**
 * @swagger
 * /plans/{id}:
 *   delete:
 *     summary: Delete a plan by ID
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the plan to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Plan deleted successfully
 *       404:
 *         description: Plan not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticateToken, planController.deletePlan);

module.exports = router;
