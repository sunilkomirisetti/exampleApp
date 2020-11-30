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
				ScriptUtil.runScript(configObj, function(response) {
					let fileName;
					let filePath = './';
					let counter = 1;
					let currentRow = 0;
					let startRow = 1;

					let date = new Date();
					let yyyy = date.getFullYear().toString(),
					    MM = ("0" + (date.getMonth() + 1)).slice(-2),
					    dd = ("0" + (date.getDate())).slice(-2),
					    hh = (" 0" + (date.getHours())).slice(-2) + ('-'),
					    mm = ("0" + (date.getMinutes())).slice(-2) + '-',
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
					let result = response.result;
					if (result && result.length) {
						console.log('captured data :: ', result);
						//script captured data-- iterate it and build report file
						let lastIndex = result.length;
						console.log('lastIndex :: ' + lastIndex);
						result.forEach(function(obj) {
							let index = 1;
							let queryParams = obj.queryParams;
							if (obj.queryParams) {
								let lastQueryParamIndex = Object.keys(obj.queryParams).length;
								console.log('lastQueryParamIndex :: ', lastQueryParamIndex);
								(async() => {
									Object.keys(obj.queryParams).forEach(function(param) {
										if (1 == index) {
										  worksheet.addRow({'sNo': counter ++, 'requestUrl': obj.requestUrl, 'requestType': obj.requestType, 'requestHeaders':  JSON.stringify(obj.requestHeaders, null, 2) + '', 'requestPostData': JSON.stringify(obj.requestPostData, null, 2), 'requestQueryParams': param + ' : ' + queryParams[param], 'responseHeaders': JSON.stringify(obj.responseHeaders, null, 2) + '', 'responseSize': obj.responseSize + '', responseBody: JSON.stringify(obj.responseBody, null, 2) + ''});
										  index = index + 1;
										  currentRow = currentRow + 1;
										} else {
										  worksheet.addRow({'sNo': '', 'requestUrl': '', 'requestType': '', 'requestHeaders':  '', 'requestPostData': '', 'requestQueryParams': param + ' : ' + queryParams[param], 'responseHeaders': '', 'responseSize': '', responseBody: ''});
										  currentRow = currentRow + 1;
										  index = index + 1;
										}          
									});
								})();
							  // merge by start row, start column, end row, end column
							  	try {
							  		worksheet.mergeCells(startRow, 1, currentRow, 1);
							  		worksheet.mergeCells(startRow, 2, currentRow, 2);
							  		worksheet.mergeCells(startRow, 3, currentRow, 3);
							  		worksheet.mergeCells(startRow, 4, currentRow, 4);
							  		worksheet.mergeCells(startRow, 5, currentRow, 5);
							  		worksheet.mergeCells(startRow, 7, currentRow, 7);
							  		worksheet.mergeCells(startRow, 8, currentRow, 8);
							  		startRow = startRow + index - 1;
							  	} catch(e) {console.log('error happening while merging :: ', startRow, currentRow);}
							    
							    lastIndex = lastIndex - 1;
							    console.log('lastIndex :: ' + lastIndex);
							    if (lastIndex <= 0) {
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
							    }
							} else if (obj.requestPostData) {
							  console.log('POST ::: ');
							  //Logic to be added for post
							  let requestBody = obj.requestPostData.split('&');
							  requestBody.forEach(function(param) {
							    if (1 == index) {
							      worksheet.addRow({'sNo': counter ++, 'requestUrl': obj.requestUrl, 'requestType': obj.requestType, 'requestHeaders':  JSON.stringify(obj.requestHeaders, null, 2), 'requestPostData': param.substring(0, param.indexOf('=')) + ' : ' + param.substring(param.indexOf('=') + 1), 'requestQueryParams': '', 'responseHeaders': JSON.stringify(obj.responseHeaders, null, 2), 'responseSize': obj.responseSize, responseBody: JSON.stringify(obj.responseBody, null, 2)});
							      index = index + 1;
							      currentRow = currentRow + 1;
							    } else {
							      worksheet.addRow({'sNo': '', 'requestUrl': '', 'requestType': '', 'requestHeaders':  '', 'requestPostData': param.substring(0, param.indexOf('=')) + ' : ' + param.substring(param.indexOf('=') + 1), 'requestQueryParams': '', 'responseHeaders': '', 'responseSize': '', responseBody: ''});
							      currentRow = currentRow + 1;
							      index = index + 1;
							    }          
							  });
							  try {
  							  		worksheet.mergeCells(startRow, 1, currentRow, 1);
  							  		worksheet.mergeCells(startRow, 2, currentRow, 2);
  							  		worksheet.mergeCells(startRow, 3, currentRow, 3);
  							  		worksheet.mergeCells(startRow, 4, currentRow, 4);
  							  		worksheet.mergeCells(startRow, 5, currentRow, 5);
  							  		worksheet.mergeCells(startRow, 7, currentRow, 7);
  							  		worksheet.mergeCells(startRow, 8, currentRow, 8);
  							  		startRow = startRow + index - 1;
  							  	} catch(e) {console.log('error happening while merging :: ', startRow, currentRow);}
							  startRow = startRow + index - 1;
						    lastIndex = lastIndex - 1;
						    console.log('lastIndex :: ' + lastIndex);
						    if (lastIndex <= 0) {
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
						    }

							} else {
							  worksheet.addRow({'sNo': counter ++, 'requestUrl': obj.requestUrl, 'requestType': obj.requestType, 'requestHeaders':  JSON.stringify(obj.requestHeaders, null, 2), 'requestPostData': JSON.stringify(obj.requestPostData, null, 2), 'requestQueryParams': JSON.stringify(obj.queryParams, null, 2), 'responseHeaders': JSON.stringify(obj.responseHeaders, null, 2), 'responseSize': obj.responseSize, 'responseBody': JSON.stringify(obj.responseBody, null, 2)});
							    startRow = startRow + index - 1;
    						    lastIndex = lastIndex - 1;
    						    if (lastIndex <= 0) {
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
    						    }
							}
						});
					} else {
						//no data captured -- send empty file
						console.log('no result object found');
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
