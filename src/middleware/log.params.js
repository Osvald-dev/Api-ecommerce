export default function logParams(req, res, next) {
    console.log(req.params);
    next();
  }

