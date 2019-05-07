window.onload = function(){
    if(document.getElementById("registerState").innerHTML == 1){
        alert("Username repeated");
    }
    document.getElementById("register").onclick = function () {
    //type check &callpost
        if(document.getElementById("username").value != ''){
            if(document.getElementById("password").value != ''){
                if(document.getElementById("Comfirmpassword").value != ''){
                    if(document.getElementById("Comfirmpassword").value == document.getElementById("password").value){
                        document.getElementById("callpost").click();
                    }
                    else{
                        alert("password comfirm failed");
                    }
                }
                else{
                    alert("You need to comfirm the password");
                }
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