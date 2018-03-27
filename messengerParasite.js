const myKey = "LIST OF PEOPLE";

function savePerson() {
    console.log("Messenger Parasite Active!");
    chrome.storage.sync.get(myKey, function(result) {
              console.log('Value currently is ' + result[myKey]);
            });

    myValue = [ "tim.sinclair.50", "revolushien"]
    var items = {};
    items[myKey] = myValue
    chrome.storage.sync.set(items, function() {
          console.log('Value is set to ' + myValue);
        });
}
savePerson();
