const checkIfAdmin = (req, res, next) => {
  if (req.admin) {
    next();
  } else {
    res.status(401).json({
      error: "You are not authorized to access this resource",
    });
  }
};

const CheckIfUser = (req, res, next) => {
  if (!req.admin) {
    next();
  } else {
    res.status(401).json({
      error: "You are not authorized to access this resource",
    });
  }
};

module.exports = {
    checkIfAdmin,
    CheckIfUser
};
