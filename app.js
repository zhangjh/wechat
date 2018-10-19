var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongooseClient = require('mongoose-client');
var index = require('./routes/index');
var users = require('./routes/users');
var server = require('./routes/server');

var app = express();

var mongooseClientInstance = new mongooseClient({
    DB_IP: "127.0.0.1",
    DB_PORT: "20172",
    DB_NAME: "wechat",
    schema: {
		shenhuifu: {
			nickName: {type: String},
			avatarUrl: {type: String},
			province: {type: String},
			content: {type: String},
			id: {type: String}
		},
		slimObject: {
			openId: {type: String},         // 用户唯一标识
			nickName: {type: String},
			avatarUrl: {type: String},
			gender: {type: Number},
			city: {type: String},
			curWeight: {type: String},
			objectWeight: {type: String},
			startDate: {type: String},
			endDate: {type: String}
		},
		slimSign: {
			openId: {type: String},
			nickName: {type: String},
			signed: {type: Number,default: 0},
			date: {type: String}
		},
		todayWeight: {
			openId: {type: String},
			date: {type: String},
			weight: {type: String}
		},
		statUser: {
			openId: {type: String},         // 用户唯一标识
			nickName: {type: String},
			avatarUrl: {type: String},
			gender: {type: Number},
			city: {type: String}
		}
    }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.get('/wx',server.index);
app.get('/wx/token',server.getToken);
// shenhuifu
app.get('/wx/favorite',server.favorite(mongooseClientInstance));
app.get('/wx/getFavorite',server.getFavorite(mongooseClientInstance));
app.get('/wx/unFavorite',server.unFavorite(mongooseClientInstance));
app.get('/wx/like',server.like(mongooseClientInstance));
app.get('/wx/unlike',server.unLike(mongooseClientInstance));
app.get('/wx/getlike',server.getLike(mongooseClientInstance));
// slim
app.get('/wx/getOpenId',server.getOpenId());
app.get('/wx/decrypt',server.decrypt());
app.get('/wx/saveObject',server.saveObject(mongooseClientInstance));
app.get('/wx/getObject',server.getObject(mongooseClientInstance));
app.get('/wx/sign',server.sign(mongooseClientInstance));
app.get('/wx/signed',server.signed(mongooseClientInstance));
app.get('/wx/isSigned',server.isSigned(mongooseClientInstance));
app.get('/wx/saveTodayWeight',server.saveTodayWeight(mongooseClientInstance));
app.get('/wx/getWeightBatch',server.getWeightBatch(mongooseClientInstance));
app.get('/wx/getSignedBatch',server.getSignedBatch(mongooseClientInstance));
app.get('/wx/statUsers',server.statUsers(mongooseClientInstance));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
