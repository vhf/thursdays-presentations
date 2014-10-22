var config = require('../../config');
var moment = require('moment');
var Session = require('../models/session');
var User = require('../models/user');
var zulip = require('zulip');


module.exports.addSession = function(req, res) {
  var day = moment();

  // create a new date according to user provided time
  var selectedTime = day.hours(req.body.hour).minutes(req.body.minute);

  req.body.day = parseInt(req.body.day, 10);

  if (req.body.day < day.day())  {
    selectedTime = selectedTime.day(7 + req.body.day);
  } else {
    selectedTime = selectedTime.add(day.day()-req.body.day, 'days');
  }

  req.body.date = selectedTime.toISOString();
  req.body.hostId = req.hsId;

  // create the session
  var session = new Session(req.body);

  session.isConflicting(req.hsId, function(err, conflicts) {
    if(conflicts.length === 0) {
      // save it
      session.save(function(err) {
        User.getUserById(req.hsId, function(err, currentUser) {
          // add credit to the correct user
          currentUser.addCredit(function(err, data) {
            zulipNotifyStream(session.description);
            res.json({'error': null});
          });
        });
      });
    } else {
      res.json({
        'error': 'conflict',
        'data': conflicts[0]
      });
    }
  });
};
