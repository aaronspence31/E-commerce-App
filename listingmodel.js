const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
    title: String,
    description: String,
    image: {
        url: String,
        filename: String
    }
});

module.exports = mongoose.model('Listing', ListingSchema);