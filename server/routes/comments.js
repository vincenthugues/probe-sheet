import express from 'express';
import { Op } from 'sequelize';

import auth from '../middleware/auth';
import { getAllowedProbeIds } from './utils';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const allowedProbeIds = await getAllowedProbeIds(req);
    const comments = await req.context.models.Comment.findAll({
      where: {
        [Op.or]: [
          { ownerId: req.user.id },
          { probeId: { [Op.in]: allowedProbeIds } },
        ],
      },
    });
    return res.send(comments);
  } catch (err) {
    console.log('Error while getting comments:', err);
    return res.status(400).send(err);
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const comment = await req.context.models.Comment.create({
      text: req.body.text,
      ownerId: req.user.id,
      // TODO: check probe belongs to user or user is allowed on probe target's sheet
      probeId: req.body.probeId,
    });

    return res.send(comment);
  } catch (err) {
    console.log('Error while creating comment:', err);
    return res.status(400).send(err);
  }
});

module.exports = router;
