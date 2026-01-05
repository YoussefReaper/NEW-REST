const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');
const {uploadProfile, uploadBackground, uploadBanner} = require('../middleware/upload')

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/profile', authenticateToken, userController.getProfile);

/**
 * @swagger
 * /user/customization:
 *   patch:
 *     summary: Update user customization settings
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               theme:
 *                 type: string
 *               notifications:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Customization updated
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.patch('/profile', authenticateToken, uploadProfile.fields([
    { name: 'profilePicture', maxCount: 1},
    { name: 'aiProfilePicture', maxCount: 1}
]), userController.updateProfile);
router.patch('/subscription', authenticateToken, userController.updateSubscription);
router.patch('/customization/colors', authenticateToken, userController.updateColors);
router.patch('/customization/theme', authenticateToken, userController.updateTheme);
router.patch('/customization/topbar-theme', authenticateToken, userController.updateTopbarTheme);
router.patch('/customization/profile-appearance', authenticateToken, uploadBanner.single('banner'), userController.updateProfileAppearance);
router.patch('/customization/ai-profile-appearance', authenticateToken, uploadBanner.single('aiBanner'), userController.updateAiProfileAppearance);
router.patch('/customization/profile-tags', authenticateToken, userController.updateProfileTags);
router.patch('/customization/backgrounds', authenticateToken, uploadBackground.fields([
    {name: 'backgrounds_desktop', maxCount: 1},
    {name: 'backgrounds_mobile', maxCount: 1},
    {name: 'chat_background', maxCount: 1},
    {name: 'tracker_desktop_main', maxCount: 1},
    {name: 'tracker_desktop_pause', maxCount: 1},
    {name: 'tracker_mobile_main', maxCount: 1},
    {name: 'tracker_mobile_pause', maxCount: 1}
]), userController.updateBackgrounds);

router.get('/customization', authenticateToken, userController.getCustomizations);

module.exports = router;