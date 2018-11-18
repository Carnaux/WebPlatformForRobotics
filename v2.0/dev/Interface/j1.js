var config;
var database;
var valor;
var a = 0;
function Init(){// Initialize Firebase
    config = {
		apiKey: "------",
		databaseURL: "----",
		projectId: "---",
		storageBucket: "----",
		messagingSenderId: "---"
		};
		firebase.initializeApp(config);
  // Get a reference to the database service
  
    var time = setInterval(leitura, 300);
  
}

function leitura(){
  document.getElementById("batata").innerHTML = involt.pin.P[13];
  
}


function writeUserData() {
    firebase.database().ref('hack/teste').set({
      valor: a
    });
    a++;
   
  }

  

  window.onload = Init;
