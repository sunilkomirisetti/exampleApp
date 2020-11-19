function emailValidator(value) {
	if (value) {
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {  
			return true; 
		} 
		return false;
	} else {
		return false;
	}
}

function getSumeOfObj(jsonObj) {
	var total = 0;
	Object.keys(jsonObj).forEach(function(key) {
      	if (jsonObj[key])
        total = total + parseInt(jsonObj[key]);
    });
    return total;
}

function deriveIdFromSuccessMessage (message) {
	return message.substr(message.lastIndexOf(' ') + 1);
}

function isInt(value) {
  return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
}

function isNumeric(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

function timeDifference(current, previous) {    
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
    
    var elapsed = current - previous;
    
    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' seconds ago';   
    } else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    } else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    } else if (elapsed < msPerMonth) {
         return Math.round(elapsed/msPerDay) + ' days ago';   
    } else if (elapsed < msPerYear) {
         return Math.round(elapsed/msPerMonth) + ' months ago';   
    } else {
         return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}
