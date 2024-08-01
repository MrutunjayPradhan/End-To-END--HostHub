const mongoose = require("mongoose");
const Data = require("./data");
const listing = require("../Models/listing");


main()
.then(()=>{console.log("connected to db")})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}

const update = async()=>{
    await listing.deleteMany({});
    Data.data = Data.data.map((obj)=>({...obj,owner:"66aa7b4d3915f92f8965e576"}));
    await listing.insertMany(Data.data)
    .then(()=>console.log("Datas are saved "))
    .catch((err)=>console.log(err));
}

update();
