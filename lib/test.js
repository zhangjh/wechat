var mongoose = require('./mongoose');


mongoose.findBatch('slimsign',{date: /2017-10-[\d]/},function(err,ret){
	console.log(err);
	console.log(ret);
});

mongoose.find('slimsign',{date: /2017-10-[\d]/},function(err,ret){
	console.log(ret);
});
