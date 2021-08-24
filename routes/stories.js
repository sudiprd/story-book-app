//stories.js perform a processing the files- routes

const express = require('express')
const router = express.Router()
//destructuring
const { ensureAuth } = require('../middleware/auth')

const Story = require('../models/Story')


// @description - show at page
//@route GET- /storeis/add

router.get('/add', ensureAuth ,(req, res) =>{
    res.render('stories/add') // send -> render
  
})

// @description - process add from 
//@route POST/storeis/add

router.post('/', ensureAuth , async (req, res) =>{
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')


    } catch(err){
        console.error(err)
        res.render('error/500')
    }
})

// @description - show all stories- public
//@route GET- /storeis, we fetch the stories and render them

router.get('/', ensureAuth , async (req, res) =>{
    try{
        const stories = await Story.find({ status : 'public'})
        .populate('user')
        .sort({createdAt : 'desc'})
        .lean()
        res.render('stories/index', {
        stories,
     })

    } catch(err){
        console.error(err)
        res.render('error/500')
    }
  
})

// @description - show single stories
//@route GET- /storeis/add

router.get('/:id', ensureAuth , async (req, res) =>{
    try{
        let story = await Story.findById(req.params.id).populate('user').lean()

        if(!story) {
            return res.render('error/404')
        }

        if (story.user._id != req.user.id && story.status == 'private') {
            res.render('error/404')
          } else {
            res.render('stories/show', {
              story,
            })
          }

    }catch(err){
        console.error(err)
        res.render('error/404')
    }
    
})

// @description - show edit stories
//@route GET- /storeis/edit/id

router.get('/edit/:id', ensureAuth , async (req, res) =>{
    try{

        const story = await Story.findOne({
            _id : req.params.id,
        }).lean()
        
        if ( !story){
            return res.render('error/404')
    
        }
    
        if(story.user != req.user.id){
            res.redirect('/stories')
        }else {
            res.render('stories/edit', {
                story,
            })
        }

    }catch (err){
        console.error(err)
        return res.render('error/500')
    }
})
// @description - updates stories
//@route- PUT/stories/:id

router.put('/:id', ensureAuth , async (req, res) =>{
    try{
        
    let story = await Story.findById(req.params.id).lean()

    if (!story){
        return res.render('error/404')
    }
    if(story.user != req.user.id){
        res.redirect('/stories')
    }else {
        story = await Story.findOneAndUpdate({_id: req.params.id}, req.body,{
            new : true,
            runValidators : true, //check the mongooose field are valid or not
        })
        res.redirect('/dashboard')
    }
    } 
    catch(err){
        console.error(err)
        return res.render('error/500')
    }
})

// @description - delete stories
//@route - delete/storeis/:id

router.delete('/:id', ensureAuth , async (req, res) =>{
    try {
        let story = await Story.findById(req.params.id).lean()

    if (!story) {
      return res.render('error/404')
    }

    if (story.user != req.user.id) {
      res.redirect('/stories')
    } else {
        await Story.remove({ _id : req.params.id})
        res.redirect('dashoboard')
    }
    }catch(err){
        console.error(err)
        return res.render('error/500')
    }
})

// @description - user stories
//@route GET- /storeis/user/:id

router.get('/user/:userId', ensureAuth , async (req, res) =>{
    try{
        const stories = await Story.find({
            user :req.params.userId,
            status: 'public',

        }).populate('user')
        .lean()

        res.render('stories/index' , {
            stories,
        })
    }catch(err){
        console.error(err)
        res.redirect('error/500')
    }
})

module.exports =router