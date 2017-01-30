'use strict';
$( ".input-field" ).keyup(function() {
  var form = $( ".white-text" );
  var ready = 0;
  for(var i = 0 ; i < form.length; i++) {
    if(form[i].value != "") {
      ready++;
    }
  }
  if(ready === 4) {
    $( "#sub" ).removeClass("scale-out");
  }
  else {
    $( "#sub" ).addClass("scale-out");
  }
});


function start() {
  // 2. Initialize the JavaScript client library.
  gapi.client.init({
    'apiKey': 'AIzaSyBQvnwDmE7s1pignu79XT32aMCx3ToMOj4',
    'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
    // clientId and scope are optional if auth is not required.
    'clientId': '566441935432-33gdr6mh3umnc8g53inhmhvj3730p8l4.apps.googleusercontent.com',
    'scope': 'https://www.googleapis.com/auth/gmail.send',
  }).then(function() {
    // 3. Initialize and make the API request.
    return gapi.client.people.people.get({
      resourceName: 'people/me'
    });
  }).then(function(response) {
    console.log(response.result);
  }, function(reason) {
    console.log('Error: ' + reason.result.error.message);
  });
};

function sendMessage() {
  gapi.load('client', start);

 var userId = "clancy.seanr@gmail.com"; 
 var email = "";
 var form = $( ".white-text" );
 for(var i = 0 ; i < form.length; i++) {
   email += form[i].value + "\n\n";
 }
 var callback = function() { 
   $( "#sub" ).addClass("scale-out");
    Materialize.toast('Thanks for reaching out, I will get back to you in the next few days.', 6000, 'rounded');
 };

  var base64EncodedEmail = btoa(email);
  var request = gapi.client.gmail.users.messages.send({
    'userId': userId,
    'resource': {
      'raw': base64EncodedEmail
    }
  });
  request.execute(callback);
}