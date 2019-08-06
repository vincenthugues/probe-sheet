import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
    const comments = await req.context.models.Comment.findAll();
    return res.send(comments);
});

router.post('/', async (req, res) => {
    const comment = await req.context.models.Comment.create({
        text: req.body.text,
        authorId: req.context.user.id,
        probeId: req.body.probeId,
    });

    res.send(comment);
});

module.exports = router;
