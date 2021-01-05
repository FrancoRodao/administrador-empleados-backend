const express = require('express')
const router = express.Router()
const employee = require('../models/Employee')
const verificarToken = require('../middlewares/verifyToken')


router.post('/addEmployee', verificarToken, async (req,res,next)=>{
    try{
        const obj = await req.body
        const addEmployee = await employee.addEmployee(obj)
        return res.status(200).json(addEmployee.insertedId)
        
    }catch(e){
        res.status(400).send({ error: "ERROR"})
    }
})

router.delete('/deleteEmployee/:id', verificarToken, async (req,res,next)=>{
    try{
        const _id = req.params.id
        const deleteEmployee = await employee.deleteEmployee(_id)
        res.status(200).send({status: 'OK'})
        next()
        
    }catch(e){
        res.status(400).send({ error: "ERROR"})
    }
})

router.put('/editEmployee', verificarToken, async (req,res,next)=>{
    try{
        const obj = {
            _id: req.body._id,
            name: req.body.name,
            lastname: req.body.lastname,
            phone: req.body.phone,
            email: req.body.email
        }

        const editEmployee = await employee.editEmployee(obj)
        res.status(200).send({status: 'OK'})
        
    }catch(e){
        res.status(400).send({status: "400"})
    }
})

router.get('/getEmployees', verificarToken, async (req,res)=>{
    try{
        const getEmployees = await employee.getEmployees()
        res.status(200).send(getEmployees)

    }catch(e){
        console.log("ERRR".blue,e)
        res.sendStatus(401).send({status: "401"})
    }

})

router.get('/getEmployee/:id', verificarToken, async (req,res)=>{
    try{
        const _id = req.params.id
        const getEmployee = await employee.getEmployee(_id)
        res.status(200).json(getEmployee)

    }catch(e){
        console.log("ERRR".blue,e)
        res.sendStatus(401).send({status: "401"})
    }

})

module.exports = router
