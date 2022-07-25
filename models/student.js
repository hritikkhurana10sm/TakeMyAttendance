const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
	name:{
		type:String,
		required:true,
		minlength:5,
		unique:true
		
	},
	prn:{
		type:String,
		required:true,
		minlength:10,
		unique:true
		
	},
	hash:{
		type:String,
		required:true
	},
	date : {
		type : String
	}
})


module.exports = mongoose.model("Student" , studentSchema);


