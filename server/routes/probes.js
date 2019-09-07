import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  const probes = await req.context.models.Probe.findAll();
  return res.send(probes);
});

router.post('/', async (req, res) => {
  try {
    const probe = await req.context.models.Probe.create({
      type: req.body.type,
      date: req.body.date,
      response: req.body.response,
      therapist: req.body.therapist,
      ownerId: req.context.user.id,
      targetId: req.body.targetId,
    });

    return res.send(probe);
  } catch (err) {
    console.log('Error while creating probe:', err);
    return res.send(err);
  }
});

router.get('/:probeId', async (req, res) => {
  const probe = await req.context.models.Probe.findByPk(req.params.probeId);
  return res.send(probe);
});

module.exports = router;
