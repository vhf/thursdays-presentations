var config = require('../../config');
var Presentation = require('../models/presentation');
var User = require('../models/user');

module.exports.addPresentation = function(req, res) {
  var date = new Date();

  if (date.getDay() === 4){


    Presentation.find({'presenterId': req.hsId}).count(function(err, count) {
      if(count === 0) {
        var presentation = new Presentation(req.body);
        presentation.presenterId = req.hsId;
        presentation.duration = req.body.duration;
        User.getUserById(req.hsId, function(err, user) {
          presentation.presenterName = user.displayName;
          presentation.save();
          res.send({'result': 'ok'});
        });
      } else {
        res.send({'error': 'already presenting'});
      }
    });
  } else {
    res.send({'error': 'not thursday'});
  }
};


module.exports.cancelPresentation = function(req, res) {
  Presentation.findOneAndRemove({'presenterId': req.hsId}, function(err, deleted) {
    res.send({'result': 'ok'});
  });
};


module.exports.listPresentation = function(req, res) {
  Presentation.find({}).exec(function(err, presentations) {
    res.json(presentations);
  });
};

module.exports.presenting = function(req, res) {
  Presentation.find({'presenterId': req.hsId}).count(function(err, count) {
    res.json({'presenting': (count === 1)});
  });
};
