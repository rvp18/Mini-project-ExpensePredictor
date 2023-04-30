// var firebaseConfig = {
//   apiKey: "AIzaSyAJ_j3Sur6uYkq7e2UfUEL7zWai3VhbTOw",
//   authDomain: "expenzo-32684.firebaseapp.com",
//   databaseURL: "https://expenzo-32684-default-rtdb.firebaseio.com",
//   projectId: "expenzo-32684",
//   storageBucket: "expenzo-32684.appspot.com",
//   messagingSenderId: "759661681988",
//   appId: "1:759661681988:web:ba9601a2d52bf1e2c38b11",
//   measurementId: "G-2PENH3LSPR"
// };

// firebase.initializeApp(firebaseConfig);

function generateSummaryReport() {


firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // Get the current user's ID
    var userId = user.uid

    
      firebase
        .database()
        .ref('users/' + userId + '/transactions')
        .on('value', function (snapshot) {
          var data = []

          snapshot.forEach(function (childSnapshot) {
            var categoryValue = childSnapshot.val().category
            var amountValue = childSnapshot.val().amount
            var currencyValue = childSnapshot.val().currency
            var dateValue = childSnapshot.val().date

            const d = new Date(dateValue)
            let month = d.getMonth()

            data.push({
              category: categoryValue,
              amount: amountValue,
              currency: currencyValue,
              date: dateValue,
              month: month
            })
          })

      

          // Create summary report HTML
          const summaryReport = document.createElement('div')

          summaryReport.id = "summary-report";

               // Category summary
              const categorySummary = document.createElement('div')
              categorySummary.innerHTML = '<h3>Category Summary</h3>'
              const categories = {}
              data.forEach(transaction => {
                const category = transaction.category
                const amount = parseInt(transaction.amount)
                if (isNaN(amount)) {
                  return // Skip this transaction if amount is not a valid integer
                }
                if (!categories[category]) {
                  categories[category] = 0
                }
                categories[category] += amount
              })
              let totalCategoryAmount = 0
              for (const category in categories) {
                let amount = 0
                data.forEach(transaction => {
                  if (transaction.category === category) {
                    const transactionAmount = parseInt(transaction.amount)
                    if (!isNaN(transactionAmount)) {
                      amount += transactionAmount
                    }
                  }
                })
                totalCategoryAmount += amount
                const categoryItem = document.createElement('p')
                categoryItem.textContent = category + ': ' + amount.toFixed(2)
                categorySummary.appendChild(categoryItem)
              }
              categorySummary.innerHTML += '<p><strong>Total: ' + totalCategoryAmount.toFixed(2) + '</strong></p>'
              summaryReport.appendChild(categorySummary)

              // Monthly summary
              const monthlySummary = document.createElement('div')
              monthlySummary.innerHTML = '<h3>Monthly Summary</h3>'
              const months = {}
              data.forEach(transaction => {
                const month = new Date(transaction.date).getMonth()
                const amount = parseInt(transaction.amount)
                if (isNaN(amount)) {
                  return // Skip this transaction if amount is not a valid integer
                }
                if (!months[month]) {
                  months[month] = 0
                }
                months[month] += amount
              })
              let totalMonthlyAmount = 0
              for (const month in months) {
                let amount = 0
                data.forEach(transaction => {
                  if (new Date(transaction.date).getMonth() == month) {
                    const transactionAmount = parseInt(transaction.amount)
                    if (!isNaN(transactionAmount)) {
                      amount += transactionAmount
                    }
                  }
                })
                totalMonthlyAmount += amount
                const monthItem = document.createElement('p')
                const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(2021, month))
                monthItem.textContent = monthName + ': ' + amount.toFixed(2)
                monthlySummary.appendChild(monthItem)
              }
              monthlySummary.innerHTML += '<p><strong>Total: ' + totalMonthlyAmount.toFixed(2) + '</strong></p>'
              summaryReport.appendChild(monthlySummary)

              // Total expenses
              const totalExpenses = document.createElement('div')
              totalExpenses.innerHTML = '<h3>Total Expenses</h3>'
              let totalAmount = 0
              let expenses = data.reduce((total, transaction) => {
                const amount = parseInt(transaction.amount)
                if (isNaN(amount)) {
                  return total // Skip this transaction if amount is not a valid integer
                }
                totalAmount += amount
                return total + amount
              }, 0)
              if (isNaN(expenses)) {
                expenses = 0 // Set expenses to 0 if it's not a valid integer
              }
              totalExpenses.innerHTML += '<p>You spent a total of ' + totalAmount.toFixed(2) + ' in the selected period.</p>'
              totalExpenses.innerHTML += '<p><strong>Total expenses: ' + expenses.toFixed(2) + '</strong></p>'
              summaryReport.appendChild(totalExpenses)




          // Print summary report to page
          const summaryReportDiv = document.getElementById('summary-report')
          summaryReportDiv.appendChild(summaryReport)
        })
    }})
  
  }

  window.onload = function() {
    generateSummaryReport();
  }