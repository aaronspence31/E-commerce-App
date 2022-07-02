if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Listing = require('./listingmodel');
const multer = require('multer');
const { storage } = require('./cloudinary');
const upload = multer({ storage });

mongoose.connect('mongodb://localhost:27017/listing-app', {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


//////////////////
//////Routes//////
//////////////////

app.get('/', (req, res) => {
    res.redirect('/listings');
});
app.get('/listings', async (req, res) => {
    const listings = await Listing.find({});
    res.render('listings/index', { listings });
});
//Route for the new form
app.get('/listings/new', (req, res) => {
    res.render('listings/new');
})
//Route for post request to accept new listing form data
app.post('/listings', upload.single('image'), async (req, res) => {
    const listing = new Listing(req.body.listing)
    listing.image = {url: req.file.path, filename: req.file.filename};
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
})
//Access info on a specific listing
app.get('/listings/:id', async (req, res,) => {
    const listing = await Listing.findById(req.params.id)
    res.render('listings/show', { listing });
});
//Edit form
app.get('/listings/:id/edit', async (req, res) => {
    const listing = await Listing.findById(req.params.id)
    res.render('listings/edit', { listing });
})
//Put request route to accept edit form data
app.put('/listings/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    listing.image = {url: req.file.path, filename: req.file.filename};
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
});

app.all('*', (req, res) => {
    res.send('404- Page Not Found');
})

app.listen(3000, () => {
    console.log('Serving on port 3000');
})