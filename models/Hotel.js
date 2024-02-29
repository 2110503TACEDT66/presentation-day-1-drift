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

{toJSON:{virtuals:true},toObject:{virtuals:true}}

);


//Reverse populate with virtual
HotelSchema.virtual('appointments',{
    ref:'Appointment',
    localField:'_id',
    foreignField:'hospital',
    justOne:false
});

//cascade delete
HotelSchema.pre('deleteOne' , async function(next){
    console.log(`Appointments being removed from hospital ${this._id}`);
    await this.model('Appointment').deleteMany({hospital:this._id});
    next();
});


// export dataSchema as Hotel
module.exports=mongoose.model('Hotel',HotelSchema);
