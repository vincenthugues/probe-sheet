import express from 'express';

import auth from '../middleware/auth';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const probes = await req.context.models.Probe.findAll({
    where: {
      ownerId: req.user.id,
    },
  });
  return res.send(probes);
});

router.post('/', auth, async (req, res) => {
  try {
    const probe = await req.context.models.Probe.create({
      type: req.body.type,
      date: req.body.date,
      response: req.body.response,
      therapist: req.body.therapist,
      ownerId: req.user.id,
      targetId: req.body.targetId,
    });

    return res.send(probe);
  } catch (err) {
    console.log('Error while creating probe:', err);
    return res.send(err);
  }
});

router.get('/:probeId', auth, async (req, res) => {
  const probe = await req.context.models.Probe.findOne({
    where: {
      id: req.params.probeId,
      ownerId: req.user.id,
    },
  });
  return res.send(probe);
});

module.exports = router;
