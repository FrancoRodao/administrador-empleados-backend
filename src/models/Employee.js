const mongoId = require('mongodb').ObjectID
const dataBase = require('../database')
const imageController = require('../controllers/image.controller')

class badRequest extends Error {
  constructor(message) {
      super();
      this.message = message;
      this.errorCode = 500;
  }
}

const addEmployee = async function (myobj) {
  try {
    const collection = dataBase.dbCollectionEmployees

    const insert = await collection.insertOne(myobj)
    const id = insert.ops[0]._id;

    var date = new Date();
    const dateFormat = `Fecha: ${date.getUTCDate()}/${date.getUTCMonth()}/${date.getUTCFullYear()} Hora: ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()} UTC`;
    collection.findOneAndUpdate(
      { _id: id },
      { $set: { created_At: dateFormat } }
      );
    return insert
  } catch (error) {
      console.log("OCURRIO UN ERRO AL INSERTAR EL USUARIO".red, error);
      throw error
  }
};

const deleteEmployee = async function (id) {
  try {
    const collection = dataBase.dbCollectionEmployees

    //delete image employee
    imageController.deleteImage(id)
    const deletedEmployee = await collection.deleteOne({_id: mongoId(id)})
    
    if(deletedEmployee.deletedCount == 0){
      throw new badRequest("No existe el empleado")
    }

  } catch (error) {
      if(error instanceof badRequest){
        console.log("OCURRIO UN ERROR AL BORRAR EL EMPLEADO".red, "No existe el empleado")
        throw(error);
      }else{
        console.log("OCURRIO UN ERRO AL BORRAR EL EMPLEADO".red, error);
        throw error
      }

  }
};


const editEmployee = async function (obj) {
  try {
    const collection = dataBase.dbCollectionEmployees

    const _id = obj._id
    const name = obj.name
    const lastname = obj.lastname
    const phone = obj.phone
    const email = obj.email
    const editEmployee = await collection.findOneAndUpdate({_id: mongoId(_id)}, {$set: {name, lastname, phone, email}})

    if(editEmployee.lastErrorObject.updatedExisting == false){
      throw new badRequest("No existe el empleado")
    }
    
    } catch (error) {
        if(error instanceof badRequest){
          console.log("OCURRIO UN ERROR AL EDITAR EL EMPLEADO".red, "No existe el empleado")
          throw error
        }else{
          console.log("OCURRIO UN ERROR AL EDITAR EL EMPLEADO".red, error)
          throw error
    }
  }
};

const getEmployees = async function(){
  try{
    const collection = dataBase.dbCollectionEmployees

    return await collection.find({}).toArray()


  }catch(error){
    console.log("OCURRIO UN ERRO AL INSERTAR EL USUARIO".red, error);
    throw error
  }
}

const getEmployee = async function(id){
  try{
    const collection = dataBase.dbCollectionEmployees
    return await collection.findOne({_id: mongoId(id)})


  }catch(error){
    console.log("OCURRIO UN ERROR AL INSERTAR EL USUARIO".red, error);
    throw error
  }
}


const employee = {};
employee.addEmployee = addEmployee;
employee.deleteEmployee = deleteEmployee;
employee.editEmployee = editEmployee;
employee.getEmployees = getEmployees;
employee.getEmployee = getEmployee;
module.exports = employee;
