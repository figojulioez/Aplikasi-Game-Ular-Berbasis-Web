const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const axios = require('axios');
const multer = require('multer'); // v1.0.5
const upload = multer(); // for parsing multipart/form-data
const cookieParser = require('cookie-parser');

// Memberitahu express apa yang akan digunakan
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());

async function logActivity (req, res) {
	try {
		const token = req.cookies.token;
		axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
		const level = await axios.post('http://127.0.0.1:8000/api/auth/showLog');
		return level;
	} catch (error) {
	}
}

async function createScore (req, res) {
	try {
		const token = req.cookies.token;
		axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
		const {level_id, description, level, score} = req.body;
		const levels = await axios.post('http://127.0.0.1:8000/api/auth/createScore', {level_id, description, level, score});
		res.redirect('/histori');
	} catch (error) {
	}
}


async function yourLevel (req, res) {
	try {
		const token = req.cookies.token;
		axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
		const level = await axios.post('http://127.0.0.1:8000/api/auth/yourLevel');
		return level;
	} catch (error) {
	}
}

async function regis (req, res) {
	try {
		const { email, password, name } = req.body;
		const registrasi = await axios.post('http://127.0.0.1:8000/api/auth/register', { email, password, name });		
		res.redirect('/login');
	} catch (error) {
		// console.log(error);
	}
}


async function isLogin(req, res, next) {
	try {
		const token = req.cookies.token;
		axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
		await axios.post('http://127.0.0.1:8000/api/auth/me');
		next();
	} catch (error) {
			res.redirect('/login');
	}
}

async function isNotLogin(req, res, next) {
	try {
		const token = req.cookies.token;
		axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
		await axios.post('http://127.0.0.1:8000/api/auth/me');
		res.redirect('/');
	} catch (error) {
		next();
	}
}


async function createLog(token) {
	try {
		axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
		var description = `Anda telah Login Pada`;
		const response = await axios.post('http://127.0.0.1:8000/api/auth/createLog', {description});
	} catch (error) {
	}
}



async function login(email, password, res) {
	try {
		const response = await axios.post('http://127.0.0.1:8000/api/auth/login', { email, password });
		const token = response.data.token;
		res.cookie('token', token, { expires: new Date(Date.now() + 900000), httpOnly: true });
		res.redirect('/');
	} catch (error) {
		res.redirect('/login');
	}
}

async function showScore (req, res) {
	try {
		const token = req.cookies.token;
		axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
		const response = await axios.post('http://127.0.0.1:8000/api/auth/showScore');
		return response;
	} catch (error) {
	}	
}

async function logout (req, res) {
	try {
		const token = req.cookies.token;
		axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
		const response = await axios.post('http://127.0.0.1:8000/api/auth/logout');
	} catch (error) {

	}
}

async function highScore (req, res) {
	try {
		const token = req.cookies.token;
		const response = await axios.post('http://127.0.0.1:8000/api/auth/allScore');
		return response;
	} catch (error) {

	}
}

app.post('/login', isNotLogin, upload.array(), (req, res, next) => {
	const { email, password } = req.body;	
	login(email, password, res);
});

app.post('/registrasi', isNotLogin, upload.array(), (req, res, next) => {
	regis(req, res);

});

app.post('/createScore', isLogin, upload.array(), (req, res, next) => {
	createScore(req, res);
});

app.get('/login', isNotLogin, (req, res) => {
	res.render('Login');
});

app.get('/papan-score', isLogin, async (req, res) => {
	const data  = await highScore(req, res);
	var value = data.data.data.sort((a, b) => b.score - a.score);

	res.render('PapanScore', {data: value });
});


app.get('/', isLogin, async (req, res) => {
	const level = await yourLevel(req, res);
	console.log(level);
	res.render('Dashboard', { data: level.data[0] });
});


app.get('/histori', isLogin, async (req, res) => {
	const datas = await showScore(req, res);
	res.render('Histori', {data: datas.data});
});

app.get('/logout', isLogin, async (req, res) => {
	const datas = await showScore(req, res);
	logout(req, res);
	res.clearCookie('token');
	res.redirect('/login');
});

app.get('/Level1', isLogin, (req, res) => {
	res.render('Level1');
});

app.get('/Level2', isLogin, (req, res) => {
	res.render('Level2');
});

app.get('/Level3', isLogin, (req, res) => {
	res.render('Level3');
});

app.get('/Level4', isLogin, (req, res) => {
	res.render('Level4');
});

app.get('/Level5', isLogin, (req, res) => {
	res.render('Level5');
});

app.get('/log', isLogin, async (req, res) => {
	const data = await logActivity(req, res);
	res.render('LogActivity', {data: data.data});
});

app.listen(3000, () => {
	console.log('Server Sudah Berjalan YGY');
});
