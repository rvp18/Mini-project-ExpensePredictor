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
  
  
  // <------------------------------------------------------------------------------------------------------->
  
  
  const options = document.querySelectorAll(".option");
  const content = document.querySelectorAll(".content-item");
  
  options.forEach(option => {
    option.addEventListener("click", () => {
      options.forEach(opt => {
        opt.classList.remove("transaction_active");
      });
      option.classList.add("transaction_active");
      const optionId = option.getAttribute("id").slice(-1);
      content.forEach(c => {
        c.style.display = "none";
      });
      document.getElementById(`content${optionId}`).style.display = "block";
    });
  });
  
  // -----------------------------------------------------------------------------------------------------
  
  
  
  // Get the popup container
  var popup = document.querySelector(".form-container");

  // Get the button that opens the popup
  var openPopupButton = document.getElementById("add_transaction_btn");

  // Get the button that closes the popup
  var cancelTransactionButton = document.getElementById("transaction_cancel");

  // When the user clicks the button, show the popup
  openPopupButton.addEventListener("click", function() {
    popup.style.display = "block";
  });

  // When the user clicks on cancel, hide the popup
  cancelTransactionButton.addEventListener("click", function() {
    popup.style.display = "none";
  });

  

  //-----------------------------------------------------------------------------------------------------------------------------
  
  



  //--------------------------------------------------------------------------------------------------------------



      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // Get the current user's ID
          var userId = user.uid;

          

        //  _---------------------------------code for graph----------------------------------------------//

         firebase.database().ref("users/" + userId + "/transactions").on("value", function(snapshot) {
          var dates = [];
          var amounts = [];
        
          snapshot.forEach(function(childSnapshot) {
            var dateValue = childSnapshot.val().date;
            var amountValue = childSnapshot.val().amount;
        
            dates.push(dateValue);
            amounts.push(amountValue);
          });
        
          var ctx = document.getElementById("transaction_chart").getContext("2d");
          var chart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: dates,
              datasets: [{
                label: 'Amount',
                data: amounts,
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                fill: false,
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                xAxes: [{
                  type: 'time',
                  time: {
                    unit: 'day',
                  }
                }],
                yAxes: [{
                  ticks: {
                    beginAtZero: true,
                  }
                }]
              },
            },
          });
        });
        
        //-----------------------------------graph end here-------------------------//


        //-------------------start of pie chart----------------------------------------------//

        var canvas = document.getElementById("pie-chart");

        // Get the data from Firebase and process it
        firebase.database().ref("users/" + userId + "/transactions").on("value", function(snapshot) {
          categoryData = {};
          var categoryData = {};
          categoryData = {};
          snapshot.forEach(function(childSnapshot) {
            var categoryValue = childSnapshot.val().category;
            var amountValue = Number(childSnapshot.val().amount); // Convert to number

            if (categoryData[categoryValue]) {
              categoryData[categoryValue] += amountValue;
            } else {
              categoryData[categoryValue] = amountValue;
            }
          });
          
          // Convert the data to the format expected by Chart.js
          var chartData = {
            labels: Object.keys(categoryData),
            datasets: [{
              data: Object.values(categoryData),
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
                "#00E64D",
                "#FF99CC",
                "#6699FF",
                "#FF9933",
              ],
            }],
          };
          
          // Create the chart
          var chart = new Chart(canvas, {
            type: 'pie',
            data: chartData,
          });

          categoryData = {};
        });
        
        //---------------------end of pie chart-------------------------------------//

        //---------------------start of trasactions data show---------------------------------------//




         // Get references to the options and transaction boxes
         var option1 = document.getElementById("option1");
         var option2 = document.getElementById("option2");
         var option3 = document.getElementById("option3");
         var option4 = document.getElementById("option4");
         var customBox = document.querySelector(".custom_transaction_box");
         var lastMonthBox = document.querySelector(".last_month_transaction_box");
         var thisMonthBox = document.querySelector(".this_month_transaction_box");
         var futureBox = document.querySelector(".future_transaction_box");
 
         // Add event listeners to the options
         option1.addEventListener("click", function() {
           showTransactionBox(customBox);
         });
         option2.addEventListener("click", function() {
           showTransactionBox(lastMonthBox);
         });
         option3.addEventListener("click", function() {
           showTransactionBox(thisMonthBox);
         });
         option4.addEventListener("click", function() {
           showTransactionBox(futureBox);
         });
 
         // Function to show the selected transaction box and hide the others
         function showTransactionBox(boxToShow) {
           customBox.style.display = "none";
           lastMonthBox.style.display = "none";
           thisMonthBox.style.display = "none";
           futureBox.style.display = "none";
           boxToShow.style.display = "block";
         }





         firebase.database().ref("users/" + userId + "/transactions").on("value", function(snapshot) {

          

          var transactionBox = document.querySelector(".this_month_transaction_box");

          transactionBox.innerHTML="";
          // document.getElementById(loader).style.display="block";
          // transactionBox.innerHTML = "";
          var currentDate = new Date();
        
          snapshot.forEach(function(childSnapshot) {
            // console.log(userId);
            var categoryValue = childSnapshot.val().category;
            var amountValue = childSnapshot.val().amount;
            var currencyValue = childSnapshot.val().currency;
            var dateValue = childSnapshot.val().date;
            var receiptValue = childSnapshot.val().receipt;
            var noteValue = childSnapshot.val().note;
        
            // Parse the transaction date string into a Date object
            var transactionDate = new Date(dateValue);
        
            // Compare the month and year of the transaction date with the current month and year
            if (transactionDate.getMonth() === currentDate.getMonth() && transactionDate.getFullYear() === currentDate.getFullYear()) {
              // Capitalize the first letter of the category value
              categoryValue = categoryValue.charAt(0).toUpperCase() + categoryValue.slice(1);
        
              var transaction = document.createElement("div");
              transaction.classList.add("transaction");
        
              var h2 = document.createElement("h2");

        
              var categoryTextNode = document.createTextNode("  " + categoryValue);
        
              // Add icon based on category value
              var icon = document.createElement("i");
              icon.classList.add("fas");
        
              if (categoryValue === "Food") {
                icon.classList.add("fa-utensils");
              } else if (categoryValue === "Transportation") {
                icon.classList.add("fa-bus");
              } else if (categoryValue === "Entertainment") {
                icon.classList.add("fa-film");
              } else if (categoryValue === "Shopping") {
                icon.classList.add("fa-shopping-bag");
              } else if (categoryValue === "Other") {
                icon.classList.add("fa-question-circle");
              }
              h2.appendChild(icon);
              h2.appendChild(categoryTextNode);
        
              var span = document.createElement("span");
              span.textContent = amountValue + " " + currencyValue.toUpperCase();
              h2.appendChild(span);
        
              var p = document.createElement("span");
              p.classList.add("date");
              p.textContent = dateValue;

              var p2 = document.createElement("span");
              p2.classList.add("note");
              p2.textContent = " "+ " "+" "+ " "+" "+ " "+noteValue;
              

        
              var a = document.createElement("a");
              a.classList.add("receipt-link");
              a.textContent = "View receipt";
              a.style.textDecoration = "none";
              a.href = receiptValue;
              h2.appendChild(a);

              
        
              transaction.appendChild(h2);
              transaction.appendChild(p);
              p.appendChild(p2);
        
              transactionBox.appendChild(transaction);
              
        
              if (categoryValue=="Income") {
                h2.style.color = "green";
              } else {
                h2.style.color = "#FF6B6B";
              }
            }
          });
          // document.getElementById(loader).style.display="none";
        });
        

        
  //---------------------------------------------------------------------------------------------------------------------

  //for custom

  var customDateInput = document.getElementById("custom_date");
