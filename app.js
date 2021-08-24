//initial expres setup

const path = require('path')
const express = require ('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db')



//load config file - for global variables 
dotenv.config({ path:'./config/config.env'})

//.passport config 
require('./config/passport')(passport)

connectDB()

//initialise app 
const app = express()

//body parser (middleware- for post method in stories.js, 
//urlencoded- acccept the form data, 
app.use(express.urlencoded({ extended: false}))
app.use(express.json())

//method override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

//morgan logger
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}
//handlebar helpers -need to use the hbs.js
const { formatDate , stripTags, truncate, editIcon, select } = require('./helpers/hbs')


//engine handlebars- middleware
app.engine('.hbs', exphbs({ helpers: {
    formatDate,
    stripTags,
    truncate,
    editIcon, //these are for registration
    select,
  }, 
    defaultLayout: 'main',  extname: '.hbs'}))
app.set('view engine', '.hbs')

//session
app.use(session({
    secret: 'story book',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({  // found in stackoverflow- new updates
      mongoUrl : process.env.MONGO_URI  }),
  })
  
  )
  
//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//set global var
app.use( function(req, res, next){
  res.locals.user = req.user || null
  next()
})

//static foldera
app.use(express.static(path.join(__dirname, 'public')))

//route- link with app.js
app.use('/', require('./routes/index.js'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server Running in ${process.env.NODE_ENV} mode on port ${PORT}`))