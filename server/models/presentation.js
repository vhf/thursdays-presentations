var moment = require('moment');
var mongoose = require('mongoose');

var presentationSchema = new mongoose.Schema({
  presenterId: Number,
  presenterName: String,
  duration: Number, //in minutes
  week: Number
}, {
  // we need to set this so empty object can be persisted
  minimize: false
});

module.exports = mongoose.model('Presentation', presentationSchema);
