var
	_ = require('underscore'),
	express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
	authenticationService = require('../services/auth.js'),
	pagingAndSortingService = require('../services/PagingAndSorting.js');

module.exports = function (app) {
  app.use('/api/users', router);
};

function convertMongoUser(user) {
	//return user.toObject({ transform: true })
	return {
		id: user.id,
		firstname: user.firstname,
		lastname: user.lastname,
		phone: user.phone,
		roles: user.roles
	}
}

router.route('/')
	.get(authenticationService.authenticate)
	.get(authenticationService.authorize(['staff']))
	.get(pagingAndSortingService.pager)
	.get(pagingAndSortingService.sorter)
	.get(function(req, res, next) {
		pagingAndSortingService.decorate(
			req, User.find()
		)
		.exec(function (err, users) {
		  if (err) return next(err);
		  res.json(_.map(users, function(user) {
				return convertMongoUser(user);
			}));
		});
	})

	.post(function (req, res, next) {
		var user = new User({
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			phone: req.body.phone,
			roles: req.body.roles
		});

		user.save(function(err, userSaved) {
			res.status(201).json(convertMongoUser(userSaved));
		});
	});

router.route('/:id')
	.get(authenticationService.authenticate)
	.get(function(req, res, next) {
		User.findById(req.params.id, function(err, user) {
			res.json(convertMongoUser(user));
		});
	})

	.put(authenticationService.authenticate)
	.put(authenticationService.authorize([ 'staff' ]))
	.put(function(req, res, next) {
		User.findById(req.params.id, function(err, user) {
			user.firstname = req.body.firstname;
			user.lastname = req.body.lastname;
			user.phone = req.body.phone;
			user.roles = req.body.roles;

			user.save(function(err, userSaved) {
				res.json(convertMongoUser(userSaved));
			});
		});
	})

	.delete(authenticationService.authenticate)
	.delete(authenticationService.authorize([ 'staff' ]))
	.delete(function(req, res, next) {
		User.findByIdAndRemove(req.params.id, function(err) {
			res.status(204).end();
		});
	});