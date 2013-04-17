
/*
 * GET home page.
 */

// exports.index = function(req, res){
//   res.render('login', { title: 'Express',nap:'napster' });
// };

module.exports = function(app) {

	var crypto = require('crypto');
	var User = require('../models/user');


	app.get('/',function(req, res) {
		res.render('index',{
			title : '首页'
		});
	});

	app.get('/reg', function(req, res) {
		res.render('reg',{
			title : '用户注册'
		});
	});

	app.post('/reg',function(req, res) {
		// console.log('xxxxqwewewq'+req.body['password-repeat']);
		// console.log('xxcvxv>'+req.body['password']);
		//检测用户两次输入的口令是否一致
		if(req.body['password-repeat'] != req.body['password']) {
			req.session.error = '两次输入的口令不一致';
			return res.redirect('/reg');
		}

		//生成口令的散列值
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('base64');
// console.log('页面中的username>>'+req.body.username);
// console.log('页面中的密码>加密前：'+req.body.password);
// console.log('加密后>'+password);
		var newUser = new User({
			 name : req.body.username,
			 password : password
		});

		//检查用户名是否已经存在
		User.get(newUser.name, function(err, user) {
			console.log(user)
			if(user) {
				console.log('用户名已经存在');
				err = 'Username already exists.';
			}
			if(err) {
				req.session.error = err;
				return res.redirect('/reg');
			}

			//如果不存在则新增用户
			newUser.save(function(err) {
				if(err) {
					req.session.error = err;
					return res.redirect('/reg');
				}
				console.log('如果不存在则新增用户');
				req.session.user = newUser;
				req.session.success = '注册成功';
				res.redirect('/');
			});
		});
	}); 
};