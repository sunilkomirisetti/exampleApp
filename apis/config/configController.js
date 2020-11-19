const utils = require('../../assets/utils').utils;
const CONSTANTS = utils.CONSTANTS;
const REQUEST_CODES = CONSTANTS.REQUEST_CODES;
const VALIDATE = utils.CONSTANTS.VALIDATE;
const validate = utils.validate;

var Config = function() {
    return {
        configId: 0,
        configName: null,
        pageObjects: [],
        createdBy: 0,
        dateCreated: 0,
        updatedBy: 0,
        dateUpdated: 0,
        status: null
    }
};


function ConfigAPI(configRecord) {
    let configObj = new Config();

    configObj.getConfigId = function() {
        return this.configId;
    };
    configObj.setConfigId = function(configId) {
         if (configId) {
            if (validate.isInteger(configId + '')) {
                this.configId = configId;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, configId, 'configId')
                };
            }
        }
    };

    configObj.getConfigName = function() {
        return this.configName;
    };
    configObj.setConfigName = function(configName) {
        if (configName) {
            this.configName = configName;
        }
    };
    configObj.getPageObjects = function() {
        return this.pageObjects;
    };
    configObj.setPageObjects = function(pageObjects) {       
        if (pageObjects) {
                this.pageObjects = pageObjects;
        }
    };
    configObj.getCreatedBy = function() {
        return this.createdBy;
    };
    configObj.setCreatedBy = function(createdBy) {
         if (createdBy) {
            if (validate.isInteger(createdBy + '')) {
                this.createdBy = createdBy;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, createdBy, 'createdBy')
                };
            }
        }
    };
    configObj.getDateCreated = function() {
        return this.dateCreated;
    };
    configObj.setDateCreated = function(dateCreated) {
        if (dateCreated) {
            if (validate.isInteger(dateCreated + '')) {
                this.dateCreated = dateCreated;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, dateCreated, 'dateCreated')
                };
            }
        }
    };
    configObj.getUpdatedBy = function() {
        return this.updatedBy;
    };
    configObj.setUpdatedBy = function(updatedBy) {
        if (updatedBy) {
            if (validate.isNumber(updatedBy + '')) {
                this.updatedBy = updatedBy;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, updatedBy, 'updatedBy')
                };
            }
        }
    };
    configObj.getDateUpdated = function() {
        return this.dateUpdated;
    };
    configObj.setDateUpdated = function(dateUpdated) {      
        if (dateUpdated) {
            if (validate.isNumber(dateUpdated)) {
                this.dateUpdated = dateUpdated;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, dateUpdated, 'dateUpdated')
                };
            }
        }
    };
    configObj.getStatus = function() {
        return this.status;
    };
    configObj.setStatus = function (status) {
        if (status) {
            this.status = status;
        }
    };
    if (configRecord) {
        let errorList = [];
        try {
            configObj.setConfigId(configRecord.configId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            configObj.setConfigName(configRecord.configName);
        } catch (e) {
            errorList.push(e);
        }
        try {
            configObj.setPageObjects(configRecord.pageObjects);
        } catch (e) {
             errorList.push(e);
        }
        try {
            configObj.setCreatedBy(configRecord.createdBy);
        } catch (e) {
           errorList.push(e);
        }
        try {
            configObj.setDateCreated(configRecord.dateCreated);
        } catch (e) {
            errorList.push(e);
        }
        try {
            configObj.setUpdatedBy(configRecord.updatedBy);
        } catch (e) {
            errorList.push(e);
        }
        try {
            configObj.setDateUpdated(configRecord.dateUpdated);
        } catch (e) {
            errorList.push(e);
        }
        try {
            configObj.setStatus(configRecord.status);
        } catch (e) {
            errorList.push(e);
        }
        if (errorList.length) {
            throw {
                status: REQUEST_CODES.FAIL,
                error: errorList
            };
        }
    }
    return configObj;
}

module.exports.ConfigAPI = ConfigAPI;