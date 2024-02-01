const jwt = require('jsonwebtoken');
const httpStatusText = require('../utils/httpStatusText')
const appError = require('../utils/appError')



const verifyToken = (req, res, next) =>{
    const fullToken = req.headers.authorization
    if(!fullToken){
        const error = appError.create('Token is required',401, httpStatusText.error)
        return next(error);
    }
    const token = fullToken.split(' ')[1];
    try {
        const user = jwt.verify(token, process.env.SEC_KEY)
        req.user = user;
        next();
    } catch (err) {
        const error = appError.create('Invalid Token',401, httpStatusText.error);
        return next(error);
    }

}
module.exports = verifyToken
