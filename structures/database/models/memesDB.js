const {model, Schema} = require('mongoose');

let memesDB = new Schema({
    Link: String,
    Category: String,
});

module.exports = model('memesDB', memesDB); 