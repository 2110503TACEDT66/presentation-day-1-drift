const User = require('../models/User');

const sendTokenResponse=(user,statusCode , res)=>{
    const token = user.getSignedJwtToken();

    const options ={
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        httpOnly:true
    };

    if(process.env.NODE_ENV==='production'){
        options.secure=true;
    }
    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        token
    });
}

exports.login = async (req,res,next)=>{
    try{
        const {email , password} = req.body;
        console.log(email);
        
        if(!email || !password){
            return res.status(400).json({success:false, msg:'Please provide an email or password'});
        }
        
        //check if user exists
        const user = await User.findOne({email}).select('password');
        if(!user){
            return res.status(400).json({success:false,msg:'Invalid credentials: Wrong Email or Password'});
        }
        
        //check if password match
        const isMatch = await user.matchPassword(password);
        if(!isMatch){
            return res.status(401).json({success:false,msg:'Invalid credentials: Wrong Password'});
        }
        
        //success!!
        sendTokenResponse(user , 200 , res);
    }catch(err){
        return res.status(401).json({success:false , message:"Please provide an email or password"});
    }
} 


exports.register = async (req,res,next)=>{
    try{
        const{name,tel,email,password,role} = req.body;

        const user = await User.create({
            name,
            email,
            tel,
            password,
            role
        });

        //success!!
        sendTokenResponse(user,200,res);

    }catch(err){
        res.status(400).json({success:false});
        console.log(err.stack);
    }
}

exports.logout = async(req,res,next)=>{
    res.cookie('token','none',{
        expires:new Date(Date.now()+ 10 * 1000),
        httpOnly:true
    });
    res.status(200).json({
        success:true , 
        data:{}
    });
};

exports.getMe=async(req,res,next)=>{
    const user=await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        data:user
    });
};