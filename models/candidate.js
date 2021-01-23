const mongoose = require('mongoose');

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const Candidate = mongoose.model('Candidate', new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		minlength: 3,
		maxlength: 50
	},
	email_id: {
		type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
		validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
	},
	phone_number: {
		type: String,
        trim: true,        
        unique: true        
	},
	candidates_data: [],
	created_by: String,
	modified_date: { type: Date, default: Date.now()},
	modified_by: String	
}));

exports.Candidate = Candidate; 