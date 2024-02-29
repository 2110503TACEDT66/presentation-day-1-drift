const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({

    name: {
        type: String,
        require: [true,'Please add a name'],
        unique: true,
        trim: true,
        maxlength:[50,'Name can not be more than 50 characters']
    },
    address:{
        type: String,
        require:[true,'Please add an address']
    },
    district:{
        type: String,
        require:[true,'Please add an district']
    },
    province:{
        type: String,
        require:[true,'Please add an province']
    },
    postalcode:{
        type: String,
        require:[true,'Please add an postalcode'],
        maxlength:[5,'Postal Code can not be more than 5 digits']
    },
    tel:{
        type: String
    },
    region:{
        type: String,
        require:[true,'Please add a region']
    }
    

    
},

{toJSON:{virtuals:true},toObject:{virtuals:true} , versionKey:false}

);


//create virtual field name 'bookings' join by hotelId
HotelSchema.virtual('bookings',{
    ref:'Booking', //from Booking model
    localField:'_id', 
    foreignField:'hotel', //join Hotel's id with Booking's id
    justOne:false
});

//cascade delete
HotelSchema.pre('deleteOne',{document:true , query:false} , async function(next){
    console.log(`Bookings being removed from hotel ${this._id}`);
    await this.model('Booking').deleteMany({hotel:this._id});
    next();
});


// export dataSchema as Hotel
module.exports=mongoose.model('Hotel',HotelSchema);
