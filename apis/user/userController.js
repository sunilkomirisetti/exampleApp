var utils = require('../../assets/utils').utils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var VALIDATE = utils.CONSTANTS.VALIDATE;
var validate = utils.validate;

var User = function() {
    return {
        userId: 0,
        userName: null,
        phoneNumber: null,
        emailAddress: null,
        password: null
    };
};

function UserAPI(userRecord) {
    let user = new User();

    user.getUserId = function() {
        return this.userId;
    };
    user.setUserId = function(userId) {
        if (userId) {
            if (validate.isInteger(userId + '')) {
                    this.userId = userId;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, userId, 'userId')
                };
            }
        }
    };
    user.getUserName = function() {
        return this.userName;
    };
    user.setUserName = function(userName) {
         if (userName) {
            if (userName.length <= 50) {
                this.userName = userName;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.VALUE_TOO_BIG, userName, 'userName')
                };
            }
        }
    };
    user.getPhoneNumber = function() {
        return this.phoneNumber;
    };
    user.setPhoneNumber = function(phoneNumber) {
        if (phoneNumber) {
            if (phoneNumber.length <= 15) {
                this.phoneNumber = phoneNumber;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.VALUE_TOO_BIG, phoneNumber, 'phoneNumber')
                };
            }
        }
    };
    user.getEmailAddress = function() {
        return this.emailAddress;
    };
    user.setEmailAddress = function(emailAddress) {
        if (emailAddress) {
            this.emailAddress = emailAddress;
        }
    };
    user.getPassword = function() {
        return this.password;
    };
    user.setPassword = function(password) {
        if (password) {
            this.password = password;
        }
    };
   
    if (userRecord) {
        var errorList = [];
        try {
            user.setUserId(userRecord.userId);
         } catch (e) {
            errorList.push(e);
        }
        try {
            user.setUserName(userRecord.userName);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setPhoneNumber(userRecord.phoneNumber);
        } catch (e) {
           errorList.push(e);
        }
        try {
            user.setEmailAddress(userRecord.emailAddress);
        } catch (e) {           
            errorList.push(e);
        }
        try {
            user.setPassword(userRecord.password);
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
    return user;
}

module.exports.UserAPI = UserAPI;