function generateTable() {
    let initBalance = document.getElementById("initBalance").value * 1.0;
    let numYears = document.getElementById("numYears").value * 1.0;
    let interestRate = document.getElementById("intRate").value * 1.0;
    let currBalance;

    let savingsTabelDiv = document.getElementById("savingsTable");
    let tableHTML = "";
    
    // TODO: Use string concatenation to udpate 
    // the string tableHTML with the HTML code 
    // needed to for the savings table given  
    // initBalance, numYears, and interestRate 
    tableHTML +=  "<table>";
    tableHTML += "<tr><th>Year</th><th>Balance</th></tr>";

    // Table has final balance at end of each year
    currBalance = initBalance;
    for (let i=0; i < numYears; i++) {
      currBalance += currBalance * (interestRate / 100.0);
      tableHTML += "<tr><td>" + (i+1) + "</td><td>$" + currBalance.toFixed(2) + "</td></tr>";
    }
    tableHTML +=  "</table>";

    savingsTabelDiv.innerHTML = tableHTML;
}