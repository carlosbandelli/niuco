const { json } = require("body-parser")
const express = require("express")
const app = express()
const DB = require("./config/db.json")

app.use(express.urlencoded({extended: false}))
app.use(express.json())


const NDB = DB.users

function unixToDate(valor){
    let time = new Date(valor.last_activity * 1000),
    month = time.getMonth() + 1,
    day = time.getDate(),
    year = time.getFullYear(),
    res = year + '/' + month + '/' + day;
    
    return res;    
    }

function emailMask(valor) {
    let maskedEmail = valor.email.split('@');   
    
    let niuco = maskedEmail[1]    
    if (niuco == "niuco.com.br"){           
            maskedEmail = maskedEmail.join('@')
              
            return maskedEmail 
      
        }else{
            maskedEmail =  valor.email.replace(/([^@\.])/g, "*").split('');
            console.table(maskedEmail) 
            var previous = "";
            for(i=0;i<maskedEmail.length;i++){
                if (i<=1 || previous == "." || previous == "@"){
                    
                    maskedEmail[i] =  valor.email[i];
                    console.log(maskedEmail)
                }
                previous =  valor.email[i];
                console.log(previous)
                
            }
            console.log(maskedEmail)
            return maskedEmail.join('');
            
        }
    }

NDB.forEach((D) =>  D.last_activity = unixToDate(D))
NDB.forEach((D) =>  D.email = emailMask(D))







app.get("/users",(req,res) =>{
    res.statusCode = 200
    res.json({usarios:NDB})
})

app.get("/users/:id",(req,res) => {       
    var id = req.params.id 
    var usuario = NDB.find(u => u.id == id)        
        res.statusCode = 200;
        res.json({usuario}) 
})

app.get("/users/pay-users",(req,res) => {

    let payers = NDB.filter(p => p.status == "enabled" )
    let npayers = NDB.filter(n => n.status == "disabled" )
    


    res.statusCode = 200
    res.json({pagantes_ativos:payers, não_pagantes_inativos: npayers})
})


let Port = 30100
app.listen(Port,() => { 
    console.log(`Api Rodando na porta ${Port}`)
})