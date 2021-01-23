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

function callConfigAPI(){
    reqHandler.get({url:"/ui/query/config?createdBy="+$.session.get('userId')}, function(resp){
        if(resp.status == "Success"){
            console.log(resp.result);
            loadAgentVehicleGrid(resp.result);
        }else{
          showAlert(resp.status,  JSON.stringify(resp.error)+" !", "danger"); 
        }
    });
}

function loadAgentVehicleGrid(result){
    var dataList = [];
     //table.destroy();
     result.forEach(obj=>{
         var dataObj = [];
         dataObj.push(obj.configId);
         dataObj.push(obj.configName);
         dataObj.push(JSON.stringify(obj.pageObjects));
         dataObj.push(obj.status);
         //tempPolicyObj.push('<input type="checkbox" checked data-toggle="toggle" data-on="Ready" data-off="Not Ready" data-onstyle="success" data-offstyle="danger">');
         //tempVehicleObj.push("<button class='btn btn-primary' data-toggle='modal' data-target='.update-policy-vehicle' onclick='getVehicleInfoyByID("+JSON.stringify(obj)+")'><i class='fa fa-edit' aria-hidden='true'></i> &nbsp;&nbsp;Edit</button>");

         //dataObj.push("<button class='btn btn-primary' data-toggle='modal' data-target='.update-config' onclick='getConfig("+JSON.stringify(obj)+")'><i class='fa fa-edit' aria-hidden='true'></i> &nbsp;&nbsp;Edit</button><a class='btn btn-primary' href='/ui/filedownload/'"+obj.fileId+"''><i class="fa fa-download" aria-hidden="true"></i></a>&nbsp;&nbsp;");

                  dataObj.push('<a class="btn btn-primary" href="/testReport/'+obj.configId+'"><i class="fa fa-download" aria-hidden="true"></i></a>&nbsp;&nbsp;');

         dataList.push(dataObj);
     });
     table = $('#configTable').DataTable({
     	"scrollX": true,
     	"pagingType": "full_numbers",
     data: dataList,
     columns: [
         { title: "Config Id"},
         { title: "Config Name"},
         { title: "Page Objects" },
         { title: "Status" },
         { title: "Action" }
     ],
     "bDestroy": true
     });
}

function runConfig(configObj) {
	alert()
	reqHandler.get({url:"/testReport/" + configObj.configId}, function(resp){
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
}


function showAlert(icon, title, message, type){
    $.notify({
      icon: icon,
      title: '<strong>'+title+' !</strong>',
      message:  message
    }, {
      type: type,
      animate: {
        enter: 'animated fadeInRight',
        exit: 'animated fadeOutRight'
      },
      placement: {
        from: "bottom"
      }
    });
}


