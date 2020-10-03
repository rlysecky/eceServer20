// Sends an Ajax GET request to ipapi.co to get the city for the user entered IP 
function sendIpLocationRequest() {
    let ipInput = document.getElementById("ipInput").value;
    
    // 1. Create an XMLHttpRequest
    let xhr = new XMLHttpRequest();

    // 2. Assign a load event handler
    xhr.addEventListener("load", responseReceivedHandler);

    // 3. Specify the response type
    xhr.responseType = "json";

    // 4. Open request with the type (GET) and the URL ()
    xhr.open("GET", "https://ipapi.co/" + ipInput + "/json");

    // 5. Send the request
    xhr.send();
}

// Handles the asynchronous response from the Ajax GET request
function responseReceivedHandler() {
    let ipLocationElement = document.getElementById("ipLocation");

    // Check the status code to ensure a valid response (200)
    if (this.status === 200) {
        console.log(JSON.stringify(this.response));
        ipLocationElement.value = this.response.city;
        // If valid response, update the ipLocation text input with the city returned in
        // the response
    }
    else {
        // Otherwise, update the ipLocation text input with an error message
        ipLocationElement.value = "Error getting location";
    }
}

document.getElementById("getLocation").addEventListener("click", sendIpLocationRequest);
