const mongoId = require('mongodb').ObjectID
const dataBase = require('../database')

const fs = require('fs')
const util = require('util');


const uploadImage = async (idEmployee, path)=>{
    const deleteFile = util.promisify(fs.unlink);
    try{
        const collection = dataBase.dbCollectionEmployees
        if(idEmployee){
            const employee = await collection.findOne({_id: mongoId(idEmployee)})
            if(employee.imagePath){
                const deleteImage = await deleteFile(employee.imagePath)
                const employeeModify = await collection.updateOne(employee, { $set: { imagePath: path }})
            }else{
                const employeeModify = await collection.updateOne(employee, { $set: { imagePath: path }})
            }
        }else{
            throw new Error("no existe la id")
        }

    }catch(e){
        if(path){
            const remove = await deleteFile(path)
        }
        throw e
    }
}

const getImage = async (idEmployee) => {
    const collection = dataBase.dbCollectionEmployees
    const employee = await collection.findOne({_id: mongoId(idEmployee)})

    if(employee.imagePath){
        return employee.imagePath
    }else{
        const imageDefault = '../../uploads/images/no-image.svg'
        return imageDefault
    }    
}

const deleteImage = async (idEmployee) => {
    const deleteFile = util.promisify(fs.unlink);
    const collection = dataBase.dbCollectionEmployees
    const employee = await collection.findOne({_id: mongoId(idEmployee)})
    if(employee.imagePath){
        const remove = await deleteFile(employee.imagePath)
    }
}

const imageController = {}
imageController.uploadImage = uploadImage
imageController.getImage = getImage
imageController.deleteImage = deleteImage
module.exports = imageController



