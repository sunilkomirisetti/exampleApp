module.exports = function(app) {    
    app.post('/config',function(req, res){
		try{
			create(req.body, function(response){
				res.json(response);
			});

		}catch(e){
		 res.json(e);
		}
    });
    app.get('/config/:configId', function(req, res) {
		try {
			getDetails(req.params.configId, function(response) {
				res.json(response);
			});
		} catch(e) {
			res.json(e);
		}
	});
}

const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const ConfigSchema = new Schema(require('./configSchema').configSchema, {collection: 'config'});
const ConfigModel = mongoose.model('config', ConfigSchema);
const ConfigController = require('./configController');

const utils = require('../../assets/utils').utils;
const CONSTANTS = utils.CONSTANTS;
const DB_CODES = CONSTANTS.DATABASE_CODES;
const REQUEST_CODES = CONSTANTS.REQUEST_CODES;
const CONFIG_CODES = utils.CONSTANTS.CONFIG;
const VALIDATE = utils.CONSTANTS.VALIDATE;
const mongoUtils = utils.mongoUtils;



function create(config, callback) {
	let configAPI = ConfigController.ConfigAPI(config);
    let errorList = [];
    if (!configAPI.getConfigName()) {
       	let e = {
				status: VALIDATE.FAIL,
				error: utils.formatText(VALIDATE.REQUIRED, 'configName')
           
		};
		errorList.push(e);
    }
	if (!configAPI.getCreatedBy()) {
         	let e = {
				status: VALIDATE.FAIL,
				error: utils.formatText(VALIDATE.REQUIRED, 'createdBy')
            
		};
		errorList.push(e);
    }
    if (!configAPI.getStatus()) {
         let e = {
					status: VALIDATE.FAIL,
					error: utils.formatText(VALIDATE.REQUIRED, 'status')
         	};
		errorList.push(e);
    }
    let pageObjects = configAPI.getPageObjects();
    if (!pageObjects.length) {
         let e = {
					status: VALIDATE.FAIL,
					error: utils.formatText(VALIDATE.REQUIRED, 'pageObjects')
         	};
		errorList.push(e);
    } else {
    	pageObjects.forEach(function(pageObject) {
    		if (!pageObject.pageAction) {
				let e = {
						status: VALIDATE.FAIL,
						error: utils.formatText(VALIDATE.REQUIRED, 'pageAction')
					};
				errorList.push(e);
    		}
    		if (!pageObject.captureMethods) {
				let e = {
						status: VALIDATE.FAIL,
						error: utils.formatText(VALIDATE.REQUIRED, 'captureMethods')
					};
				errorList.push(e);
    		}
    		if (!pageObject.captureURLs) {
				let e = {
						status: VALIDATE.FAIL,
						error: utils.formatText(VALIDATE.REQUIRED, 'captureURLs')
					};
				errorList.push(e);
    		}
    		if (!pageObject.pageURL) {
				let e = {
						status: VALIDATE.FAIL,
						error: utils.formatText(VALIDATE.REQUIRED, 'pageURL')
					};
				errorList.push(e);
    		}
    		if (!pageObject.pageIndex) {
				let e = {
						status: VALIDATE.FAIL,
						error: utils.formatText(VALIDATE.REQUIRED, 'pageIndex')
					};
				errorList.push(e);
    		}
    		//formData is not mandatory -- key, value, type
    		//actionEventId not mandatory
    	});
    }
   	if (errorList.length) {
		  throw {
		    status: REQUEST_CODES.FAIL,
		    error: errorList
		  };
	}  else {
		let configModel = new ConfigModel(configAPI);
	    mongoUtils.getNextSequence('configId', function(oSeq) {
			configModel.configId = oSeq;
			configModel.dateCreated = utils.getSystemTime();
			configModel.save(function(error) {
				if (error) {
					callback({
							  status: DB_CODES.FAIL,
							  error: error
					});
					return;
				} else {
					callback({
							  status: REQUEST_CODES.SUCCESS,
							  result: [utils.formatText(CONFIG_CODES.CREATE_SUCCESS, configModel.configId)]
					});
					return;							
				}
	   		});
	   	});
	}
}

function getDetails(configId, callback) {
	ConfigModel.find({'configId': configId}, function(error, configRecords) {
		if (error) {
			callback({
				status: DB_CODES.FAIL,
				error: error
			});
			return;
		} else {
			configRecords = configRecords.map(function(configRecord) {
				return new ConfigController.ConfigAPI(configRecord);
			});
			callback({
				status: REQUEST_CODES.SUCCESS,
				result: configRecords
			});
			return;
		}
	});
}

module.exports.getDetails = getDetails;