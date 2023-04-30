
// function showAccount() {
//     document.getElementById("account").style.display = "block";
//     document.getElementById("transactions").style.display = "none";
//     document.getElementById("reports").style.display = "none";
//     document.getElementById("share").style.display = "none";
//     // document.getElementById("user_icon").style.color = "#0093e9";
// }


function showTransactions() {
  // document.getElementById("account").style.display = "none";
  document.getElementById("transactions").style.display = "block";
  document.getElementById("reports").style.display = "none";
  document.getElementById("share").style.display = "none";
  document.getElementById("pg").style.display = "none";
}
  
function showReports() {
  // document.getElementById("account").style.display = "none";
  document.getElementById("transactions").style.display = "none";
  document.getElementById("reports").style.display = "block";
  document.getElementById("share").style.display = "none";
  document.getElementById("pg").style.display = "none";
}
  
function showShare() {
  // document.getElementById("account").style.display = "none";
  document.getElementById("transactions").style.display = "none";
  document.getElementById("reports").style.display = "none";
  document.getElementById("share").style.display = "block";
  document.getElementById("pg").style.display = "none";
}

function showpg() {
  // document.getElementById("account").style.display = "none";
  document.getElementById("transactions").style.display = "none";
  document.getElementById("reports").style.display = "none";
  document.getElementById("share").style.display = "none";
  document.getElementById("pg").style.display = "block";
}
  
// const logoutButton = document.getElementById('logout');

function logout() {
  firebase.auth().signOut().then(function() {
    console.log('User signed out');
    window.location.href= "http://127.0.0.1:5000/";
  }).catch(function(error) {
    console.error('Error signing out user: ', error);
  });
}


// var sidebar = document.querySelector("#sidebar");
// var iconContainers = sidebar.querySelector(".icon-container");

// iconContainers.forEach(iconContainer => {
// iconContainer.addEventListener("click", function() {
//     iconContainers.forEach(i => {
//     i.classList.add("active");
//     });
//     this.classList.remove("active");
// });
// });
  

// <------------------------------------------------------------------------------------------------------->



// function generatePDF() {
  

//   console.log("Pdf button clicked")
//   // Create a new jsPDF instance
//   var doc = new jsPDF();
  
//   // Define the div element(s) you want to include in the PDF
//   var elements = document.querySelectorAll(".summary-report");
  
//   // Loop through the div element(s)
//   for (var i = 0; i < elements.length; i++) {
//     // Use html2canvas to convert the div element to an image
//     html2canvas(elements[i]).then(function(canvas) {
//       // Add the image to the PDF
//       doc.addImage(canvas.toDataURL("image/jpeg"), "JPEG", 10, 10, 190, 277);
      
//       // Check if this is the last element in the loop
//       if (i === elements.length - 1) {
//         // Save the PDF
//         doc.save("expense_report.pdf");
//       }
//     });
//   }
// }



//--------------------------------------------------------------------------------------------//

// Get the image or canvas element
// var originalElement = document.getElementById("myChart");

// // Create a new canvas element
// var canvas = document.createElement("canvas");

// // Set the canvas dimensions to match the original element
// canvas.width = originalElement.width;
// canvas.height = originalElement.height;

// // Draw the original element onto the new canvas
// var ctx = canvas.getContext("2d");
// ctx.drawImage(originalElement, 0, 0);

// // Pass the new canvas element to html2canvas
// html2canvas(canvas, { ... });



//------------------------------------------//

// function generatePDF() {
  
//     // Create a new jsPDF instance
//     var doc = new jsPDF();
    
//     // Get the content you want to print as a PDF
//     var content = document.getElementById("myChart");
    
//     // Convert the content to a PDF using html2canvas
//     html2canvas(content, {
//       onrendered: function(canvas) {
//         // Create a new canvas element and draw the PDF content onto it
//         var pdfCanvas = document.createElement("canvas");
//         pdfCanvas.width = 210;
//         pdfCanvas.height = 297;
//         var pdfCtx = pdfCanvas.getContext("2d");
//         pdfCtx.drawImage(canvas, 0, 0, 210, 297);
        
//         // Convert the PDF canvas to a data URL and add it to the PDF
//         var pdfData = pdfCanvas.toDataURL("image/jpeg");
//         doc.addImage(pdfData, "JPEG", 0, 0, 210, 297);
        
//         // Enable automatic printing
//         doc.autoPrint();
        
//         // Save the PDF as a Blob
//         // var blob = doc.output("blob");
        
//         // // Create a download link and trigger the download
//         // var link = document.createElement("a");
//         // link.download = "file.pdf";
//         // link.href = window.URL.createObjectURL(blob);
//         // link.dataset.downloadurl = ["application/pdf", link.download, link.href].join(":");
//         // link.click();
//       }
//     });
//   }


var doc = new jsPDF();

function saveDiv(divIds, title) {
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(title, 10, 10);
  
  for (let i = 0; i < divIds.length; i++) {
    let html = document.getElementById(divIds[i]).innerHTML;
    doc.fromHTML(`<html><head></head><body>${html}</body></html>`);
    if (i < divIds.length - 1) {
      doc.addPage(); // add a new page for each div except the last one
    }
  }
  
  doc.save('Expence-Report.pdf');
}


function printDiv(divIds, title) {
  let mywindow = window.open('', 'PRINT', 'height=650,width=900,top=100,left=150');

  mywindow.document.write(`<html><head><title>${title}</title>`);
  mywindow.document.write('</head><body>');

  for (let i = 0; i < divIds.length; i++) {
    mywindow.document.write(document.getElementById(divIds[i]).innerHTML);
    mywindow.document.write('<br><br>'); // add some spacing between each div
  }

  mywindow.document.write('</body></html>');
  mywindow.document.close(); // necessary for IE >= 10
  mywindow.focus(); // necessary for IE >= 10*/

  mywindow.print();
  mywindow.close();

  return true;
}

  