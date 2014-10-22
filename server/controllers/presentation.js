var config = require('../../config');
var Presentation = require('../models/presentation');
var User = require('../models/user');


module.exports.addPresentation = function(req, res) {
  var presentation = new Presentation(req.body);
  presentation.save();
  res.send({'result': 'ok'});
};


module.exports.cancelPresentation = function(req, res) {
  toCancel = req.body.id;
  Presentation.findOneAndRemove(function(err, deleted) {
    res.send({'result': 'ok'});
  });
};


module.exports.listPresentation = function(req, res) {
  Presentation.find({}).exec(function(err, presentations) {
    res.json(presentations);
  });
};
