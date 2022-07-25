const mongoose = require('mongoose');

const links = new mongoose.Schema({
	name:{
		type:String,
	},
	title:{
		type:String,
		default : ""
		
	},
	hash:{
		type:String,
		default : ""
		
	},
	password : {
		type : String,
		
	},
	email : {
		type : String,
        
	},
	date : {
		type : String
	}
	
})

module.exports = mongoose.model("Links" , links);