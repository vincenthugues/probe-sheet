import express from 'express';

import auth from '../middleware/auth';
import checkIsValidated from '../middleware/checkIsValidated';
import { getVisibleTargetIds, getEditableTargetIds } from './utils';

const router = express.Router();

router.get('/', auth, checkIsValidated, async (req, res) => {
  try {
    const targetId = Number(req.query.targetId);
    const allowedTargetIds = await getVisibleTargetIds(req);
    const target = await req.context.models.Target.findOne({
      where: { id: targetId },
    });
    if (!target) {
      return res.status(404).send();
    }
    if (!allowedTargetIds.includes(targetId)) {
      return res.status(403).send();
    }

    const probes = await req.context.models.Probe.findAll({
      where: {
        targetId,
      },
    });

    return res.send(probes);
  } catch (err) {
    console.log('Error while getting probes:', err);
    return res.status(400).send(err);
  }
});

router.post('/', auth, checkIsValidated, async (req, res) => {
  try {
    const targetId = Number(req.body.targetId);
    const {
      type, date, response, therapist,
    } = req.body;

    const allowedTargetIds = await getEditableTargetIds(req);
    const target = await req.context.models.Target.findOne({
      where: { id: targetId },
    });
    if (!target) {
      return res.status(404).send();
    }
    if (!allowedTargetIds.includes(targetId)) {
      return res.status(403).send();
    }

    const probe = await req.context.models.Probe.create({
      type,
      date,
      response,
      therapist,
      ownerId: req.user.id,
      targetId,
    });

    return res.send(probe);
  } catch (err) {
    console.log('Error while creating probe:', err);
    return res.status(400).send(err);
  }
});

module.exports = router;
