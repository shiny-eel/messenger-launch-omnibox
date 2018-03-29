"use strict";
const USERNAME_KEY = "LIST OF PEOPLE";
const TITLE_KEY = "LIST OF TITLES";
const maxSaved = 30;

// import loadPeople from 'contentsLoader'; // or './module'

console.log("Messenger Parasite Active!");
waitThenGetTitle();

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from another:" + sender.tab.url :
            "from the extension");
        if (request.haveURL === "true"){
            waitThenGetTitle();
        }
    });

function waitThenGetTitle() {
    if (document.readyState != 'complete') {
        window.addEventListener('load', beginScript);
    } else {
        beginScript();
    }
}

function beginScript() {
    getTitle(getUserName);
}

function getTitle(callback) {
    console.log("GET TITLE")
    const id = "js_5";
    console.log("Document ready state = " + document.readyState);
    const container = document.getElementById(id);
    const element = container.childNodes.item(0);
    let realTitle;
    if (!element) {
        console.log("OOPS! No child element under element id -" + id);
        return "No Title";
    } else if (element.childElementCount > 0) {
        realTitle = element.childNodes.item(0).innerHTML;
        console.log("Title [nested] is =" + realTitle);
    } else {
        realTitle = element.innerHTML;
        console.log("Title is =" + element.innerHTML);
    }
    callback(realTitle, updatePeople);
}

function getUserName(title, callback) {

    console.log("GET USER NAME")

    // Ask the background.js script for the current url
    chrome.runtime.sendMessage({
        greeting: "getPerson"
    }, function(response) {
        console.log("Response = " + response.username);
        let username = getNameFromURL(response.username);
        // getTitle();

        if (typeof callback === "function") {
            callback(title, username, savePeople);
        }
    });
}

function updatePeople(title, username, callback) {
    console.log("LOAD SAVED PEOPLE");
    loadPeople(function(titles, usernames) {
        let allUsernames = usernames;
        let allTitles = titles;
        if (allUsernames.includes(username) || allUsernames.length > maxSaved) {
            console.log("Already has this person.");
        } else {
            if (username && title) {
                console.log("Adding a person.")
                allUsernames.push(username);
                allTitles.push(title);
            } else {
                console.log("No person to add.")
            }
        }
        if (typeof callback === "function") {
            callback(allTitles, allUsernames);
        }
    });
}
// let allUsernames;
// let allTitles;
// chrome.storage.sync.get(null, function(result) {
//           console.log('Current saved people are: ' + result[USERNAME_KEY]);
//           console.log('Current saved titles are: ' + result[TITLE_KEY]);
//           if (!result[USERNAME_KEY] || !result[TITLE_KEY]) {
//               // Null contents
//               callback([title],[username]);
//               return;
//           }
//           if (result[USERNAME_KEY].constructor === Array && result[TITLE_KEY].constructor === Array) {
//               // console.log("IT IS AN ARRAY");
//               allUsernames = result[USERNAME_KEY];
//               allTitles = result[TITLE_KEY];
//               if (allUsernames.includes(username) || allUsernames.length > maxSaved) {
//                   console.log("Already has this person.");
//               } else {
//                   if (username && title) {
//                       console.log("Adding a person.")
//                       allUsernames.push(username);
//                       allTitles.push(title);
//                   } else {
//                       console.log("No person to add.")
//                   }
//               }
//           } else {
//               console.log("Failure to read proper settings.");
//           }
//           if (typeof callback === "function") {
//               callback(allTitles, allUsernames);
//           }
//       });

//
// class Data {
//     constructor(titles, usernames) {
//         this.titles = titles;
//         this.usernames = usernames;
//     }
//     add(title, username) {
//         this.titles.push(title);
//         this.usernames.push(username);
//     }
// }

function savePeople(titles, people, callback) {
    console.log("STORE ALL PEOPLE")
    var items = {};
    items[USERNAME_KEY] = people;
    items[TITLE_KEY] = titles;
    // items[USERNAME_KEY] = [];
    // console.log("Updated people: "+items[USERNAME_KEY]);
    chrome.storage.sync.set(items, function() {
        console.log('Saved people are: ' + items[USERNAME_KEY]);
        console.log('Saved titles are: ' + items[TITLE_KEY]);
    });
    if (typeof callback === "function") {
        callback();
    }
}

function pushArray(arr, arr2) {
    arr.push.apply(arr, arr2);
}

function getNameFromURL(url) {
    // https://www.messenger.com/t/revolushien
    var newString = url.replace(/https:\/\/www\.messenger\.com\/t\//, "");
    if (newString === "https://www.messenger.com/") {
        console.log("No new person.");
        return null;
    }
    console.log("Person's username is: " + newString);
    return newString;
}


function loadPeople(callback) {
    let allUsernames;
    let allTitles;
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

        } else {
            console.log("Failure to read proper settings.");
        }
        if (typeof callback === "function") {
            callback(allTitles, allUsernames);
        }
    });
}
