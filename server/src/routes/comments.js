import express from 'express';

import auth from '../middleware/auth';
import checkIsValidated from '../middleware/checkIsValidated';
import { getVisibleProbeIds, getEditableProbeIds } from './utils';

const COMMENT_FIELDS = ['id', 'text', 'authorId', 'probeId'];

const router = express.Router();

router.get('/', auth, checkIsValidated, async (req, res) => {
  try {
    const probeId = Number(req.query.probeId);
    const { models: { Comment, Probe } } = req.context;

    const probe = await Probe.findOne({
      attributes: ['id'],
      where: { id: probeId },
    });
    if (!probe) {
      return res.status(404).send();
    }

    const allowedProbeIds = await getVisibleProbeIds(req);
    if (!allowedProbeIds.includes(probeId)) {
      return res.status(403).send();
    }

    const comments = await Comment.findAll({
      attributes: COMMENT_FIELDS,
      where: {
        probeId,
      },
    });

    return res.send(comments);
  } catch (err) {
    console.log('Error while getting comments:', err);
    return res.status(400).send(err);
  }
});

router.post('/', auth, checkIsValidated, async (req, res) => {
  try {
    const probeId = Number(req.body.probeId);
    const { text } = req.body;
    const { models: { Comment, Probe } } = req.context;

    const allowedProbeIds = await getEditableProbeIds(req);
    const probe = await Probe.findOne({
      attributes: ['id'],
      where: { id: probeId },
    });
    if (!probe) {
      return res.status(404).send();
    }
    if (!allowedProbeIds.includes(probeId)) {
      return res.status(403).send();
    }

    const comment = await Comment.create({
      text,
      ownerId: req.user.id,
      probeId,
    });

    return res.send(comment);
  } catch (err) {
    console.log('Error while creating comment:', err);
    return res.status(400).send(err);
  }
});

module.exports = router;
