var config = require('../../config');
var Presentation = require('../models/presentation');
var User = require('../models/user');


module.exports.addPresentation = function(req, res) {
  var presentation = new Presentation(req.body);
  presentation.presenterId = req.hsId;
  presentation.duration = req.body.duration;
  User.getUserById(req.hsId, function(err, user) {
    presentation.presenterName = user.displayName;
    console.log(presentation);
    presentation.save();
    res.send({'result': 'ok'});    
  });
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
