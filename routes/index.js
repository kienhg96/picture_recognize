var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');
var path = require('path');
var cloudinary = require('cloudinary');

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_API_SECRET
});

module.exports = function(upload) {
	/* GET home page. */
	router.get('/', function(req, res, next) {
	  res.render('index.html');
	});

	router.post('/upload', upload.single('image'), function(req, res){
		
		var extName= path.extname(req.file.originalname);
		var filePathname = __dirname + '/../uploads/' + req.file.filename;
		fs.rename(filePathname, filePathname + extName, function(err){
			if (err) throw err;
		});

		cloudinary.uploader.upload(filePathname + extName, function(result) { 
  			var Imglink = result.secure_url;
			var url = 'https://api.projectoxford.ai/vision/v1.0/analyze?visualFeatures=Description';
			request.post({
				url: 'https://api.projectoxford.ai/vision/v1.0/analyze?visualFeatures=Description',
				headers: {
    				'Content-Type': 'application/json',
    				'Ocp-Apim-Subscription-Key': process.env.OCP_APIM_KEY
  				},
  				json: {
  					'url': Imglink
  				}
			}, function(err, response, body){
				if (err) throw err;
				res.json({description: body.description, url: Imglink});
				//console.log(filename + extname);
				fs.unlink(filePathname + extName, function(err){
					if (err) throw err;
				})
			});
		});
	});

	router.get('/test', function(req, res){
		cloudinary.uploader.upload(__dirname + '/test.jpg', function(result) { 
  			res.json(result); 
		});
	});
	return router;
}