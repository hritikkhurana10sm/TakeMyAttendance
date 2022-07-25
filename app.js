const express = require('express')
const mongoose = require('mongoose')
const app = express()
const path = require('path')
const ejs = require('ejs');
const Links = require('./models/links');
const Student = require('./models/student');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/attendance'));

const cryptoRandomString = require('crypto-random-string')
const port = process.env.PORT || 3000;
const cookieParser = require('cookie-parser')
app.use(cookieParser());

app.use(express.json())

app.use(express.static('./attendance'))
app.use(express.static('./errors'))
app.use(express.urlencoded({
	extended: true
}))

app.get('/create', (req, res) => {
	res.render(path.join(__dirname, '/attendance/create.ejs'))
})


//to make the url for the students
app.post('/create', async (req, res) => {
	//getting the name and the title
	const {
		name,
		title
	} = req.body

	const url = 'mongodb://localhost/play'
	mongoose
		.connect(url, {
			useNewUrlParser: true
		})
		.then(() => {
			console.log("DataBase Connected Successfully");
		})
		.catch(err => console.log(err));

	const hashval = cryptoRandomString({
		length: 15,
		type: 'alphanumeric'
	})
	var fullUrl = req.protocol + '://' + req.get('host') + '/attendance?db=' + hashval;
	console.log("full url app.js -- ", fullUrl);


	var p = req.cookies;
	const link = await Links.findById(p.user);

	link.title = title;
	link.hash = hashval;
	const date = new Date().toISOString().split('T')[0];
	link.date = date;
	res.cookie('hash', hashval);
	try {
		const result = await link.save()
		res.send(`<h1>Share this link for attendance</h1>
				<a href=${fullUrl}>${fullUrl}</a>`)
	} catch (e) {
		res.send(e)
	}

})



app.get('/attendance', async (req, res) => {

	const {
		db
	} = req.query
	if (!db) {
		return res.sendFile(path.join(__dirname, 'errors/error.html'))
	}

	const result = await Links.findOne({
		hash: db
	})
	console.log('result -- > ', result);
	if (!result) {
		return res.sendFile(path.join(__dirname, 'errors/error.html'))
	}


	var ps = "pp";
	res.render('attendance.ejs', {
		result,
		ps
	});
})

app.post('/attendance', async (req, res) => {

	const {
		db
	} = req.query
	if (!db) {
		return res.sendFile(path.join(__dirname, 'errors/error.html'))
	}
	var date = new Date().toISOString().split('T')[0];


	const {
		name,
		prn
	} = req.body
	const url = `mongodb://localhost/${db}`
	var conn = mongoose.createConnection(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		usecreateIndexes: true
	})
	var date = new Date().toISOString().split('T')[0];
	const newStudent = new Student({
		name: name,
		prn: prn,
		hash: db,
		date: date
	})
	try {
		const result = await newStudent.save()
		console.log('result  ', result);
		res.send('<script>alert("Recorded"); window.location.assign(window.location.href)</script>')
	} catch (e) {
		res.send('<script>alert(`ERROR!!\nSeems like attendennce is already recorded or you entered invalid information.\nPlease Try Again!!` ); window.location.assign(window.location.href)</script>')

	}

})

app.get('/get/:db', async (req, res) => {
	const {
		db
	} = req.params
	// console.log('asfaf', db)
	if (!db) {
		return res.sendFile(path.join(__dirname, 'errors/error.html'))
	}

	const url = `mongodb://localhost/${db}`

	var conn = mongoose.createConnection(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		usecreateIndexes: true
	})
	const date = new Date().toISOString().split('T')[0];




	const result = await Student.find({})
	console.log('result - >  afa  ', result);
	res.render('responselist.ejs', {
		records: result
	})
})



//to get the list of the students
app.get('/getlist/:db', async (req, res) => {

	const {
		db
	} = req.params
	// console.log('dbddd ', db);
	const result = await Student.find({
		hash: db
	})
	console.log('result ', result);
	res.render('responselist.ejs', {
		records: result
	});
})


//to get title and prn number to the next page
app.get('/getinfo/:db', async (req, res) => {

	const {
		db
	} = req.params


	const result = await Links.findOne({
		hash: db
	})
	res.send(result)

})



// signin
app.get('/', async (req, res) => {

	return res.render('signup.ejs');
})


app.post('/signup', async (req, res) => {

	const url = 'mongodb://localhost/play'
	mongoose
		.connect(url, {
			useNewUrlParser: true
		})
		.then(() => {
			console.log("DataBase Connected Successfully");
		})
		.catch(err => console.log(err));

	var data = req.body;
	console.log('data ', data);


	var link = new Links({
		name: data.username,
		email: data.email,
		password: data.password
	})

	const result = await link.save();

	res.cookie('user', link._id);
	
	res.redirect('/');

})

app.post('/signin', async (req, res) => {
	const url = 'mongodb://localhost/play'
	mongoose
		.connect(url, {
			useNewUrlParser: true
		})
		.then(() => {
			console.log("DataBase Connected Successfully");
		})
		.catch(err => console.log(err));

	
	var data = req.body;

	var user = await Links.find({
		name: data.username
	});
	if (user) {

		if (user[0].password !== data.password) {
			res.send('<h1>Incorrect Username / Password</h1>');
		} else {

			const date = new Date().toISOString().split('T')[0];
			
			res.cookie('date', date);
			res.cookie('user', user[0]._id);
			res.render('create.ejs', {
				user: user[0]
			});
		}

	} else {
		res.send('<h1>Account does not exist !</h1>');
	}
})


app.get('/list', async (req, res) => {
	res.render('list.ejs');
})

app.post('/test', async (req, res) => {
	const url = 'mongodb://localhost/play'
	mongoose
		.connect(url, {
			useNewUrlParser: true
		})
		.then(() => {
			console.log("DataBase Connected Successfully");
		})
		.catch(err => console.log(err));

	var data = req.body;

	console.log('data ', data);
	var cook = req.cookies;

	var result = await Student.find({
		date: data.date,
		hash: cook.hash
	});

	if (result.length !== 0) {

		res.render('test.ejs', {
			result: result
		});

	} else {
		res.send(`<h1>No Attendance taken at ${data.date}</h1>`)
	}
})

//to listen the app
app.listen(port, () => {
	console.log(`Connected at port ${port}`)
})