import express from 'express';
import { UpdateMetadataSchema } from '../../types/index.js';
import db from '@repo/db';
import { userMiddleware } from '../../middlewares/user.js';

const router = express.Router();

router.post("/avatar", userMiddleware, async (req, res) => {
  try {
    const { avatarKey } = req.body;

    await db.user.update({
      where: { id: req.user.userId },
      data: { avatarKey }
    });

    res.json({ success: true });
  } catch (err) {
    console.error("AVATAR UPDATE ERROR:", err);
    res.status(500).json({ message: "Failed to update avatar" });
  }
});


export default router;
