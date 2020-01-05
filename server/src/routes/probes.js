import express from 'express';

import auth from '../middleware/auth';
import checkIsValidated from '../middleware/checkIsValidated';
import { getVisibleTargetIds, getEditableTargetIds } from './utils';

const PROBE_FIELDS = ['id', 'type', 'date', 'response', 'therapist', 'ownerId', 'targetId'];

const router = express.Router();

router.get('/', auth, checkIsValidated, async (req, res) => {
  try {
    const targetId = Number(req.query.targetId);
    const userId = Number(req.user.id);
    const { models: { Probe, Sheet, Target } } = req.context;

    const target = await Target.findOne({
      attributes: ['id'],
      where: { id: targetId },
      include: {
        model: Sheet,
        attributes: ['ownerId'],
      },
    });
    if (!target) {
      return res.status(404).send();
    }

    const allowedTargetIds = await getVisibleTargetIds(req);
    if (target.sheet.ownerId !== userId && !allowedTargetIds.includes(targetId)) {
      return res.status(403).send();
    }

    const probes = await Probe.findAll({
      attributes: PROBE_FIELDS,
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
    const userId = Number(req.user.id);
    const {
      type, date, response, therapist,
    } = req.body;
    const { models: { Probe, Sheet, Target } } = req.context;

    const target = await Target.findOne({
      attributes: ['id'],
      where: { id: targetId },
      include: {
        model: Sheet,
        attributes: ['ownerId'],
      },
    });
    if (!target) {
      return res.status(404).send();
    }

    const allowedTargetIds = await getEditableTargetIds(req);
    if (target.sheet.ownerId !== userId && !allowedTargetIds.includes(targetId)) {
      return res.status(403).send();
    }

    const probe = await Probe.create({
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
