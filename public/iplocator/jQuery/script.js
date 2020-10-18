// Sends an Ajax GET request to ipapi.co to get the city for the user entered IP 
function sendIpLocationRequest() {
  $.get("https://ipapi.co/" + $("#ipInput").val() + "/json",
        {}, // Data setn in the body of the request
        function(responseData) {
          console.log(responseData);
          if( responseData.error ) {
            $("#ipLocation").val(responseData.reason);
          }
          else {
            $("#ipLocation").val(responseData.city);
          }
        },
        'json').fail(function(responseObject) {
          console.log(responseObject);
          $("#ipLocation").val("We could not lookup this IP right now. Please try again later.");
        });
}

// Handles the asynchronous response from the Ajax GET request
function responseReceivedHandler() {
    let ipLocationElement = document.getElementById("ipLocation");

    // Check the status code to ensure a valid response (200)
    if (this.status === 200) {
        // If valid response, update the ipLocation text input with the city returned in
        // the response
        console.log(JSON.stringify(this.response));
        ipLocationElement.value = this.response.city;
    }
    else {
        // Otherwise, update the ipLocation text input with an error message
        ipLocationElement.value = "Error getting location";
    }
}


$(function() {
  $("#getLocation").click(sendIpLocationRequest);
});
  
