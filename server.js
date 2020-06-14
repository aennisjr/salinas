const express = require('express')
const axios = require('axios')
const cors = require('cors')
const path = require('path')
const router = express()

var port = process.env.PORT || 5000

// router.use(cors())

router.use('/src', express.static(path.join(__dirname, 'src')))
// router.use('/src/css', express.static(path.join(__dirname, 'src/css')))
// router.use('/src/images', express.static(path.join(__dirname, 'src/images')))
// router.use('/src/images/favicon', express.static(path.join(__dirname, 'src/images/favicon')))

router.get('/barchart', (req, res) => {

	axios.get('https://marketdata.websol.barchart.com/getQuote.json?apikey=bb2e78407fecdf7077ad400860cd2cd8&symbols=AAPL%2CGOOG%2CVRSN%2CUPS%2CGS%2CPG%2CMDLZ%2CTEVA%2CUAL%2CLILAK&fields=fiftyTwoWkHigh%2CfiftyTwoWkHighDate%2CfiftyTwoWkLow%2CfiftyTwoWkLowDate', {})
    .then(response => {                
        if(response) {
        	res.status(200).json(response.data)
        }
    })
    .catch(err => {
        console.log(err)
    })
    
})

router.get('/newsfeed', (req, res) => {

	axios.get('http://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=225c8698eb1f44e7b9dca664500ae703', {})
    .then(response => {                
        if(response) {
        	res.status(200).json(response.data)
        }
    })
    .catch(err => {
        console.log(err)
    })
    
})

router.get('/', (req, res) => {

	res.sendFile(path.join(__dirname + '/index.html'));

})


router.listen(port, function() {
  	console.log('Server is running on port: ' + port)
})
