function requestCurrencyName() {
    let userInput = document.getElementById("userInput").value;
    
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", responseHandler);
    xhr.responseType = "json";
    xhr.open("GET", "/currency?currency=" + userInput);
    xhr.send();
}

// Handles the asynchronous response from the Ajax GET request
function responseHandler() {
    let currencyName = document.getElementById("currencyName");

    // Check the status code to ensure a valid response (200)
    if (this.status === 200) {
        currencyName.value = this.response.name;
    }
    else {
        // Otherwise, update the ipLocation text input with an error message
        currencyName.value = "Abbreviation not found.";
    }
}

document.getElementById("getName").addEventListener("click", requestCurrencyName);
