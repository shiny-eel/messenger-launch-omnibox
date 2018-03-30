"use strict";
const USERNAME_KEY = "LIST OF PEOPLE";
const TITLE_KEY = "LIST OF TITLES";
const maxSaved = 30;

let currentUsernames = null;
let currentTitles = [];
let currentPeople = [];

// import loadPeople from 'contentsLoader'; // or './module'

console.log("Messenger Parasite Active!");
waitThenGetTitle();
// savePeople([],[]);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("Parasite: " + (sender.tab ?
            "Message from another:" + sender.tab.url :
            "Message from the extension"));
        if (request.urlChange === "true") {
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
    getTitle(function(title) {
        if (currentTitles.includes(title)) {
            console.log("Parasite: Already has this person.");
            return;
        }
        getUserName(title, function(username) {
            updatePeople(title, username, function(titles, usernames, areNewPeople) {
                if (areNewPeople) {
                    savePeople(titles, usernames, function() {
                        // Tell the background script of new people
                        newPeopleUpdate();
                    });
                    console.log("Parasite Script Finished.");
                }
            });
        });
    });
}

function getTitle(callback) {
    // console.log("Parasite: GET TITLE")
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
    // console.log("Parasite: GET USER NAME")
    // Ask the background.js script for the current url
    chrome.runtime.sendMessage({
        greeting: "getPerson"
    }, function(response) {
        if (!response.username) {
            console.log("Failure to retrieve username from background script.");
        }
        // console.log("Response = " + response.username);
        let username = getNameFromURL(response.username);

        if (typeof callback === "function") {
            callback(username);
        }
    });
}

function updatePeople(title, username, callback) {

    getPeople(function(people, allTitles, allUsernames) {
        // console.log(allUsernames);
        let newPeople = false;
        if (allUsernames.includes(username) || allUsernames.length > maxSaved) {
            console.log("Already has this person.");
        } else {
            if (username && title) {
                console.log("Adding a person.")
                allUsernames.push(username);
                allTitles.push(title);
                newPeople = true;
            } else {
                console.log("No person to add.")
            }
        }
        if (typeof callback === "function") {
            callback(allTitles, allUsernames, newPeople);
        }
    });
}


function getPeople(callback) {
    if (0) { // Don't need to reload from persistence

        callback(currentPeople, currentTitles, currentUsernames);
        return;
    } else {
        // console.log("Loading from persistence. Should only do ");
        loadPeople(function(people, titles, usernames) {
            currentPeople = people;
            currentTitles = titles;
            currentUsernames = usernames;
            callback(people, titles, usernames);
            return;
        });
    }
}

function newPeopleUpdate() {
    chrome.runtime.sendMessage({
        greeting: "newPeople"
    });
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


// function loadPeople(callback) {
//     let allUsernames;
//     let allTitles;
//     chrome.storage.sync.get(null, function(result) {
//         console.log('Current saved people are: ' + result[USERNAME_KEY]);
//         console.log('Current saved titles are: ' + result[TITLE_KEY]);
//         if (!result[USERNAME_KEY] || !result[TITLE_KEY]) {
//             // Null contents
//             callback([], []);
//             return;
//         }
//         if (result[USERNAME_KEY].constructor === Array && result[TITLE_KEY].constructor === Array) {
//             allUsernames = result[USERNAME_KEY];
//             allTitles = result[TITLE_KEY];
//
//         } else {
//             console.log("Failure to read proper settings.");
//         }
//         if (typeof callback === "function") {
//             callback(allTitles, allUsernames);
//         }
//     });
// }
