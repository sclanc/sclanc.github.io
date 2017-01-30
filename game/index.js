function createGrid(size) {
   var game =  window.open("game.html");
   
  setTimeout(function() {
      game.postMessage(size,"*");
  }, 2000); 
      
}

function validatePassword() {
    var name = document.getElementById("name").value;
    var password = document.getElementById("password").value;
    var data = "userName=" + name + "&password=" + password;
    var localRequest = new XMLHttpRequest();
    localRequest.open("POST", "http://universe.tc.uvu.edu/cs2550/assignments/PasswordCheck/check.php", false);
    localRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    localRequest.send(data);
    if (localRequest.status == 200) {
        var dataDiv = document.getElementById("data4Div");
        var responseJson = JSON.parse(localRequest.responseText);
        if(responseJson.result == "valid") {
            var localStorageString = responseJson.userName + " " + responseJson.timestamp;
            localStorage.setItem('cs2550timestamp', localStorageString);
            createGrid(5);
        }
        else {
            alert("Username or Password are Incorect.")
        }
    }
    else {
        alert("Could not make request.")
    }
}