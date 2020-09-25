function isValidInput() {
    let interestRateElement = document.getElementById("intRate");
    let initialBalanceElement = document.getElementById("initBalance");
    let numYearsElement = document.getElementById("numYears");
    let isValid = true;
    
    // Create a regular expression that only matches valid input 
    let numYearsRe = /^\d{1,2}$/;  // One or two digits
    let interestRateRe = /^\d?\d\.\d+$/;  // 1 or 2 digits followed by a period and 1 or more digits
    let balanceRe = /^\d+(\.\d\d)?$/;  // Any number of digits, optionally followed by a period and two digits
    
    // 
    if( numYearsRe.test(numYearsElement.value)) {
        // Remove the error class, in case the error class was
        // previously added. 
        numYearsElement.classList.remove("error");
    }
    else {
        // Add the error class, which defines a 2px red border 
        numYearsElement.classList.add("error");
        isValid = false;
    }
    
    if( interestRateRe.test(interestRateElement.value)) {
        // Remove the error class, in case the error class was
        // previously added. 
        interestRateElement.classList.remove("error");
    }
    else {
        // Add the error class, which defines a 2px red border 
        interestRateElement.classList.add("error");
        isValid = false;
    }
    
    // Create a regular expression that only matches valid input 
    if( balanceRe.test(initialBalanceElement.value)) {
        // Remove the error class, in case the error class was
        // previously added. 
        initialBalanceElement.classList.remove("error");
    }
    else {
        // Add the error class, which defines a 2px red border 
        initialBalanceElement.classList.add("error");
        isValid = false;
    }
    return isValid;
}


function generateTable() {
    let initBalance = document.getElementById("initBalance").value * 1.0;
    let numYears = document.getElementById("numYears").value * 1.0;
    let interestRate = document.getElementById("intRate").value * 1.0;
    let isYearly = document.getElementById("yearlyInt").checked;
    let currBalance;

    if (!isValidInput()) {
      return;
    }

    let savingsTabelDiv = document.getElementById("savingsTable");
    let tableHTML = "";
    
    // Use string concatenation to udpate 
    // the string tableHTML with the HTML code 
    // needed to for the savings table given  
    // initBalance, numYears, and interestRate 
    tableHTML +=  "<table>";
    tableHTML += "<tr><th>Year</th><th>Balance</th></tr>";

    // Table has final balance at end of each year
    currBalance = initBalance;
    for (let i=0; i < numYears; i++) {
      if (isYearly) {
         currBalance += currBalance * (interestRate / 100.0);
      }
      else {
         currBalance *= Math.pow(1.0 + (interestRate / 100.0), 12);
      }
      tableHTML += "<tr><td>" + (i+1) + "</td><td>$" + currBalance.toFixed(2) + "</td></tr>";
    }
    tableHTML +=  "</table>";

    savingsTabelDiv.innerHTML = tableHTML;
}

document.addEventListener("DOMContentLoaded", function() {
    generateTable();
    var inputElements = document.getElementsByTagName('input');
    for (elem of inputElements) {
      elem.addEventListener("input", generateTable);
    }
});
