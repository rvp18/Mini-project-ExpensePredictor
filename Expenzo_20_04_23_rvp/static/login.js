document.getElementById("signin-link").addEventListener("click", function() {
    document.querySelector(".signup_container").style.display = "none";
    document.querySelector(".signin_container").style.display = "flex";
    // document.getElementById("signin-container").style.display = "none";
  });


document.getElementById("signup-link").addEventListener("click", function() {
    document.querySelector(".signup_container").style.display = "flex";
    document.getElementById("signin_container").style.display = "none";
  });




  //------------------------------------------------------------------------------------------------------------

  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyAJ_j3Sur6uYkq7e2UfUEL7zWai3VhbTOw",
    authDomain: "expenzo-32684.firebaseapp.com",
    databaseURL: "https://expenzo-32684-default-rtdb.firebaseio.com",
    projectId: "expenzo-32684",
    storageBucket: "expenzo-32684.appspot.com",
    messagingSenderId: "759661681988",
    appId: "1:759661681988:web:ba9601a2d52bf1e2c38b11",
    measurementId: "G-2PENH3LSPR"
  };

firebase.initializeApp(firebaseConfig);


//------------------------------------------------------------------------------------------------------------


document.getElementById("signup_btn").addEventListener("click", register);
function register(e){
    e.preventDefault();
    // Get the email and password from the form
    var email = document.getElementById("signup_email").value;
    var password = document.getElementById("signup_pwd").value;
    var confirmPassword = document.getElementById("signup_pwd_cnf").value;
    
    // Perform validation
    if (email === "" || password === "" || confirmPassword === "") {
        alert("Please fill in all fields.");
    } else if (!email.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i)) {
        alert("Please enter a valid email address.");
    } else if (!password.match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+=-])[A-Za-z\d!@#$%^&*()_+=-]{8,}$/)) {
        alert("Please enter a valid password. It must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*()_+=-).");
    } else if (password !== confirmPassword) {
        alert("Password and Confirm Password do not match.");
    
    // var email = document.getElementById("signup_email");
    // var password = document.getElementById("signup_pwd");
    // var confirmPassword = document.getElementById("signup_pwd_cnf");
    
    // // Reset error styles
    // email.style.borderColor = "";
    // email.title = "";
    // password.style.borderColor = "";
    // password.title = "";
    // confirmPassword.style.borderColor = "";
    // confirmPassword.title = "";
    
    // // Perform validation
    // if (email.value === "" || password.value === "" || confirmPassword.value === "") {
    //     alert("Please fill in all fields.");
    //     if (email.value === "") {
    //         email.style.borderColor = "red";
    //         email.title = "This field is required.";
    //     }
    //     if (password.value === "") {
    //         password.style.borderColor = "red";
    //         password.title = "This field is required.";
    //     }
    //     if (confirmPassword.value === "") {
    //         confirmPassword.style.borderColor = "red";
    //         confirmPassword.title = "This field is required.";
    //     }
    // } else if (!email.value.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i)) {
    //     // alert("Please enter a valid email address.");
    //     email.style.borderColor = "red";
    //     email.title = "Please enter a valid email address.";
    // } else if (!password.value.match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+=-])[A-Za-z\d!@#$%^&*()_+=-]{8,}$/)) {
    //     // alert("Please enter a valid password. It must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*()_+=-).");
    //     password.style.borderColor = "red";
    //     password.title = "Please enter a valid password. It must contain at least 8 characters, including at least one uppercase letter, one lowercase letter.";
    } else {
        // Form is valid, submit it or perform further actions
        var signup_email = document.getElementById("signup_email").value;
        var signup_password = document.getElementById("signup_pwd").value;
    
        // Register the new user in Firebase Authentication
        firebase.auth().createUserWithEmailAndPassword(signup_email, signup_password)
        .then(function() {
            alert("Successfully registered user!");
            document.getElementById("signin_form").reset();
        })
        .catch(function(error) {
            alert("Error registering user:", error);
        });
    
        document.getElementById("signup_email").innerHTML="";
        document.getElementById("signup_pwd").innerHTML="";
                    return true; // Allow form submission
    }



}


//------------------------------------------------------------------------------------------------------------




// Add a login event listener to the login button
document.getElementById("login_btn").addEventListener("click", login);
function login(e){
    e.preventDefault();

    var login_email = document.getElementById("log_email").value;
    var login_password = document.getElementById("log_pwd").value;

    // Sign in with email and password
    firebase.auth().signInWithEmailAndPassword(login_email, login_password)
        .then(function(user) {
            // User is signed in
            // alert("Logged in ", user.email);
            localStorage.setItem("loggedIn", "true");
            document.getElementById("signin_form").reset();

            window.location.href= "http://127.0.0.1:5000/home";
        })
        .catch(function(error) {
            // Handle errors
            alert("Something went wrong please try");
        });

    }




// if (localStorage.getItem("loggedIn") === "true") {
//     window.location.replace("home.html");
//   }
  