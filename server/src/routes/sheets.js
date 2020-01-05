import express from 'express';
import { Op } from 'sequelize';

import auth from '../middleware/auth';
import checkIsValidated from '../middleware/checkIsValidated';
import { getVisibleSheetIds } from './utils';

const SHEET_FIELDS = ['id', 'student', 'skillDomain', 'ownerId', 'createdAt', 'updatedAt'];

const router = express.Router();

router.get('/', auth, checkIsValidated, async (req, res) => {
  try {
    const { models: { Sheet } } = req.context;

    const allowedSheetIds = await getVisibleSheetIds(req);
    const sheets = await Sheet.findAll({
      attributes: SHEET_FIELDS,
      where: {
        [Op.or]: [
          { ownerId: req.user.id },
          { id: { [Op.in]: allowedSheetIds } },
        ],
      },
    });

    return res.send(sheets);
  } catch (err) {
    console.log('Error while getting sheets:', err);
    return res.status(400).send(err);
  }
});

router.post('/', auth, checkIsValidated, async (req, res) => {
  try {
    const { student, skillDomain } = req.body;
    const { models: { Sheet } } = req.context;

    const sheet = await Sheet.create({
      student,
      skillDomain,
      ownerId: req.user.id,
    });

    return res.send(sheet);
  } catch (err) {
    console.log('Error while creating sheet:', err);
    return res.status(400).send(err);
  }
});

router.get('/:sheetId', auth, checkIsValidated, async (req, res) => {
  try {
    const sheetId = Number(req.params.sheetId);
    const { models: { Sheet } } = req.context;

    const allowedSheetIds = await getVisibleSheetIds(req);
    const sheet = await Sheet.findOne({
      attributes: SHEET_FIELDS,
      where: {
        id: sheetId,
      },
    });
    if (!sheet) {
      return res.status(404).send();
    }
    if (sheet.ownerId !== req.user.id && !allowedSheetIds.includes(sheetId)) {
      return res.status(403).send();
    }

    return res.send(sheet);
  } catch (err) {
    console.log('Error while getting sheet:', err);
    return res.status(400).send(err);
  }
});

// router.delete('/:sheetId', auth, checkIsValidated, async (req, res) => {
//   try {
//     const { models: { Sheet } } = req.context;
//
//     await Sheet.destroy({
//       where: {
//         id: req.params.sheetId,
//         ownerId: req.user.id,
//         deletedAt: null,
//       },
//     });
//
//     return res.send(true);
//   } catch (err) {
//     console.log('Error while deletting sheet:', err);
//     return res.status(400).send(err);
//   }
// });

router.get('/:sheetId/access-rights', auth, checkIsValidated, async (req, res) => {
  try {
    const { sheetId } = req.params;
    const { models: { AccessRight } } = req.context;

    const accessRights = await AccessRight.findAll({
      attributes: ['email', 'role'],
      where: {
        sheetId,
      },
      // include: [{
      //   model: User,
      //   attributes: ['id', 'email', 'username'],
      // }],
    });
    const sheetUserRights = accessRights.map(
      ({ dataValues }) => (dataValues),
    );

    return res.send(sheetUserRights);
  } catch (err) {
    console.log('Error while getting sheet access rights:', err);
    return res.status(400).send(err);
  }
});

router.post('/:sheetId/access-rights', auth, checkIsValidated, async (req, res) => {
  try {
    const sheetId = Number(req.params.sheetId);
    const { email, role } = req.body;
    const userId = Number(req.user.id);
    const { models: { AccessRight, Sheet } } = req.context;

    const sheet = await Sheet.findOne({
      attributes: ['ownerId'],
      where: {
        id: sheetId,
      },
    });
    if (!sheet) {
      return res.status(404).send();
    }
    if (sheet.ownerId !== userId) {
      return res.status(403).send();
    }

    const accessRight = await AccessRight.create({
      sheetId,
      email,
      role,
    }, {
      returning: ['email', 'role'],
    });

    return res.send(accessRight);
  } catch (err) {
    console.log('Error while creating sheet access right:', err);
    return res.status(400).send(err);
  }
});

module.exports = router;
