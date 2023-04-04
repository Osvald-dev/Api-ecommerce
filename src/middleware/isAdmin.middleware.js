import ROLE_CFG from "../config/roles.config.js";

 function isAdmin (req, res, next){

  
  const password = req.body.password;

  if ( password === ROLE_CFG.ADMIN_PASS) {
    next();
  } else {
    res.status(401).json({ message: 'No tienes acceso a esta página.' });
  }
}

export default isAdmin;

