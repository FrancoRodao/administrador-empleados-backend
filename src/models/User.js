const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const newUser = async function (userObj,db){
    try{
        const collection = db.collection('users')
        const insert = await collection.insertOne(userObj)
    }catch(e){
        throw e
    }
}

const login = async function(userObj,db){
    try{
        const collection = db.collection('users')
        const user = await collection.findOne({ email: userObj.email })

        if(user != null){
            const password = await compararContraseña(userObj.password,user.password)
            if(password){
                return user._id
            }
        }
        
        return null

    }catch(e){
        throw e
    }
}

const encriptarContraseña = async contrasena =>{
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(contrasena, salt)
}

const compararContraseña = async (contrasena, contrasena2) => {
    return await bcrypt.compare(contrasena,contrasena2)
}



const user= {};
user.newUser = newUser;
user.login = login;
user.encriptarContraseña = encriptarContraseña;
user.compararContraseña = compararContraseña;
module.exports = user;