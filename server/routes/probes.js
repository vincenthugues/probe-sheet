import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  const probes = await req.context.models.Probe.findAll();
  return res.send(probes);
});

router.post('/', async (req, res) => {
  const probe = await req.context.models.Probe.create({
    date: req.body.date,
    type: req.body.type,
    response: req.body.response,
    therapistId: req.context.user.id,
    targetId: req.body.targetId,
  });

  return res.send(probe);
});

module.exports = router;
