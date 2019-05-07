window.onload = function(){
    if(document.getElementById("loginState").innerHTML == 1){
        alert("Failed to login");
    }
    document.getElementById("Login").onclick = function () {
    //type check &callpost
        if(document.getElementById("username").value != ''){
            if(document.getElementById("password").value != ''){
                document.getElementById("callpost").click();
            }
            else{
                alert("You need to fill the username");
            }
        }
        else{
            alert("You need to fill the password");
        }
    };
};