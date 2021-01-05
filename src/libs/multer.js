const multer = require('multer')
const { v4: uuid } = require('uuid');
const path = require('path')

const storage = multer.diskStorage({
    destination: 'uploads/images',
    filename: (req,file,callback)=>{
        callback(null, uuid()+path.extname(file.originalname))
    }
})

module.exports = multer({storage,limits: {fieldSize: 2000000}})