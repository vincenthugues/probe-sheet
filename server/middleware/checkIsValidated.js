export default (req, res, next) => {
  if (!req.user || !req.user.isValidated) {
    return res.status(401).json({ msg: 'User is not validated' });
  }

  return next();
};
