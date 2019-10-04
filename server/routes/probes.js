import express from 'express';
import { Op } from 'sequelize';

import auth from '../middleware/auth';
import { getAllowedTargetIds } from './utils';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { query: { targetId: queryTargetId } } = req;
    const allowedTargetIds = await getAllowedTargetIds(req);
    const probes = await req.context.models.Probe.findAll({
      where: {
        [Op.or]: [
          { ownerId: req.user.id },
          { targetId: { [Op.in]: allowedTargetIds } },
        ],
        ...queryTargetId ? { targetId: queryTargetId } : {},
      },
    });

    return res.send(probes);
  } catch (err) {
    console.log('Error while getting probes:', err);
    return res.status(400).send(err);
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const probe = await req.context.models.Probe.create({
      type: req.body.type,
      date: req.body.date,
      response: req.body.response,
      therapist: req.body.therapist,
      ownerId: req.user.id,
      // TODO: check target belongs to user or user is allowed on target's sheet
      targetId: req.body.targetId,
    });

    return res.send(probe);
  } catch (err) {
    console.log('Error while creating probe:', err);
    return res.status(400).send(err);
  }
});

router.get('/:probeId', auth, async (req, res) => {
  try {
    const allowedTargetIds = await getAllowedTargetIds(req);
    const probe = await req.context.models.Probe.findOne({
      where: {
        id: req.params.probeId,
        [Op.or]: [
          { ownerId: req.user.id },
          { targetId: { [Op.in]: allowedTargetIds } },
        ],
      },
    });

    return res.send(probe);
  } catch (err) {
    console.log('Error while getting probe:', err);
    return res.status(400).send(err);
  }
});

module.exports = router;
