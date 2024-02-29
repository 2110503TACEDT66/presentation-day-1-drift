const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    bookDate:{
        type:Date,
        require:true
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        require:true
    },
    hotel:{
        type:mongoose.Schema.ObjectId,
        ref:'Hotel',
        require:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports=mongoose.model('Booking' , BookingSchema);