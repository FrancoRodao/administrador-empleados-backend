const jwt = require('jsonwebtoken')


const verifiyToken = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send({
            ok: false,
            message: "No esta autorizado para ingresar"
        })
    }

    //Bearer token
    const token = req.headers.authorization.split(' ')[1]

    jwt.verify(token, process.env.SECRET_KEY, {}, (err, payload)=>{
        if(err){
            return res.status(401).send({
                ok: false,
                message: "No esta autorizado para ingresar."
            })
        }
        next()

    })
}



module.exports = verifiyToken