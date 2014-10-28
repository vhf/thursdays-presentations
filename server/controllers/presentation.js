var config = require('../../config');
var Presentation = require('../models/presentation');
var User = require('../models/user');

module.exports.addPresentation = function(req, res) {
  var date = new Date();

  getTotalTime(function(totalTime) {
    if (totalTime < 60) {
      if (date.getDay() === 2) {
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
    } else {
      res.send({'error': 'full'});
    }
  });
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

module.exports.totalTime = function(req, res) {
  getTotalTime(function(totalTime) {res.json({'totaltime': totalTime})});
};

function getTotalTime(cb) {
  Presentation.find({}).exec(function(err, presentations) {
    var totalTime = 0;
    for (var i = 0; i < presentations.length; i++) {
      totalTime += presentations[i].duration;
    }
    cb(totalTime);
  });
}
