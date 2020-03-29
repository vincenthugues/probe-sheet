import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

export const hashPassword = async (password) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

export const getSignedToken = userId => jwt.sign(
  { id: userId },
  process.env.JWT_SECRET,
  { expiresIn: 24 * 3600 },
);

export const getVisibleSheetIds = async ({ context, user }) => {
  const { models: { AccessRight } } = context;

  const accessRights = await AccessRight.findAll({
    attributes: ['sheetId'],
    where: {
      email: user.email,
    },
    raw: true,
  });
  const visibleSheetIds = accessRights.map(({ sheetId }) => sheetId);

  return visibleSheetIds;
};

export const getEditableSheetIds = async ({ context, user }) => {
  const { models: { AccessRight } } = context;

  const accessRights = await AccessRight.findAll({
    attributes: ['sheetId'],
    where: {
      email: user.email,
      role: 'contributor',
    },
    raw: true,
  });
  const editableSheetIds = accessRights.map(({ sheetId }) => sheetId);

  return editableSheetIds;
};

export const getVisibleTargetIds = async ({ context, user }) => {
  const userId = user.id;
  const { models: { Sheet, Target } } = context;

  const visibleSheetIds = await getVisibleSheetIds({ context, user });
  const visibleTargets = await Target.findAll({
    attributes: ['id'],
    where: {
      [Op.or]: [
        { ownerId: userId },
        { sheetId: visibleSheetIds },
        { '$sheet.ownerId$': userId },
      ],
    },
    include: {
      model: Sheet,
      attributes: ['ownerId'],
    },
    raw: true,
  });
  const visibleTargetIds = visibleTargets.map(({ id }) => id);

  return visibleTargetIds;
};

export const getEditableTargetIds = async ({ context, user }) => {
  const { models: { Target } } = context;

  const editableSheetIds = await getEditableSheetIds({ context, user });
  const editableTargets = await Target.findAll({
    attributes: ['id'],
    where: {
      [Op.or]: [
        { ownerId: user.id },
        { sheetId: editableSheetIds },
      ],
    },
    raw: true,
  });
  const editableTargetIds = editableTargets.map(({ id }) => id);

  return editableTargetIds;
};

export const getVisibleProbeIds = async ({ context, user }) => {
  const { models: { Probe } } = context;

  const visibleTargetIds = await getVisibleTargetIds({ context, user });
  const visibleProbes = await Probe.findAll({
    attributes: ['id'],
    where: {
      [Op.or]: [
        { ownerId: user.id },
        { targetId: visibleTargetIds },
      ],
    },
    raw: true,
  });
  const visibleProbeIds = visibleProbes.map(({ id }) => id);

  return visibleProbeIds;
};

export const getEditableProbeIds = async ({ context, user }) => {
  const { models: { Probe } } = context;

  const editableTargetIds = await getEditableTargetIds({ context, user });
  const editableProbes = await Probe.findAll({
    attributes: ['id'],
    where: {
      [Op.or]: [
        { ownerId: user.id },
        { targetId: editableTargetIds },
      ],
    },
    raw: true,
  });
  const editableProbeIds = editableProbes.map(({ id }) => id);

  return editableProbeIds;
};
