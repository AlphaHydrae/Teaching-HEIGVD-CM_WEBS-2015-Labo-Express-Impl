var
	_ = require('underscore'),
	express = require('express'),
	router = express.Router(),
	config = require('../../config/config'),
	citizenConfigService = require('../services/citizenConfigService');

module.exports = function (app) {
  app.use('/configure', router);
};

router.route('/')
	.post(function (req, res) {
		if (req.body.eventSourceInstanceId) {
			citizenConfigService.upsert(req.body.eventSourceInstanceId, req.body.properties);
		}

		return res.status(204).end();
	});