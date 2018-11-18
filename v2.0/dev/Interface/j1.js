var config;
var database;
var valor;
var a = 0;
function Init(){// Initialize Firebase
    config = {
		apiKey: "AIzaSyC2Lhzr1gryBRNSe5Hjzz_2kHHQaFGWxGQ",
		databaseURL: "https://hack-6d4d3.firebaseio.com",
		projectId: "hack-6d4d3",
		storageBucket: "",
		messagingSenderId: "142327007764"
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