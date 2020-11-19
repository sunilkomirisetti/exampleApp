var mongoose = require('mongoose'),
config = require('../libs/config');
mongoose.set('useNewUrlParser', true);

var db = mongoose.connect('mongodb+srv://'+config.get('mongoose:user')+':'+config.get('mongoose:password')+'@'+config.get('mongoose:host')+'/'+config.get('mongoose:dbName'), {useNewUrlParser: true,     
	poolSize: 2,
	useUnifiedTopology: true,
    promiseLibrary: global.Promise,
    useCreateIndex: true});

var onerror = function(error,callback){
	console.log('in error :: ' + JSON.stringify(error, null, 2));
 	mongoose.connection.close();
 	callback(error);
};

module.exports.db = db;