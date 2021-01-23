const {Candidate} = require('../models/candidate');
const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
const readXlsxFile = require("read-excel-file/node");
const router = express.Router();

const excelFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("excel") ||
    file.mimetype.includes("spreadsheetml")
  ) {
    cb(null, true);
  } else {
    cb("Please upload only excel file.", false);
  }
};

global.__basedir = __dirname;

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "./../uploads/");
  },
  filename: (req, file, cb) => {    
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
  },
});

const upload = multer({ storage: storage, fileFilter: excelFilter });

router.post('/', upload.single("uploadfile"), (req, res) =>{
	try {	    
		if (req.file == undefined) {
		  return res.status(400).send("Please upload an excel file!");
		}		
		//console.log(req.file.filename);
		let path = __basedir + "./../uploads/" + req.file.filename;
		readXlsxFile(path).then((rows) => {
		  // skip header
		  rows.shift();

		  //let candidates = [];
		  let rowCount = 0;
		  let str = '';
		  let arrErrors = [];
		  rows.forEach((row) => {		    			
            rowCount = rowCount + 1;			
			let candidate_details = {
			  name: row[0],
			  email_id: row[7],
			  contact_number: (str + row[8]).toString(),			  		 
			  candidates_data: {
				"ctc": {
					"value" : row[5],
					"ctcUnit": row[6],
					"ctcCurrency" : row[4],
				},
				"candidateExperience": row[3].toString(),
				"company": {
					"name": row[2]
				},
				"location" : {
					"city": row[10]
				},
				"linkedIn": row[9] 
			  },
			  created_by: "Shailendra Jetpuria",
			  modified_by: "Shailendra Jetpuria",
			};
			
			var name = candidate_details.name;
			var email_id = candidate_details.email_id;
			var contact_number = candidate_details.contact_number;													
			
			const schemaJoi = { 
				name: Joi.string().min(3).max(50).required(),
				email_id: Joi.string().min(10).max(50).required(),
				contact_number: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
				candidates_data: {
					ctc: {
						value: Joi.string().required(),
						ctcUnit: Joi.string().required(),
						ctcCurrency: Joi.string().required()
						
					},										
					candidateExperience: Joi.string().required(),
					company: {
						name: Joi.string().required() 
					},
					location: {
						city: Joi.string().required() 
					},
					linkedIn: Joi.string().required()
				}							
			};
			for(var k=0; k<rows.length;k++){
				//console.log(rows[k]);
			
				const validation = Joi.object(schemaJoi).validate(candidate_details[k], options={allowUnknown:true});					
				if(validation.error) {
					console.log(validation.error.details[0].message + "  at row " + rowCount);
					return false;
				}
			}
			save(candidate_details, rowCount);
		  });			
		}).catch((err)=>console.log("some errors are there", err));
	} catch (error) {
		console.log(error);
		res.status(500).send({
		  message: "Could not upload the file: " + req.file.originalname,
		});
	}
});

async function save(candidates, rowCount){    
	const candidate = new Candidate(
		candidates
	);
	try {
		const result = await candidate.save();
		console.log( 'record has been added successfully at row ' + rowCount + ' !');
	} catch(ex) {
		//for(field in ex.errors)
			//console.log(ex.errors[field].message + "at row number:" + rowCount);
		console.log(ex.message + "at row number:" + rowCount);		
	}
}

module.exports = router;