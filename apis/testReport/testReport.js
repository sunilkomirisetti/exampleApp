const fs = require('fs');


module.exports = function(app) {    
    app.get('/testReport/:configId', async function(req, res) {
		try {
			createAndRunScript(req.params.configId, function(response) {
				//res.json(response);
				var file = response.filePath;
				var fileName = response.fileName;
				console.log("**************");
				console.log(file, fileName);
				console.log("**************");
				res.setHeader('Content-disposition', 'attachment; filename=' + fileName.substr(fileName.lastIndexOf('/') + 1) );
				res.cookie('fileName', fileName);
				res.setHeader('Content-type', 'application/' + fileName.substr(fileName.lastIndexOf('.') + 1));						
				
				if (fs.existsSync(file)) {
					/*var bitmap = fs.readFileSync(file);
					// convert binary data to base64 encoded string
					var response = {
						status: REQUEST_CODES.SUCCESS,
						result: [new Buffer(bitmap).toString('base64')]
					};
					res.json(response);*/

					var filestream = fs.createReadStream(file);
  					filestream.pipe(res);
				} else {
					console.log('file not exists ::');
					res.json('');
				}
			});
		} catch(e) {
			res.json(e);
		}
	});
}

const utils = require('../../assets/utils').utils;
const CONSTANTS = utils.CONSTANTS;
const DB_CODES = CONSTANTS.DATABASE_CODES;
const REQUEST_CODES = CONSTANTS.REQUEST_CODES;
const VALIDATE = utils.CONSTANTS.VALIDATE;
const mongoUtils = utils.mongoUtils;

const URL = require('url');
const Excel = require('exceljs');
const workbook = new Excel.Workbook();
const worksheet = workbook.addWorksheet("My Sheet");

const Config = require('../config/config');
const ScriptUtil = require('../scriptGen/scriptGen');

function createAndRunScript(configId, callback) {
	Config.getDetails(configId, function(response) {
		if (response.error) {
			callback(response);
			return;
		} else {
			let configObj = response.result[0];
			if (configObj) {
				console.log('configObj :: ', configObj);
				ScriptUtil.runScript(configObj, function(response) {
					let fileName;
					let filePath = './uploads';
					let counter = 1;
					let currentRow = 0;
					let startRow = 1;

					let date = new Date();
					let yyyy = date.getFullYear().toString(),
					    MM = ("0" + (date.getMonth() + 1)).slice(-2),
					    dd = ("0" + (date.getDate())).slice(-2),
					    hh = (" 0" + (date.getHours())).slice(-2) + ('_'),
					    mm = ("0" + (date.getMinutes())).slice(-2) + '_',
					    ss = ("0" + (date.getSeconds())).slice(-2);

					fileName = "./" + yyyy + MM + dd+  hh + mm + ss + ".xlsx";
					filePath = filePath + fileName;
					worksheet.columns = [
					  {header: 'S.No.', key: 'sNo', width: 10, wrapText: true},
					  {header: 'Request URL', key: 'requestUrl', width: 100, wrapText: true},
					  {header: 'Request Type', key: 'requestType', width: 10, wrapText: true},
					  {header: 'Request Headers', key: 'requestHeaders', width: 90, wrapText: true}, 
					  {header: 'Request Post Data', key: 'requestPostData', width: 50, wrapText: true},
					  {header: 'Request Queryparams', key: 'requestQueryParams', width: 100, wrapText: true},
					  {header: 'Response Headers', key: 'responseHeaders', width: 90, wrapText: true}, 
					  {header: 'Response Size', key: 'responseSize', width: 30, wrapText: true},
					  {header: 'Response Body', key: 'responseBody', width: 100, wrapText: true}
					];
					currentRow = currentRow + 1;
					startRow = startRow + 1;

					if (response.result && response.result.length) {
						//script captured data-- iterate it and build report file

        		       	workbook.xlsx.writeFile(fileName)
        		         .then(() => {
   			        	  	callback({
     								fileName: fileName,
     								filePath: fileName
     							});
        		           return;
        		       }).catch(error => {
							console.log('before sending response :: EXCEPTION', error);              
			        	  	callback({
  								fileName: fileName,
  								filePath: fileName
  							});
  							return;
						});
        		       	return;
					} else {
						//no data captured -- send empty file

        		       	workbook.xlsx.writeFile(filePath)
        		         .then(() => {
   			        	  	callback({
     								fileName: fileName,
     								filePath: filePath
     							});
        		           return;
        		       }).catch(error => {
							console.log('before sending response :: EXCEPTION', error);              
			        	  	callback({
  								fileName: fileName,
  								filePath: filePath
  							});
  							return;
						});
        		       	return;
					}
				});				
			} else {
				callback({
					status: REQUEST_CODES.SUCCESS,
					result:['No configuration found for given Id']
				})
			}
		}
	})
} 