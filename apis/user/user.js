module.exports = function(app) {    
    app.post('/user',function(req, res){
		try{
			create(req.body, function(response){
				res.json(response);
			});

		}catch(e){
		 res.json(e);
		}
    });
    app.get('/user/:userId', function(req, res) {
		try {
			getDetails(req.params.userId, function(response) {
				res.json(response);
			});
		} catch(e) {
			res.json(e);
		}
	});
    app.post('/login',function(req, res){
		try{
			login(req.body, function(response){
				res.json(response);
			});

		}catch(e){
		 res.json(e);
		}
    });
}

const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const UserSchema = new Schema(require('./userSchema').userSchema, {collection: 'user'});
const UserModel = mongoose.model('user', UserSchema);
const UserController = require('./userController');

const utils = require('../../assets/utils').utils;
const CONSTANTS = utils.CONSTANTS;
const DB_CODES = CONSTANTS.DATABASE_CODES;
const REQUEST_CODES = CONSTANTS.REQUEST_CODES;
const USER_CODES = CONSTANTS.USER;
const VALIDATE = CONSTANTS.VALIDATE;
const mongoUtils = utils.mongoUtils;



function create(user, callback) {
	var userAPI = UserController.UserAPI(user);
	//var randomNumber = utils.getRandomNumber();
	userAPI.setPassword(utils.encryptText('passpass'));
    var errorList = [];
    if (!userAPI.getUserName()) {
       	var e = {
				status: VALIDATE.FAIL,
				error: utils.formatText(VALIDATE.REQUIRED, 'userName')
           
		};
		errorList.push(e);
    }
	if (!userAPI.getPhoneNumber()) {
         	var e = {
				status: VALIDATE.FAIL,
				error: utils.formatText(VALIDATE.REQUIRED, 'phoneNumber')
            
		};
		errorList.push(e);
    }
    if (!userAPI.getEmailAddress()) {
         var e = {
					status: VALIDATE.FAIL,
					error: utils.formatText(VALIDATE.REQUIRED, 'EmailAddress')
         	};
		errorList.push(e);
    }
    if (!userAPI.getPassword()) {
         var e = {
					status: VALIDATE.FAIL,
					error: utils.formatText(VALIDATE.REQUIRED, 'password')
         	};
		errorList.push(e);
    }
   	if (errorList.length) {
		  throw {
		    status: REQUEST_CODES.FAIL,
		    error: errorList
		  };
	}  else {
		var userModel = new UserModel(userAPI);
	    mongoUtils.getNextSequence('userId', function(oSeq) {
			userModel.userId = oSeq;
			userModel.save(function(error) {
				if (error) {
					callback({
							  status: DB_CODES.FAIL,
							  error: error
					});
					return;
				} else {
					callback({
							  status: REQUEST_CODES.SUCCESS,
							  result: [utils.formatText(USER_CODES.CREATE_SUCCESS, userModel.userId)]
					});
					return;							
				}
	   		});
	   	});
	}
}

function getDetails(userId, callback) {
	UserModel.find({'userId': userId}, function(error, userRecords) {
		if (error) {
			callback({
				status: DB_CODES.FAIL,
				error: error
			});
			return;
		} else {
			userRecords = userRecords.map(function(userRecord) {
				return new UserController.UserAPI(userRecord);
			});
			callback({
				status: REQUEST_CODES.SUCCESS,
				result: userRecords
			});
			return;
		}
	});
}

function getList(query, callback) {
	UserModel.find(query, function(error, userRecords) {
		if (error) {
			callback({
				status: DB_CODES.FAIL,
				error: error
			});
			return;
		} else {
			userRecords = userRecords.map(function(userRecord) {
				return new UserController.UserAPI(userRecord);
			});
			callback({
				status: REQUEST_CODES.SUCCESS,
				result: userRecords
			});
			return;
		}
	});
}

function login(user, callback) {
	var userAPI = UserController.UserAPI(user);
	var errorList = [];
	if (!userAPI.getEmailAddress()) {
         var e = {
					status: VALIDATE.FAIL,
					error: utils.formatText(VALIDATE.REQUIRED, 'EmailAddress')
         	};
		errorList.push(e);
    }
    if (!userAPI.getPassword()) {
         var e = {
					status: VALIDATE.FAIL,
					error: utils.formatText(VALIDATE.REQUIRED, 'password')
         	};
		errorList.push(e);
    }

    if (errorList.length) {
		  throw {
		    status: REQUEST_CODES.FAIL,
		    error: errorList
		  };
	} else {
		var query = {emailAddress: userAPI.getEmailAddress(), password: utils.encryptText(userAPI.getPassword())};
		UserModel.find(query, function(error, userRecords) {
			if (error) {
				callback({
					status: DB_CODES.FAIL,
					error: error
				});
				return;
			} else if (userRecords && userRecords.length){
				delete userRecords[0].password;
				userRecords = userRecords.map(function(userRecord) {
					return new UserController.UserAPI(userRecord);
				});
				callback({
					status: REQUEST_CODES.SUCCESS,
					result: userRecords
				});
				return;			     
			} else {
				callback({
					status: REQUEST_CODES.FAIL,
					error: USER_CODES.LOGIN_FAIL
				});
				return;
			}
		});
	}	
}

module.exports.getList = getList;