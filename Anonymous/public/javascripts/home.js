window.onload = function(){
	var logoutBut = document.getElementById("logout");
	
	if(logoutBut != null){
		logoutBut.onclick = function () {
	    	// document.getElementById("logoutInput").value = 0;
	    	document.getElementById("callpost").click();
		};
	}

	// var set = document.getElementById("set");
	// set.onclick = function(){
	// 	var abcd = document.getElementById("session").value;
	// 	sessionStorage.abc = abcd;
		
	// }
	// console.log(sessionStorage.abc);
};


