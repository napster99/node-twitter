
/*
 * GET home page.
 */

// exports.index = function(req, res){
//   res.render('login', { title: 'Express',nap:'napster' });
// };

module.exports = function(app) {

	var crypto = require('crypto');
	var User = require('../models/user');
	var Post = require('../models/post');


	app.get('/',function(req, res) {
		
		try{
			Post.getPostsByCount(9,function(err, posts) {

				if(err) {
					req.session.error = err;
					return res.redirect('/');
				}
				
				res.render('index',{
					title : '首页',
					posts : posts
				});
				
			});
		}catch(e){
			console.log('异常异常异常')
		}
		
	});

	app.get('/reg', function(req, res) {
		res.render('reg',{
			title : '用户注册'
		});
	});

	app.post('/reg',function(req, res) {
		//检测用户两次输入的口令是否一致
		if(req.body['password-repeat'] != req.body['password']) {
			req.session.error = 'pwdnothesanme';
			return res.redirect('/reg');
		}

		//生成口令的散列值
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('base64');

		var newUser = new User({
			 name : req.body.username,
			 password : password
		});

		//检查用户名是否已经存在
		User.get(newUser.name, function(err, user) {
			console.log(user)
			if(user) {
				err = 'usernameisexsit';
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
				req.session.error = null;

				
				res.redirect('/');
			});
		});
	}); 


	app.get('/login' , function(req, res) {
		res.render('login', {
			title : '用户登入'
		});
	});	

	app.post('/login',function(req, res) {
		//生成口令的散列值
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('base64');

		User.get(req.body.username, function(err, user) {
			if(!user) {
				req.session.error = 'usernotexsit';
				return res.redirect('/login');
			}
			if(user.password != password) {
				req.session.error = 'pwderror';
				return res.redirect('/login');
			}
			req.session.user = user;
			req.session.success = '登入成功';
			req.session.error = null;
			res.redirect('/');
		});
	});

	app.get('/logout', function(req, res) {
		req.session.user =  null;
		req.session.success = '登出成功';
		res.redirect('/');
	});

	app.post('/post',function(req, res) {
		var currentUser = req.session.user;
		var post = new Post(currentUser.name, req.body.post);
		post.save(function(err) {
			if(err) {
				req.session.error = err;
				return res.redirect('/');
			}
			req.session.success = '发表成功';
			res.redirect('/u/'+currentUser.name);
		});
	});

	app.get('/u/:user', function(req, res) {
		User.get(req.params.user, function(err, user) {
			if(!user) {
				req.session.error = '用户名不存在';
				req.session.success = '';
				return res.redirect('/');
			}
			Post.get(user.name,function(err, posts) {
				if(err) {
					req.session.error = err;
					return res.redirect('/');
				}
				res.render('user', {
					title : user.name,
					posts : posts 
				});
			});
		});
	});



};