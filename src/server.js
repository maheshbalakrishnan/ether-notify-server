// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var Notification = require('./models/notification');
var NotificationArchive = require('./models/notificationArchive');
var Users = require('./models/users');
var AuthEvents = require('./models/authevents');
var middleware = require('./middleware');
const crypto = require('crypto');
let jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');

var secret = uuidv4();

var db = null;

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8081;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    if (req.originalUrl === '/ether/api/auth') {
        next();
    } else {
        middleware.checkToken(req, res, secret, next);
    }
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// on routes that end in /notifications
// ----------------------------------------------------
router.route('/notifications')

	.post(function(req, res) {
		
		var notification        = new Notification();		// create a new instance of the Notification model
        notification._id        = new mongoose.Types.ObjectId();
        notification.type       = req.body.type;
        notification.title      = req.body.title;
        notification.message    = req.body.message;
        notification.action     = req.body.action;
        notification.metadata   = req.body.metadata;
        notification.time       = Date.now();
        notification.source     = req.body.source;        

		notification.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Notification created!' });
		});		
	})

	// get all the notifications (accessed at GET http://localhost:8080/api/notifications)
	.get(function(req, res) {
		Notification.find(function(err, notifications) {
			if (err)
				res.send(err);

			res.json(notifications);
		});
	});

// on routes that end in /notifications/:notification_id
// ----------------------------------------------------
router.route('/notifications/:notification_id')

	// get the notification with that id
	.get(function(req, res) {
		Notification.findById( req.params.notification_id, function(err, notification) {
            if (err)
                res.send(err);            
			res.json(notification);
		});
	})

	// delete the notification with this id
	.delete(function(req, res) {
        Notification.findById( req.params.notification_id, function(err, notification) {
            if (err)
                res.send(err);

            var notArch        = new NotificationArchive()
            notArch._id        = new mongoose.Types.ObjectId();
            notArch.oldId      = notification._id
            notArch.type       = notification.type;
            notArch.title      = notification.title;
            notArch.message    = notification.message;
            notArch.action     = notification.action;
            notArch.metadata   = notification.metadata;
            notArch.time       = notification.time;
            notArch.archived   = Date.now();
            notArch.source     = notification.source;        
    
            notArch.save(function(err) {
                if (err)
                    res.send(err);

                Notification.deleteOne({
                    _id: req.params.notification_id
                }, function(err, notification) {
                    if (err)
                        res.send(err);
        
                    res.json({ message: 'Successfully deleted' });
                });
            });
		});		
	});

router.route('/auth')
	.post(function(req, res) {		
		var authEvent           = new AuthEvents();		// create a new instance of the Notification model
        authEvent._id           = new mongoose.Types.ObjectId();
        authEvent.username      = req.params.username;
        authEvent.time          = Date.now();
        authEvent.location      = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        authEvent.success       = false;
        authEvent.request       = JSON.stringify(req.body);
        
        // authenticate the data
        if(req.body.username === undefined || req.body.password === undefined) {
            authEvent.save(function(err) {
                if (err)
                    res.send(err);
            });		
            res.sendStatus(403);            
        }

        let query = Users.findOne({ username: req.body.username });
        query.exec(function(err, user) {
            if(err)
                res.send(err)

            const hash = crypto.createHash('sha256');
            hash.update(req.body.password);
            if(hash.digest('hex').toLowerCase() == user.password.toLowerCase()) {
                let token = jwt.sign(
                    {
                        username: user.username
                    },
                    secret,
                    { 
                        expiresIn: '24h' // expires in 24 hours
                    });

                authEvent.success = true;
                authEvent.save(function(err) {
                    if (err)
                        res.send(err);
                });		

                res.json({
                        success: true,
                        message: 'Authentication successful!',
                        token: token
                      });
            } else {
                authEvent.save(function(err) {
                    if (err)
                        res.send(err);
                });		
                res.sendStatus(403);
            }
        });
    });
    
router.route('/ref_sec')
    .post(function(req, res) {
        var authEvent           = new AuthEvents();		// create a new instance of the Notification model
        authEvent._id           = new mongoose.Types.ObjectId();
        authEvent.username      = "sECRETrEFRESH";
        authEvent.time          = Date.now();
        authEvent.location      = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        authEvent.success       = true;
        authEvent.request       = JSON.stringify(req.body);
        secret = uuidv4();
        authEvent.save(function(err) { });
        res.json({
            result: 'success'
        })        

    });
app.use('/ether/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Started server on port: ' + port);

setTimeout(() => {
    var mongoose   = require('mongoose');
    mongoose.connect('mongodb://mongo:27017/notifications', { useNewUrlParser: true }); // connect to our database

    // Handle the connection event
    db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    db.once('open', function() {
    console.log("DB connection alive");
    });
}, 5000)