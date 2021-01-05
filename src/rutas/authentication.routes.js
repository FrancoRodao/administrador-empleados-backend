const express = require('express')
const router = express.Router()
const dataBase = require('../database')
const generateTokens = require('../helpers/generateTokens')
const users = require('../models/User')
const jwt = require('jsonwebtoken')
const { ObjectId } = require('mongodb')

router.post('/signup', async (req, res) => {
    try {
        const user = req.body
        user.password = await users.encriptarContraseña(user.password)
        const newUser = await users.newUser(user, dataBase.db)
        res.status(200).json({
            ok: true,
            message: 'Registrado correctamente'
        })

    } catch (e) {
        console.log("ERRR".blue, e)
        res.status(500).json({
            ok: false,
            message: 'Ocurrio un error inesperado'
        })
    }

})


router.post('/signin', async (req, res) => {
    try {
        const user = req.body
        const _id = await users.login(user, dataBase.db)
        if (_id) {
            const [token, refreshToken] = await generateTokens({ _id })

            // non-obvious name for added security app_r_t=app_refresh_token
            return res.cookie('app_r_t', refreshToken, {
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production" ? true:false,
                maxAge: 24 * 60 * 60 * 7 // 7 days
            }).status(200).json({
                ok: true,
                message: 'Iniciaste sesion correctamente',
                token
            })
        }

        return res.status(401).json({
            ok: false,
            message: 'Usuario invalido'
        })


    } catch (e) {
        console.log("OCURRIO UN ERROR AL LOGEARSE".red, e)
        return res.status(401).send({
            ok: false,
            message: 'Ocurrio un error inesperado'
        })
    }

})

router.post('/logout', (req,res)=>{
    try{
        return res.clearCookie('app_r_t').status(200).json({
            ok: true,
            message: 'Sesion cerrada'
        })
    }catch(e){
        return res.status(500).send({
            ok: false,
            message: 'Ocurrio un error inesperado'
        })
    }
})

router.get('/refreshToken', (req, res) => {
    if (!req.cookies.app_r_t) {
        return res.status(401).send({
            ok: false,
            message: "No esta autorizado para ingresar"
        })
    }

    const oldRefreshToken = req.cookies.app_r_t
    //verify refresh token
    jwt.verify(oldRefreshToken, process.env.SECRET_KEY, {}, async (err, payload) => {
        if (err) {
            return res.status(401).send({
                
                ok: false,
                message: "No esta autorizado para ingresar"
            })
        }

        if (payload) {

            //give a new refresh token and access token
            const _id = payload._id
            const [token, refreshToken] = await generateTokens({ _id })
            return res.cookie('app_r_t', refreshToken, {
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production" ? true:false,
                maxAge: 24 * 60 * 60 * 7 // 7 days
            }).status(200).json({
                ok: true,
                token
            })
        }
    })
})

router.post('/test', async (req, res) => {
    const collection = dataBase.db.collection('users')
    const validUser = await collection.findOne({ _id: ObjectId('5ed71bc2e9d84a2134ce74be') })
    validUser.
        console.log(validUser)
    return res.json({
        ok: true
    })
})


module.exports = router