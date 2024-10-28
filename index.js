const connectToMongo = require('./db');
const express = require('express');
const Product = require('./product');
connectToMongo();

const app = express()
const port = 5500
app.use(express.json())
app.use(express.static(__dirname + '/views/home'))
app.use(express.static(__dirname + '/views/data'))
app.use(express.static(__dirname + '/views/add'))
app.use(express.static(__dirname + '/views/search'))
app.use(express.static(__dirname + '/views/update'))
app.use(express.static(__dirname + '/views/delet'))


app.set('view engine', 'ejs') // Setting the view engine

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }))


// Renders the HTML page
app.get('/', (req, res) => {
  app.set('views', __dirname + '/views/home')
  res.render('home')
  //res.sendFile(__dirname + '/views/home/home.html')
});


let uname = null;

// Shows the data page where different options are present
app.post('/submit', (req, res) => {
  const username = req.body.username
  uname = req.body.username
  const data = {
    name: username
  }
  app.set('views', __dirname + '/views/data')
  res.render('data', data)
})


// Displays the page to add new product
app.post('/add', (req, res) => {
  app.set('views', __dirname + '/views/add')
  res.render('add')
})


// Action after clicking the add button in the add page
app.post('/add_product', async (req, res) => {
  try {
    //Checking if any other product with same product id is present
    let prodId = await Product.findOne({ id: req.body.id })
    if (prodId) {
      res.status(400).json({ error: "Sorry a product with this product id already exists" })
    }
    else {
      //Creating new product
      const newProduct = await Product.create({
        id: req.body.id,
        name: req.body.name,
        image: req.body.image,
        ip_rating: req.body.ip_rating,
        watts: req.body.watts,
        beam_angle: req.body.beam_angle,
        CCT1: req.body.CCT1,
        CCT2: req.body.CCT2,
        CCT3: req.body.CCT3,
        dimension: req.body.dimension,
        description: req.body.description,
        price: req.body.price
        // Add other fields as needed
      });
      newProduct.save(); // Pushing the new product into mongo

      app.set('views', __dirname + '/views/data')
      //res.write('<script>alert("Product Successfully Added");</script>')
      res.render('data', { action: '/submit', name: uname })

    }
  }
  catch (error) {
    console.error(error.message)
    res.status(500).send("Some error occured")
  }
})


// Displays the search page
app.post('/search', (req, res) => {
  app.set('views', __dirname + '/views/search')
  res.render('search', {user: uname})
})


// Action after clicking the search button in the search page
app.post('/search_product', async(req, res) => {
  try {
    if (req.body.id){
      let prodId = await Product.find({ id: req.body.id })
      if (prodId){
        app.set('views', __dirname + '/views/search') 
        res.render('search',{data: prodId, user: uname})
      }
      else{
        app.set('views', __dirname + '/views/search')
        prodId = ""
        res.render('search',{data: prodId, user: uname})
      }
    }
  }
  catch (error) {
    console.error(error.message)
    res.status(500).send("Some error occured")
  }
})

// Displays the update page
app.post('/update', (req, res) => {
  app.set('views', __dirname + '/views/update')
  res.render('update',{user: uname})
})

// Action after clicking the search button in the update page
app.post('/search_product_to_update', async(req, res) => {
  try {
    if (req.body.id){
      let prodId = await Product.find({ id: req.body.id })
      if (prodId){
        app.set('views', __dirname + '/views/update') 
        res.render('update',{data: prodId, user: uname})
      }
      else{
        app.set('views', __dirname + '/views/update')
        prodId = ""
        res.render('update',{data: prodId, user: uname})
      }
    }
  }
  catch (error) {
    console.error(error.message)
    res.status(500).send("Some error occured")
  }
})

// After clicking the SAVE button in update page
app.post('/save', async(req,res) => {
  try {
    if (req.body.id){
      let prodId = await Product.find({ id: req.body.id })
      if (prodId){
        // Add conditions here to update records in mongo with data in req.body
      }
      else{
        alert("Cannot edit Product ID. Please delete the product and add the product with new Product ID")
      }
    }
  }
  catch (error) {
    console.error(error.message)
    res.status(500).send("Some error occured")
  }
})


// Displays the delete page
app.post('/delete', (req, res) => {
  app.set('views', __dirname + '/views/delet')
  res.render('delet')
})



app.listen(port, () => {
  console.log(`Brochure application listening on port ${port}`)
})