const express = require('express')
const router = express.Router()
//destructuring
const { ensureAuth , ensureGuest} = require('../middleware/auth')

const Story =require('../models/Story')


// @description - login/landing page
//@route GET- to handle the request
// for middleware
router.get('/', ensureGuest ,(req, res) =>{
    res.render('login', {
        layout: 'login',
    }) // send -> render
  
})


// @description - dashboard
//@route GET/dashboard
//auth midddleware 
router.get('/dashboard' , ensureAuth, async (req, res) =>{
    //story model
    try {
        const stories = await Story.find({ user : req.user.id}).lean()  
            res.render('dashboard', {
                name : req.user.firstName,
                 stories
        }) // send-> render

    }catch(err) {
        console.log(err)    
        res.render('error/500')

    }
})

module.exports =router