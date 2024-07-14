const express= require("express");
const app = express();
const path = require("path")
const methodOverride = require('method-override')
const mongoose = require("mongoose")
const listing = require("./Models/listing");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended:true}));


app.use(methodOverride('_method'))

main()
.then(()=>{console.log("connected to db")})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}

const port = 8080;

app.get("/",async(req,res)=>{

    res.send("This is the root")
})

app.get("/listings",async(req,res)=>{
const allData = await listing.find({});
  res.render("listings/index.ejs",{allData});
})
app.get("/listings/create",(req,res)=>{
  res.render("User/create.ejs")
})
app.post("/listings", async (req,res)=>{
  let {title,description,image,price,location,country}=req.body;
  let sample = listing({
        title,
        description,
        price,
        location,
        country
      })
      await sample.save()
      .then(()=>console.log("Sample was saved"))
      .catch(err=>console.log(err));

  res.redirect("/listings")
})
app.get("/listings/edit/:id",async(req,res)=>{
  let {id}=req.params;
  let doc = await listing.findById(id);
  res.render("User/edit.ejs",{doc})
})
app.patch("/listings/:id",async(req,res)=>{
  let {id}= req.params;
  console.log(req.body)
 // deconstructing the listing inside req.body
  await listing.findByIdAndUpdate(id,{...req.body.listing})
  .then((val)=>console.log(val))
  res.redirect(`/listings/${id}`)
})
app.get("/listings/delete/:id",async(req,res)=>{
  let {id}= req.params;
  await listing.findByIdAndDelete(id);
  res.redirect("/listings");
})
app.get("/listings/:id",async(req,res)=>{
  let {id} = req.params;
  const value = await listing.findById(id);
  res.render("listings/show.ejs",{value});
})

app.listen(port,()=>{
    console.log(`Listening to port ${port}`);
})