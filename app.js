const express = require('express');
const path = require('path');
//const mongoose = require('mongoose');
const methodOverride = require('method-override');
//const Campground = require('./models/campground');

// mongoose.connect('mongodb://localhost:27017/yelp-camp', {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true
// });

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//     console.log("Database connected");
// });


const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.redirect('/listings');
});
app.get('/listings', async (req, res) => {
    const listings = await Lisitng.find({});
    res.render('listings/index', { listings });
});
//Route for the new form
app.get('/listings/new', (req, res) => {
    res.render('listings/new');
})
//Route for post request to accept new listing form data
app.post('/listings', async (req, res) => {
    var admin = require("firebase-admin");
    const uuid = require('uuid-v4');

    // CHANGE: The path to your service account
    var serviceAccount = require("path/to/serviceAccountKey.json");

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: "<BUCKET_NAME>.appspot.com"
    });

    var bucket = admin.storage().bucket();

    var filename = "path/to/image.png"

    async function uploadFile() {

    const metadata = {
        metadata: {
        // This line is very important. It's to create a download token.
        firebaseStorageDownloadTokens: uuid()
        },
        contentType: 'image/png',
        cacheControl: 'public, max-age=31536000',
    };

    // Uploads a local file to the bucket
    await bucket.upload(filename, {
        // Support for HTTP requests made with `Accept-Encoding: gzip`
        gzip: true,
        metadata: metadata,
    });

    console.log(`${filename} uploaded.`);

    }

    uploadFile().catch(console.error);

    const listing = {
        title: '',
        description: '',
        image: ''
    }
    const listing1 = new Listing(req.body.listing);
    fetch(
        'https://dreamworks-case-project-default-rtdb.firebaseio.com/listings.json',
        {
          method: 'POST',
          body: JSON.stringify(programData),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      ).then(() => {
        history.replace('/');
      });
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
app.put('/listings/:id', async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${listing._id}`);
});

// //Deletion is not required
// app.delete('/listings/:id', async (req, res) => {
//     const { id } = req.params;
//     await Listing.findByIdAndDelete(id);
//     res.redirect('/campgrounds');
// })


app.listen(3000, () => {
    console.log('Serving on port 3000')
})