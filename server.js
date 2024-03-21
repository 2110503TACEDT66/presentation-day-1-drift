const express =require('express');
const dotenv = require('dotenv');
const cookieParser=require('cookie-parser');
const connectDB = require('./config/db');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const {xss} = require('express-xss-sanitizer');
const rateLimit=require('express-rate-limit');
const hpp=require('hpp');
const cors = require('cors');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

//load env vars
dotenv.config({path:'./config/config.env'});

//connect mongoDB
connectDB();

//route for methods
const hotels = require('./routes/hotels');
const auth = require('./routes/auth');
const bookings = require('./routes/bookings');

const swaggerOptions = {
    swaggerDefinition:{
        openapi:'3.0.0',
        info:{
            title : 'Libary API',
            version: '1.0.0',
            description: 'A simple Express VacQ API'
        },
        servers:[
            {
                url:'http://localhost:3000/api/v1'
            }
        ]
    },
    apis:['./routes/*.js']
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

const app = express();

app.use('/api-docs',swaggerUI.serve , swaggerUI.setup(swaggerDocs));

//for using json format
app.use(express.json());

app.use(mongoSanitize()); //prevent sql/nosql injection
app.use(xss()); //block body script injection
app.use(helmet()); //more header for security
const limiter=rateLimit({
    windowsMs:10*60*1000,
    max:200
});
app.use(limiter); //limit max request
app.use(hpp()); //prevent duplicate req.params
app.use(cors()); //cross-origin resource sharing

app.use(cookieParser()); //for cookie parser

//route to different path
app.use('/api/v1/hotels' , hotels);
app.use('/api/v1/auth' , auth);
app.use('/api/v1/bookings', bookings)

//listen users on PORT
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT , console.log('Server running in' , process.env.NODE_ENV , 'mode on port' , PORT));
//Handle unhandle promise rejections
process.on('unhandledRejection' , (err,promise)=>{
    console.log(`Error ${err.message}`);
    //Close server & exit process
    server.close((()=>process.exit(1)));
})

module.exports = app