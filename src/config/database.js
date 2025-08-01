const mongoose = require('mongoose');

// mongoose.connect("mongodb+srv://harshpruthi:SoxzxoS4jLZxz89M@namastenode.gwoj6.mongodb.net/");

//all we need to connect to our cluster 

//not a good away, wrap this in async function is better, mongoose.connect gives us a promise

const connectDB = async()=>{
    // await mongoose.connect("mongodb+srv://harshpruthi:SoxzxoS4jLZxz89M@namastenode.gwoj6.mongodb.net/");
    // to refer to a specific database /devTinder

    await mongoose.connect("mongodb+srv://harshpruthi:9yyDXUOdUdHFzBbz@namastenode.gwoj6.mongodb.net/devTinder");
}

module.exports = connectDB;
