var mongoose = require('mongoose');

var stockSchema = mongoose.Schema
({
  SYMBOL:{
       type:String,
       required:true,
   },
   OPEN:{
       type:Number,
   },
 
  HIGH:{
       type:Number,
   },
 
  LOW:{
       type:Number,
   },
 
   CLOSE:{
       type:Number,
   },
 
   LAST:{
       type:Number,
   },
   Date:{
       type:Date,
       default:Date.now()
   }
 
    
});
 
var stock = mongoose.model('stock', stockSchema);
 
module.exports = stock;

///////////////////

