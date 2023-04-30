var firebaseConfig = {
  apiKey: 'AIzaSyAJ_j3Sur6uYkq7e2UfUEL7zWai3VhbTOw',
  authDomain: 'expenzo-32684.firebaseapp.com',
  databaseURL: 'https://expenzo-32684-default-rtdb.firebaseio.com',
  projectId: 'expenzo-32684',
  storageBucket: 'expenzo-32684.appspot.com',
  messagingSenderId: '759661681988',
  appId: '1:759661681988:web:ba9601a2d52bf1e2c38b11',
  measurementId: 'G-2PENH3LSPR'
}

//   firebase.initializeApp(firebaseConfig);

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

          const d = new Date()
          let month = d.getMonth()

          data.push({
            category: categoryValue,
            amount: amountValue,
            currency: currencyValue,
            date: dateValue,
            month: month
          })
        })
        
        // Pass data to Python backend for preprocessing and machine learning
        fetch('/rvp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: data })
        })
          .then(function (response) {
            if (!response.ok) {
              throw new Error('Network response was not ok')
            }
            return response.json()
          })
          .then(function (result) {
            // Display the predicted expenses using Chart.js

            // Create a new canvas element to hold the chart
            var canvas = document.createElement('canvas')
            canvas.setAttribute('id', 'predicted-expenses-chart')
            var chartContainer = document.querySelector(
              '.predicted_expenses_chart_container'
            )
            chartContainer.appendChild(canvas)

            // Format the predicted data into an array of labels and values
            var labels = Object.keys(result)
            var values = Object.values(result)

            var colors = [
              'rgba(255, 99, 132, 0.5)', // red
              'rgba(54, 162, 235, 0.5)', // blue
              'rgba(255, 206, 86, 0.5)', // yellow
              'rgba(75, 192, 192, 0.5)', // green
              'rgba(153, 102, 255, 0.5)' // purple
            ];

            // Set up the chart configuration
            var config = {
              type: 'bar',
              data: {
                labels: labels,
                datasets: [
                  {
                    label: 'Predicted Expenses for next month',
                    data: values,
                    borderColor: 'blue',
                    fill: true,
                    backgroundColor: colors
                  }
                ]
              },
              options: {
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top'
                  },
                  title: {
                    display: true,
                    text: 'Predicted Expenses'
                  }
                }
              }
            }

            // Create a new Chart.js chart using the configured options
            var chart = new Chart(canvas, config)
          })

        //----------------------------pg end here---------------------------------------------------------------------//


            fetch('/rvp3', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ data: data })
            })
            .then(response => response.json())
            .then(data => {
              var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Month 13', 'Month 14', 'Month 15', 'Month 16', 'Month 17', 'Month 18'],
        datasets: [{
          label: 'Predicted Expenses',
          data: data.predictions,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
              });
            });
      })
  }
})
