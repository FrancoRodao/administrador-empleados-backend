const MongoClient = require("mongodb").MongoClient;
const colors = require("colors");


// Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useUnifiedTopology: true });
const dbName = "ade";


client.connect(async function (err) {
  if(err){
    console.log("OCURRIO UN ERROR AL CONECTARSE A LA BASE DE DATOS:".red,err)
    process.exit(0)
  }

  try {
    console.log("CONEXION A LA BASE DE DATOS EXITOSA".green);
    const db = client.db(dbName);

    await db.createCollection('refreshsTokens', {
      
    })

    const collectionUsers = await db.createCollection(
      "users",
      {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            maxProperties: 5,
            required: ["name", "phone","email","password"],
            properties: {
              name: {
                bsonType: "string",
                description: "Nombre",
              },
              phone: {
                bsonType: "string",
                description: "Telefono",
              },
              email:{
                minLength: 5,
                pattern: "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$",
                bsonType: "string"
              },
              password: {
                minLength: 5,
                bsonType: "string"
                
              },
              imagePath:{
                bsonType: "string"
              }
            },
          },
        }  
      }
    )
    collectionUsers.createIndex({ "email": 1 }, { unique: true });
  
    const collectionEmployees = await db.createCollection(
      "employees",
      {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            maxProperties: 7,
            required: ["name", "lastname", "email"],
            properties: {
              name: {
                bsonType: "string",
                description: "Nombre",
              },
              lastname: {
                bsonType: "string"
              },
              phone: {
                bsonType: "string",
                description: "Telefono",
              },
              email:{
                bsonType: "string"
              },
              imagePath:{
                bsonType: "string"
              }
            },
          },
        }  
      }
    )
    collectionEmployees.createIndex({ "name": 1 }, { unique: true })
    collectionEmployees.createIndex({ "email": 1 }, { unique: true });
  }
  catch (error) {
    console.log("OCURRIO UN ERROR AL CREAR LAS COLECCIONES".red,error)
    process.exit(0)
  }
});

//EXPORTS
const dataBase = {};
dataBase.db = client.db(dbName)
dataBase.dbCollectionEmployees = dataBase.db.collection('employees')
module.exports = dataBase