
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

var users = {
	'napster' : {
		name : 'zhangxiaojian',
		website : 'https://github.com/napster99'
	}
};

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// app.all('/users/:username',function(req, res, next) {
// 	//检查用户是否存在
// 	if (users[req.params.username]) {
// 		next();
// 	} else {
// 		next(new Error(req.params.username + ' does not exist.'));
// 	}
// });

app.get('/', routes.index);
app.get('/users/:username', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
