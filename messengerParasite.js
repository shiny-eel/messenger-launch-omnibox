const myKey = "LIST OF PEOPLE";
const maxSaved = 10;
var savedPeople = [];
var currentPerson;
getCurrentPerson();

function getCurrentPerson() {
    // Ask the background.js script for the current url
    chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
      console.log("Response = "+response.farewell);
      currentPerson = getNameFromURL(response.farewell);
      console.log("Person's username is: "+currentPerson);
      loadPeople();
    });
}


function loadPeople() {
    console.log("Messenger Parasite Active!");
    chrome.storage.sync.get(myKey, function(result) {
              console.log('Current saved people are: ' + result[myKey]);
              if (result[myKey].constructor === Array) {
                  // console.log("IT IS AN ARRAY");
                  savedPeople = result[myKey];
                  if (savedPeople.includes(currentPerson) || savedPeople.length > maxSaved) {
                      console.log("Already has this person.");
                  } else {
                      savedPeople.push(currentPerson);
                  }
                  // pushArray(savedPeople, result[myKey]);
              } else {
                  console.log("Failure to read proper settings.");
              }
              savePeople();
            });

}

function savePeople() {
    var items = {};
    items[myKey] = savedPeople;
    // items[myKey] = [];
    console.log("Updated people: "+items[myKey]);
    chrome.storage.sync.set(items, function() {
        console.log('Value is set to ' + items[myKey]);
    });
}

function pushArray(arr, arr2) {
    arr.push.apply(arr, arr2);
}

function getNameFromURL(url) {
    // https://www.messenger.com/t/revolushien
    var newString = url.replace(/https:\/\/www\.messenger\.com\/t\//, "");
    return newString;
}
