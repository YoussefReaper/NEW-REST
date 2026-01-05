const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const memoryController = require('../controllers/memoryController');

/**
 * @swagger
 * /memories:
 *   post:
 *     summary: Upsert a memory
 *     tags: [Memories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *               value:
 *                 type: string
 *     responses:
 *       200:
 *         description: Memory saved
 *       400:
 *         description: key required
 *       500:
 *         description: Server error
 */
router.post('/', authenticateToken, memoryController.upsertMemory);

/**
 * @swagger
 * /memories:
 *   get:
 *     summary: Get all memories
 *     tags: [Memories]
 *     responses:
 *       200:
 *         description: List of memories
 *       500:
 *         description: Server error
 */
router.get('/', authenticateToken, memoryController.getAllMemories);

/**
 * @swagger
 * /memories/{key}:
 *   delete:
 *     summary: Delete a memory
 *     tags: [Memories]
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         description: The key of the memory to delete
 *     responses:
 *       200:
 *         description: Memory deleted
 *       404:
 *         description: Memory not found
 *       500:
 *         description: Server error
 */
router.delete('/:key', authenticateToken, memoryController.deleteMemory);

module.exports = router;