customDateInput.addEventListener("change", function() {

  


  var customDate = new Date(customDateInput.value);
  var transactionBox = document.querySelector(".custom_transaction_box");

  transactionBox.innerHTML="";

//   var elements = document.querySelectorAll(".custom_transaction_box");
// for (var i = 0; i < elements.length; i++) {
//   elements[i].innerHTML = "";
// }

  var currentDate = new Date();

  firebase.database().ref("users/" + userId + "/transactions").on("value", function(snapshot) {
    snapshot.forEach(function(childSnapshot) {


      var categoryValue = childSnapshot.val().category;
      var amountValue = childSnapshot.val().amount;
      var currencyValue = childSnapshot.val().currency;
      var dateValue = childSnapshot.val().date;
      var receiptValue = childSnapshot.val().receipt;
      var noteValue = childSnapshot.val().note;

      var transactionDate = new Date(dateValue);

      if (transactionDate.getFullYear() === customDate.getFullYear() &&
          transactionDate.getMonth() === customDate.getMonth() &&
          transactionDate.getDate() === customDate.getDate()) {

        categoryValue = categoryValue.charAt(0).toUpperCase() + categoryValue.slice(1);

        var transaction = document.createElement("div");
        transaction.classList.add("transaction");

        var h2 = document.createElement("h2");

        var categoryTextNode = document.createTextNode("  " + categoryValue);

        var icon = document.createElement("i");
        icon.classList.add("fas");

        if (categoryValue === "Food") {
          icon.classList.add("fa-utensils");
        } else if (categoryValue === "Transportation") {
          icon.classList.add("fa-bus");
        } else if (categoryValue === "Entertainment") {
          icon.classList.add("fa-film");
        } else if (categoryValue === "Shopping") {
          icon.classList.add("fa-shopping-bag");
        } else if (categoryValue === "Other") {
          icon.classList.add("fa-question-circle");
        }
        h2.appendChild(icon);
        h2.appendChild(categoryTextNode);

        var span = document.createElement("span");
        span.textContent = amountValue + " " + currencyValue.toUpperCase();
        h2.appendChild(span);

        var p = document.createElement("span");
        p.classList.add("date");
        p.textContent = dateValue;

        var p2 = document.createElement("span");
        p2.classList.add("note");
        p2.textContent = " "+ " "+" "+ " "+" "+ " "+noteValue;
        
        var a = document.createElement("a");
        a.classList.add("receipt-link");
        a.textContent = "View receipt";
        a.style.textDecoration = "none";
        a.href = receiptValue;
        h2.appendChild(a);

        transaction.appendChild(h2);
        transaction.appendChild(p);
        p.appendChild(p2);

        transactionBox.appendChild(transaction);

        if (categoryValue === "Income") {
          h2.style.color = "green";
        } else {
          h2.style.color = "#FF6B6B";
        }
      }
    });
  });

  customDateInput.value = ""; // Clear the input field
});


