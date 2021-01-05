const jwt = require('jsonwebtoken')

const generateTokens = (payload)=>{
    const accessToken = new Promise((resolve, reject)=>{
        jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: "15s"}, (err, token)=>{
            if(err){
                reject(err)
            }
    
            resolve(token)
        })
    })

    const refreshToken = new Promise((resolve, reject)=>{
        jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: "7d"}, (err, token)=>{
            if(err){
                reject(err)
            }
    
            resolve(token)
        })
    })

    return Promise.all([accessToken, refreshToken])

}

module.exports = generateTokens