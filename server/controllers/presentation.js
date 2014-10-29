var config = require('../../config');
var Presentation = require('../models/presentation');
var User = require('../models/user');
var moment = require('moment');
var zulip = require('zulip');

module.exports.addPresentation = function(req, res) {
  var date = new Date();

  getTotalTime(function(totalTime) {
    if (totalTime < 60) {
      if (date.getDay() === 4) {
        Presentation.find({'presenterId': req.hsId}).count(function(err, count) {
          if (count === 0) {
            var presentation = new Presentation(req.body);
            presentation.presenterId = req.hsId;
            presentation.duration = req.body.duration;
            presentation.week = moment().week();
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
  Presentation.find({'week': moment().week()}).exec(function(err, presentations) {
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

module.exports.zulipNotify = function(req, res) {
  var client = new zulip.Client({
    email: config.ZULIP_EMAIL,
    api_key: config.ZULIP_SECRET,
    verbose: false
  });
  var content = "It's sign up time! [Sign up](http://thursday-presentations.herokuapp.com/#/) for presentations tonight.";
  client.sendMessage({
    type: "stream",
    content: content,
    to: ['455 Broadway'],
    subject: "Tonight's presentations"
  }, function(error, response) {
    if (error) {
        res.json({'error': error});
    } else {
        res.json({'ok': 'message sent'});
    }
  });

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