//--------------------------------------------------------------------------------------------------------------------------------//

  firebase.database().ref("users/" + userId + "/transactions").on("value", function(snapshot) {
      var transactionBox = document.querySelector(".last_month_transaction_box");

      transactionBox.innerHTML="";
      // transactionBox.innerHTML = "";
      var currentDate = new Date();
      var previousMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    
      snapshot.forEach(function(childSnapshot) {
        var categoryValue = childSnapshot.val().category;
        var amountValue = childSnapshot.val().amount;
        var currencyValue = childSnapshot.val().currency;
        var dateValue = childSnapshot.val().date;
        var receiptValue = childSnapshot.val().receipt;
        var noteValue = childSnapshot.val().note;
    
        // Parse the transaction date string into a Date object
        var transactionDate = new Date(dateValue);
    
        // Compare the month and year of the transaction date with the previous month and year
        if (
          transactionDate.getMonth() === previousMonthDate.getMonth() &&
          transactionDate.getFullYear() === previousMonthDate.getFullYear()
        ) {
          // Capitalize the first letter of the category value
          categoryValue = categoryValue.charAt(0).toUpperCase() + categoryValue.slice(1);
    
          var transaction = document.createElement("div");
          transaction.classList.add("transaction");
    
          var h2 = document.createElement("h2");
    
          var categoryTextNode = document.createTextNode("  " + categoryValue);
    
          // Add icon based on category value
          var icon = document.createElement("i");
          icon.classList.add("fas");
    
          if (categoryValue === "Food") {
            icon.classList.add("fa-utensils");
          } else if (categoryValue === "Transportation") {
            icon.classList.add("fa-bus");
          } else if (categoryValue === "Entertainment") {
            icon.classList.add("fa-film");
          } else if (categoryValue === "Shopping") {
            icon.classList.add("fa-shopping-bag");
          } else if (categoryValue === "Other") {
            icon.classList.add("fa-question-circle");
          }
          h2.appendChild(icon);
          h2.appendChild(categoryTextNode);
    
          var span = document.createElement("span");
          span.textContent = amountValue + " " + currencyValue.toUpperCase();
          h2.appendChild(span);
    
          var p = document.createElement("span");
          p.classList.add("date");
          p.textContent = dateValue;
    
          var p2 = document.createElement("span");
          p2.classList.add("note");
          p2.textContent = " " + " " + " " + " " + " " + noteValue;
    
          var a = document.createElement("a");
          a.classList.add("receipt-link");
          a.textContent = "View receipt";
          a.style.textDecoration = "none";
          a.href = receiptValue;
          h2.appendChild(a);
    
          transaction.appendChild(h2);
          transaction.appendChild(p);
          p.appendChild(p2);
    
          transactionBox.appendChild(transaction);
    
          if (categoryValue == "Income") {
            h2.style.color = "green";
          } else {
            h2.style.color = "#FF6B6B";
          }
        }
      });
    });

//--------------------------------------------------------------------------------------------------------------------------------//

