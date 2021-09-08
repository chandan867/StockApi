const express=require('express')
const mongoose=require('mongoose')
const csvtojson=require('csvtojson')
const multer=require('multer')
const Stock = require('./model/stockModel')
const ejs=require('ejs')





const app=express() 
app.set('view engine','ejs')
app.use(express.json())
app.use(express.urlencoded({extended:false}))


app.get("/",function(req,res){
 // res.sendFile(__dirname+'/index.html');
 res.render('index')
});

/////////////uploading file through multer//////////
const fileStorageEngine=multer.diskStorage({
  destination: function(req,file,callback){
    callback(null,'./uploads');
  },
  filename: function(req,file,callback){
    callback(null,file.originalname);
  }
});

const upload=multer({storage:fileStorageEngine});


//////////converting csv to json//////////////////// 
async function data(filePath){  
  try{
    console.log(filePath)
    const data=await csvtojson().fromFile(filePath);
 //  insert through mongoDb
 ////
   Stock.insertMany(data,(err,res)=>{
     if(err)
     console.log(err)
    })
console.log(data)
  }catch(err)
  {
    console.log(err)
  }
}

app.post("/",upload.single('selectedFile'),(req,res)=>{
 
  //console.log(req.file)
  data(req.file.path)
res.send('file uploaded')

});
// example url=/api/reliance/08-09-2021/08-09-2021
app.get('/api/:stockName/:from/:to',async(req,res)=>{
  let stockName=req.params.stockName;
  let from=req.params.from
  let to=req.params.to;
  let result=await Stock.find({SYMBOL:stockName.toUpperCase()});
  if(result.length==0)
  return res.send('stock not found')
   let min=100000;
   let max=0;
   let last;
  if(result.length==1)
  {
    return res.json({
      high:result[0].HIGH,
      low:result[0].LOW,
      Last:result[0].LAST
    })
  }
  for (let i = 0; i < result.length; i++) 
  {       
    console.log('running')
    console.log(result[i].Date<new Date(to))
    if(result[i].Date<new Date(to) && result[i].Date>new Date(from))
            {
                    min=Math.min(min,result[i].LOW)
                    max=Math.max(max,result[i].HIGH)
            }
           
  }
//  console.log(result.length)
   return res.json({
     high:max,
     low:min,
  last:result[result.length-1].LAST
   })
      
})

////connecting to the database

let url='mongodb+srv://chandan:chandan47@cluster0.nih80.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const ConnectDb = async () => {
 
  try {
    const conn = await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,

      useCreateIndex: true,
    });
    console.log(`mongodb connected ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error ${error.message}`);
    process.exit(1);
  }
};

ConnectDb();
///////////////////////////////////////////////////////////////


const port =  8000;
app.listen(port, console.log(`server running on port ${port}`));
