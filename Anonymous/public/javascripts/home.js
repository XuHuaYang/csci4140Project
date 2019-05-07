window.onload = function(){
	var logoutBut = document.getElementById("logout");
	
	if(logoutBut != null){
		logoutBut.onclick = function () {
	    	// document.getElementById("logoutInput").value = 0;
	    	document.getElementById("callpost").click();
		};
	}
};


