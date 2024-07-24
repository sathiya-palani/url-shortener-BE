
const userModel = require("../models/user.js");
// const auth = require("../common/auth.js");
const randomstring = require('randomstring');
const nodemailer = require ('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



 // for sign up 

const userController ={
   
signup: async(req,res)=>{

    try {
        const{firstname,lastname,email,password} = req.body;

    const user = await userModel.findOne({email});

    if(!user) {
        const hashPassword = await bcrypt.hash(password,10);
        
        const newUser = new userModel({firstname ,lastname, email,password:hashPassword});

        await newUser.save();

        return res.status(201).send({message:"User created"});
    }

     res.status(404).send({message:'User already exists'});
        
    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error",
            error:error.message
        })
    }
   
},
  
// for login 

 login :async(req,res)=>{
    try {
    
      const {email,password} = req.body;

      const user = await userModel.findOne({email});

      if(!user) {
        return res.status(404).send({message:"User not found"});
      }

      const isMatch = await bcrypt.compare(password,user.password);
      if(isMatch)
        {
            const user = await userModel.findOne({email},{password:0})
            res.status(201).send({
                message:` User  is loggedin successfully`,
                user

            })
        }

      if(!isMatch){
          res.status(401).send({ error: "Incorrect Password"})
      }
       
    

    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error",
            error:error.message
        })
    }
 },

 // forgot password

forgotPassword : async(req,res)=>{
    try {
        let user = await userModel.findOne({email:req.body.email})
        if(user)
        {
            const randomString = randomstring.generate({
                length:8,
                charset:"alphanumeric"
            })
            const expitationTimestamp = Date.now() + 2 * 60 * 1000;

            console.log(expitationTimestamp);

              const resetLink = `http://localhost:5173/reset-password`;

            const transporter = nodemailer.createTransport({
                service:"gmail",
                auth:{
                    user:process.env.EMAIL_ID,
                    pass:process.env.EMAIL_PASSWORD,

                }
            })

            const mailOptions = {
                from: process.env.EMAIL_ID,
                to : user.email,
                subject:"Password-Reset-Link",
                html:`
                <p> Dear user </p>
                
                <p>Sorry to hear you’re having trouble logging into your account. We got a message that you forgot your password. If this was you, you can get right back into your account or reset your password now. </p>
                <p> Click the following Link to reset your password \n ${resetLink} </p>

                <p>If you didn’t request a login link or a password reset, you can ignore this message. </P>

                <p> Only people who know your account password or click the login link in this email can log into your account. </P>
                `

                
                
            }
            transporter.sendMail(mailOptions,(error,info)=>{
                if(error){
                    console.log(error);
                    res.status(404).send({
                        message:"Failed to send the password reset mail"
                    })
                }
                else
                {
                //  console.log("password reset email sent" + info.response)
                    res.status(200).send({
                        message:"password reset mail sent successfully"+ info.response
                        
                    })
                }
                user.randomString=randomString
                 user.save();
                res.status(200).send({message:"Reset password email sent successfully and random string update in db"})
            })
        }
        else
        {
            res.status(400).send({
                message:`user with ${req.body.email} is exists`
            })
        }

      
       
    } catch (error) {
        console.log (error)
        res.status(500).send({
            message:"Internal Server Error"
        })
    }
},


// reset password
resetPassword : async(req,res)=>{
    
    try {
        const {randomString,expitationTimestamp} = req.params;

        const user = await userModel.findOne({randomString:randomString})
        if( user.randomString !== randomString)
        {
            res.status(400).send({
                message:"Invalid Random String"
            })
        }
        else
        {
            if(expitationTimestamp && expitationTimestamp<Date.now())
            {
                res.status(400).send({
                    message:"expirationTimestamp token has expired. Please request a new reset link."
                })
            } else{
                
                if(req.body.newPassword){
                    const newPassword = await auth.hashPassword(req.body.newPassword)

                    user.password = newPassword;
                    user.randomString=null;
                    await user.save()

                    res.status(201).send({
                        message:"Your new password has been updated"
                    })
                }else{
                    res.status(400).send({
                        message:"Invalid password provider"
                    })
                }
            }
        }


    } catch (error) {
        console.log(error);
        res.status(500).send({
        message: "Internal server error",
        });
    }

}
}

module.exports =userController;
    
