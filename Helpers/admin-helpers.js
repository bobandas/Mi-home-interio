var db = require("../config/connection")
var collection = require("../config/collections");


const ObjectId = require("mongodb").ObjectId





module.exports={
    addEmployee=(employee)=>{
        return new Promise((resolve,reject)=>{
           let addemployee= db.get().collection(collection.EMPLOYEE_COLLECTION).insertone(employee)
           resolve(addemployee)
        })

    
    }






    
}