firebase.database().ref("users/" + userId + "/transactions").on("value", function(snapshot) {

  var transactionBox = document.querySelector(".future_transaction_box");


  
  transactionBox.innerHTML = "";
  var currentDate = new Date();
  var futureTransactions = [];
  
  snapshot.forEach(function(childSnapshot) {
    var categoryValue = childSnapshot.val().category;
    var amountValue = childSnapshot.val().amount;
    var currencyValue = childSnapshot.val().currency;
    var dateValue = childSnapshot.val().date;
    var receiptValue = childSnapshot.val().receipt;
    var noteValue = childSnapshot.val().note;
    
    var transactionDate = new Date(dateValue);
    
    if (transactionDate > currentDate) {
      futureTransactions.push({
        category: categoryValue,
        amount: amountValue,
        currency: currencyValue,
        date: transactionDate,
        receipt: receiptValue,
        note: noteValue
      });
    }
  });
  
  futureTransactions.sort(function(a, b) {
    return a.date - b.date;
  });
  
  futureTransactions.forEach(function(transaction) {
    var categoryValue = transaction.category;
    var amountValue = transaction.amount;
    var currencyValue = transaction.currency;
    var dateValue = transaction.date.toLocaleDateString();
    var receiptValue = transaction.receipt;
    var noteValue = transaction.note;
    
    categoryValue = categoryValue.charAt(0).toUpperCase() + categoryValue.slice(1);
    
    var transactionElement = document.createElement("div");
    transactionElement.classList.add("transaction");
    
    var h2 = document.createElement("h2");
    
    var categoryTextNode = document.createTextNode("  " + categoryValue);
    
    var icon = document.createElement("i");
    icon.classList.add("fas");
    
    if (categoryValue === "Food") {
      icon.classList.add("fa-utensils");
    } else if (categoryValue === "Transportation") {
      icon.classList.add("fa-bus");
    } else if (categoryValue === "Entertainment") {
      icon.classList.add("fa-film");
    } else if (categoryValue === "Shopping") {
      icon.classList.add("fa-shopping-bag");
    } else if (categoryValue === "Other") {
      icon.classList.add("fa-question-circle");
    }
    h2.appendChild(icon);
    h2.appendChild(categoryTextNode);
    
    var span = document.createElement("span");
    span.textContent = amountValue + " " + currencyValue.toUpperCase();
    h2.appendChild(span);
    
    var p = document.createElement("span");
    p.classList.add("date");
    p.textContent = dateValue;
    
    var p2 = document.createElement("span");
    p2.classList.add("note");
    p2.textContent = " "+ " "+" "+ " "+" "+ " "+noteValue;
    
    var a = document.createElement("a");
    a.classList.add("receipt-link");
    a.textContent = "View receipt";
    a.style.textDecoration = "none";
    a.href = receiptValue;
    h2.appendChild(a);
    
    transactionElement.appendChild(h2);
    transactionElement.appendChild(p);
    p.appendChild(p2);
    
    transactionBox.appendChild(transactionElement);
    
    if (categoryValue=="Income") {
      h2.style.color = "green";
    } else {
      h2.style.color = "#FF6B6B";
    }
  });
});

   
//-----------------------------------------------------------------------------------------------------------------------



          // Get references to the form elements
          var transaction_form = document.querySelector("#transaction_form");
          var category = document.querySelector("#category");
          var amount = document.querySelector("#amount");
          var date = document.querySelector("#date");
          var currency = document.querySelector("#currency");
          var receipt = document.querySelector("#receipt");
          var note = document.querySelector("#note");
          var download_receipt_link = document.querySelector(".receipt-link");

          // Add a submit event listener to the form
          firebase.auth().onAuthStateChanged(function(user) {
            transaction_form.addEventListener("submit", function(event) {
              event.preventDefault();

              var user = firebase.auth().currentUser;

              // Get the current user's ID
              var userId = user.uid ;

              // Get the values from the form inputs
              var categoryValue = category.value;
              var amountValue = amount.value;
              var dateValue = date.value;
              var currencyValue = "INR";
              var receiptFile = receipt.files[0];
              var noteValue = note.value;

              // Upload the receipt file to Firestore
              var storageRef = firebase.storage().ref();
              
             
                // Get the download URL for the uploaded file
               
                  // Store the values in the Firebase database
                  firebase
                    .database()
                    .ref("users/" + userId + "/transactions/")
                    .push({
                      category: categoryValue,
                      amount: amountValue,
                      date: dateValue,
                      currency: currencyValue,
                      receipt: receiptFile,
                      note: noteValue
                    });


                  alert("Transaction added");
                  document.querySelector(".form-container").style.display = "none";

                  // Clear the form inputs
                  category.value = "";
                  amount.value = "";
                  date.value ="";
                  currency.value = "";
                  receipt.value = "";
                  note.value = "";
                });
              });
        }








//-----------------------------------------------------------------------------------------------------------------------

});



           