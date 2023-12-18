const {model, Schema} = require('mongoose');

let uploadMeme = new Schema({
    MessageID: Number, 
    Link: String,
    Category: String,
});

module.exports = model('uploadMeme', uploadMeme); 