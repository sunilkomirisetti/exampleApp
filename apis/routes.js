module.exports = function(app) {	
	require('./config/config')(app);
	require('./testReport/testReport')(app);
	require('./user/user')(app);
};
