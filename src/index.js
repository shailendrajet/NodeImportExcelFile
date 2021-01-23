const express = require('express');
const config = require('config');
const readXlsxFile = require("read-excel-file/node");
const mongoose = require('mongoose');
const fileupload = require('./../routes/fileupload');
//const dbConn = config.get("dbconfig");
let url = mongoose.connect("mongodb+srv://shailendra:mwAj2uflAwXZvRH3@cluster0.fxzrp.mongodb.net/playground?retryWrites=true&w=majority", 
{ 
	useNewUrlParser: true, 
	useUnifiedTopology: true 
})
.then(() => console.log("connected"))
.catch(err => console.error('Could not connect'));

mongoose.set("useCreateIndex", true);

const app = express();

app.use(express.json());
app.use('/api/fileupload', fileupload);

const port = process.env.PORT || 8080;

app.listen(port, () => {
 console.log("App listening at port:" + port);
})