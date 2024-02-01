const jwb = require('jsonwebtoken')
module.exports = async (payload)=>{

    const token = await jwb.sign(
        payload,
        process.env.SEC_KEY,
        {expiresIn : "1h"}
    )
    return token;
 
}