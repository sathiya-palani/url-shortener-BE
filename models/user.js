
const mongoose = require('mongoose');

const validateEmail = (e) => {
   var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
   return emailPattern.test(e);
 };
 
 const userSchema = new mongoose.Schema ({
   firstname : {
      type:String,
      requried:[true,"FirstName required"],
   },

   lastname : {
    type:String,
    requried:[true,"LastName required"],
 },

   email:{
      type:String,
      reqired:[true,"Email is reqired"],
       validate:validateEmail
   },

   password :{
      type:String,
      required:[true,"password is required"]

   },

   randomString:{
      type:String
   }


},
{
  versionKey:false
})
 
const userModel = mongoose.model('users',userSchema)

module.exports = userModel;