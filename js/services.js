const reqHandler = new ReqHandler();

var base64String;
var userObj;
var selectedBookId;
var idx;
var books = [];

function login() {
	var user = {
    	"emailAddress": $("#emailAddress").val(),
    	"password": $("#password").val()
    };
    
    if (user.emailAddress && user.password) {
		reqHandler.post({url:"/login", data:user}, function(resp){
		   if(resp.status == "Success" ){
		     var user = resp.result[0];
		     $.session.set("token", user.token);
		     $.session.set("userId", user.userId);
		     $.session.set("emailAddress", user.emailAddress);
		     $.session.set("userName", user.userName);
		     $.session.set("phoneNumber", user.phoneNumber);
		     $("#errMsg").html('');
		     window.location.href = '/home';
		   } else{
		        $("#errMsg").html(JSON.stringify(resp.error));
		    }
		});
	} else {
		$("#errMsg").html('emailAddress and password are mandatory');
	}
}
