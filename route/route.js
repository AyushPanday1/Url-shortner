const express = require('express');

const router = express.Router();

const {createurl , redirectToUrl} = require('../controller/urlcontroller.js')

router.get("/Trial-api" , function(req,res){
    res.status(200).send("Yes, it is working")
})

/*FIRST API________________________________ */

router.post('/createurlcode' , createurl)

/*SECOND API______________________________ */

router.get('/redirect/:urlCode' , redirectToUrl)

/*End point_______________________________ */

router.all('*',function (req,res){
    return res.status(404).send({status:false,message:"Page Not Found"})
})


module.exports = router