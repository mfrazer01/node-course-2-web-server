const express = require('express')
const hbs = require('hbs')
const fs = require('fs')

const port =process.env.PORT || 3000

const maintenance = false;

var app = express()

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs')


app.use((req, res, next) => {
	var now = new Date().toString()
	var log = `${now}: ${req.method} ${req.url}`
	fs.appendFile('server.log', log + '\n', (err) => {
		if (err) {
			console.log('Unable to append to server.log')
		}
	})
	console.log(log)
	next()
})

app.use((req, res, next) => {
	if (maintenance) {
		res.render('maintenance.hbs')
	} else {
		next()
	}
})

app.use(express.static(__dirname + '/public'))

hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear()
})

hbs.registerHelper('screamIt', (text) => {
	return text.toUpperCase()
})

app.get('/', (req, res) => {
	res.render('home.hbs', {
		pageTitle: 'Home Page',
		welcomeMessage: 'Welcome to my website'
	})
})

app.get('/about', (req,res) => {
	// res.send('About Page')
	res.render('about.hbs', {
		pageTitle: 'About Page'
	})
})

app.get('/bad', (req,res) => {
	res.send({
		errorMessage: 'Unable to handle request'
	})
})
app.listen(port, () => {
	console.log(`Server is running on port ${port}`)
})
