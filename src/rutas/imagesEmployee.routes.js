const express = require('express')
const router = express.Router()
const multer = require('../libs/multer')
const imagesController = require("../controllers/image.controller")
const verificarToken = require('../middlewares/verifyToken')


router.get('/images/:id', verificarToken, async(req,res)=>{
    try{
        const id = req.params.id
        const getImage = await imagesController.getImage(id)
        res.status(200).send({imagePath: getImage})

    }catch(e){

        res.status(400).json({"error":"ocurrio un error"})
    }
})

router.post('/images', verificarToken, multer.single('image'), async(req,res)=>{
    try{
        const id = req.body.id
        const path = req.file.path
        const uploadImage = await imagesController.uploadImage(id, path)

        res.status(200).send({status: 'OK'})
        
    }catch(e){
        res.status(400).json({"error":"ocurrio un error"})
    }
})

router.delete('/images/:id', verificarToken, async(req,res)=>{
    try{
        const id = req.params.id
        const deleteImage = await imagesController.deleteImage(id)
        console.log(deleteImage)
        res.status(200).send({status: 'OK'})

    }catch(e){
        res.status(400).json({"error":"ocurrio un error"})
    }
})


module.exports = router