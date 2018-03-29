"use strict";

const fbMessengerURL = "https://www.messenger.com/*";
const USERNAME_KEY = "LIST OF PEOPLE";
const TITLE_KEY = "LIST OF TITLES";

let currentSuggestText;
let currentSuggestContent;
let desiredURL = "DEFAULT FAKE";
let myPeople; // Let my people go!
loadPeople();
startListen();

loadPeople(function(people) {
    console.log("Found this many people ="+people.length);
    myPeople = people;
});

chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
    console.log("New input is: "+text);
    currentSuggestText = text;
    queryPeople(text, function(results) {
        console.log(results);
        if (results.length > 0) {
            currentSuggestContent = results[0].content;
            chrome.omnibox.setDefaultSuggestion(
                { description: results[0].description }
            );

            let numVisible = Math.max(results.length, 5);
            var resultsToReturn = results.slice(1,numVisible-1);
            // console.log(results.constructor);
            // suggest(results);
            suggest(resultsToReturn);
        }
    });
})

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
    function(text) {
        // The text should be the URL.
        if (text == currentSuggestText) {
            console.log("Default suggestion selected");
            text = currentSuggestContent;
        goToMessenger(text);
        }
    });


function goToMessenger(text) {
    desiredURL = text;
    var oldTabID
    // Encode user input for special characters , / ? : @ & = + $ #
    console.log("Going to Messenger tab. "+
                "Desired URL ="+desiredURL);

    chrome.tabs.query({
        "url": fbMessengerURL
    }, function(tabs) {
        if (tabs.length > 0) { // Messenger tab already exists
            var tabID = tabs[0].id;
            console.log("Tab ID =" + tabID);
            // Reference: https://developer.chrome.com/extensions/tabs#method-update
            chrome.tabs.update(tabID, {
                "highlighted": true,
                "active": true
            }, function(tab) {
                switchToPerson();
                pinTab(tab, listenToMessengerPage);

            });

        } else { // Messenger tab needs to be created

            chrome.tabs.create({
                url: text
            }, function(tab) {
                switchToPerson();
                pinTab(tab, listenToMessengerPage);
            });
        }
    });
}

function switchToPerson(url) {
    chrome.tabs.executeScript(
        {file: "editMessenger.js"}
    );
}

function pinTab(tab, callback) {
    chrome.tabs.update(tab.id, {
        "pinned": true
    }, callback(tab.id));
}

function startListen() {
    chrome.tabs.query({
        "url": fbMessengerURL
    }, function(tabs) {
        listenToMessengerPage(tabs[0].id);
    });
}

let listening = false;
function listenToMessengerPage(tabID) {
    if (listening) {
        return;
    }
    listening = true;
    console.log("Starting the update listener.");

    chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
        if (info.url && tab.url.match(fbMessengerURL)) {

            console.log("Updating the parasite.");

            chrome.tabs.sendMessage(tab.id,{
                haveURL: "true"
            });
        }
        loadPeople();
    });
}

// Takes a string input of what the user has entered
// Calls back with list of 'suggest' results
// The order of the results should indicate the strength of the match
function queryPeople(text, callback) {
    if (text == 'help') {
        console.log("Help Called For.");
        callback(null);
    } else {
        console.log("Matching with text="+text);
        let results = [];
        let person;
        let matchCounter = 0;
        for (let i = 0; i<myPeople.length; i++) {
            person = myPeople[i];
            let matchStrength = person.match(text);
            if (matchStrength == 2) {
                console.log("STRONG MATCH FOUND ="+text+" "+person.title);
                results.unshift(person.asSuggestion());
                matchCounter++;
            } else if (matchStrength == 1) {
                results.push(person.asSuggestion());
                matchCounter++;
            } else {
                // Doesn't match
            }
        }
        console.log("Number of matches: "+matchCounter);
        console.log("Number of results: "+results.length);
        callback(results);
    }

}


// Reply to the Messenger Parasite with the URL info
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // console.log(sender.tab ?
        //     "from a content script:" + sender.tab.url :
        //     "from the extension");
        if (request.greeting == "getPerson"){
            sendResponse({
                username: sender.tab.url
            });
        } else if (request.greeting == "getDesiredURL") {
            console.log("Request for desired URL. sending ="+desiredURL);
            sendResponse({
                url: desiredURL
            })
        }
    });

function loadPeople(callback) {
    console.log("LOAD SAVED PEOPLE");
    let allUsernames;
    let allTitles;
    let people = [];
    chrome.storage.sync.get(null, function(result) {
        console.log('Current saved people are: ' + result[USERNAME_KEY]);
        console.log('Current saved titles are: ' + result[TITLE_KEY]);
        if (!result[USERNAME_KEY] || !result[TITLE_KEY]) {
            // Null contents
            callback([], []);
            return;
        }
        if (result[USERNAME_KEY].constructor === Array && result[TITLE_KEY].constructor === Array) {

            allUsernames = result[USERNAME_KEY];
            allTitles = result[TITLE_KEY];
            var arrayLength = allUsernames.length;
            for (var i = 0; i < arrayLength; i++) {
                // log(allUsernames[i]);
                people.push(new Person(allTitles[i], allUsernames[i]));
            }

        } else {
            console.log("Failure to read proper settings.");
        }
        if (typeof callback === "function") {
            callback(people);
        }
    });
}

class Person {
    constructor(title, username) {
        this.title = title;
        this.username = username;
        this.matcher = title.toLowerCase() + " " + username.toLowerCase();
        // log(this.matcher);
    }
    // Returns: 0 if no match, 1 if OK match, 2 if GOOD match
    match(text) {
        const lowerText = text.toLowerCase();
        // let allNames = this.title.split("\\+s").push(this.username);
        if (this.title == "Aprajit Gandhi")
            console.log("HEY IT IS A-Jay!");
        let allNames = this.title.split("\\s+");
        // console.log("Allnames length ="+allNames.length+" "+allNames);
        for (let i=0; i<allNames.length; i++) {
            if (allNames[i].toLowerCase().startsWith(lowerText))
                return 2;
        }
        if (this.matcher.includes(lowerText)) {
            return 1;
        } else {
            return 0;
        }
    }
    asSuggestion() {
        let suggestion = {
            content: fbMessengerURL.replace("*", "t/"+this.username),
            description: this.title
        };
        return suggestion;
    }
}
// chrome.tabs.query({"highlighted": true}, function(tabs) {
//     if (tabs.length > 0) {
//         var tabID = tabs[0].id;
//         log("Tab ID ="+tabID);
//         oldTabID = tabID;
//         // https://developer.chrome.com/extensions/tabs#method-update
//         // chrome.tabs.update(tabID, {"highlighted": false});
//     }
// });

// chrome.tabs.update(oldTabID, {"highlighted": false, "active": false});
