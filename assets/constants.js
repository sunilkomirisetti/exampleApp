const CONSTANTS = {
					"DATABASE_CODES": {
						"FAIL": "Error in Database"
					},
					"MIN_VALUE": "1000",
					"MAX_VALUE": "9999",
					"REQUEST_CODES": {
						"SUCCESS": "Success",
						"FAIL": "Error in Request",
						"WARNING": "Warning"
					 },
					 "PAGE_ACTIONS": ["Browse", "Submit", "Fetch"],
					"USER": {
						"CREATE_SUCCESS": "User created successfully with userId {0}",
						"DELETE_SUCCESS": "User with userId {0} removed successfully",
						"UPDATE_SUCCESS": "User with userId {0} updated successfully",
						"UPDATE_FAIL": "User with userId {0} not updated successfully",
						"LOGIN_FAIL": "Invalid username or password given"
					},
					"CONFIG": {
						"CREATE_SUCCESS": "Configuration created successfully with configId {0}",
						"DELETE_SUCCESS": "Configuration with configId {0} removed successfully",
						"UPDATE_SUCCESS": "Configuration with configId {0} updated successfully",
						"UPDATE_FAIL": "Configuration with configId {0} not updated successfully"
					},
					"VALIDATE": {
						"FAIL": "Validation Error",
						"FIELD_VALUE_INVALID": "field {0} value is invalid",
						"REQUIRED": "field '{0}' is required.",
						"NO_ACCESS": "User has no access to perform this action",
						"NOT_A_DATE": "field {0} is incorrect UTC Date",
						"NOT_AN_EMAIL": "field '{0}' is invalid email address",
						"NOT_A_PHONE": "field {0} is invalid phone value",
						"NOT_A_MOBILE_PHONE": "{0} is not a valid mobile phone value for field {1}",
						"NOT_A_INTEGER": "{0} is not a valid integer value for field {1}",
						"NOT_A_NUMBER": "field {0} is invalid number value",
						"NOT_A_VALUE": "field {0} can't be empty.",
						"NOT_A_VALID_GENDER":  "{0} is not a valid gender type.",
						"VALUE_TOO_BIG": "field {0} data is too large"
					}
				};

module.exports.CONSTANTS = CONSTANTS;
