"use strict";
const USERNAME_KEY = "LIST OF PEOPLE";
const TITLE_KEY = "LIST OF TITLES";
const maxSaved = 30;

let currentUsernames = null;
let currentTitles = [];
let currentPeople = [];

// import loadPeople from 'contentsLoader'; // or './module'

console.log("Messenger Parasite Active!");
waitThenStart(beginScript);
// waitThenStart(getConversations);
// getConversations();
// savePeople([],[]);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("Parasite: " + (sender.tab ?
            "Message from another:" + sender.tab.url :
            "Message from the extension"));
        if (request.urlChange === "true") {
            waitThenStart(function() {
                let titles = [getCurrentChatTitle()];
                let unames = [request.username];
                updatePeople(titles, unames, function(sumTitles, sumUnames, areNewPeople) {
                    if (areNewPeople) {
                        savePeople(sumTitles, sumUnames, function() {
                            // Tell the background script of new people
                            newPeopleUpdate();
                        });
                    }
                    console.log("Parasite Script Finished.");
                });
            });
        }
    });

function waitThenStart(callback) {
    if (document.readyState != 'complete') {
        window.addEventListener('load', callback);
    } else {
        if (typeof callback === "function") {
            callback();
        }
    }
}

function beginScript() {
    getConversations(function(unames, titles) {
        updatePeople(titles, unames, function(sumTitles, sumUnames, areNewPeople) {
            if (areNewPeople) {
                savePeople(sumTitles, sumUnames, function() {
                    // Tell the background script of new people
                    newPeopleUpdate();
                });
            }
            console.log("Parasite Script Finished.");
        });
    });
}

function updatePeople(newTitles, newUsernames, callback) {

    getPeople(function(people, currentTitles, currentUsernames) {
        // console.log(allUsernames);
        let newPeople = false;
        let allUsernames = [];
        let newPersonCounter = 0;
        for (let i = 0; i<newTitles.length; i++) {
            let uname = newUsernames[i];
            let title = newTitles[i]
            if (!currentUsernames.includes(uname)) {
                if (uname && title) {
                    // console.log("Adding a person.")
                    currentUsernames.push(uname);
                    currentTitles.push(title);
                    newPersonCounter++;
                    newPeople = true;
                }
            }
        }
        console.log("Added "+newPersonCounter+" people.");
        if (typeof callback === "function") {
            callback(currentTitles, currentUsernames, newPeople);
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

// document.querySelectorAll("ul[aria-label='Conversation list']")[0].childNodes[1].querySelectorAll("a[role='link']")[0].getAttribute("data-href")
// document.querySelectorAll("ul[aria-label='Conversation list']")[0].childNodes[1].querySelectorAll("a[role='link']")[0].querySelectorAll("span")[0].innerText
function getConversations(callback) {
    console.log("Attempt to find list of conversations");
    let unames = [];
    let titles = [];
    try {
        let convos = document.querySelectorAll("ul[aria-label='Conversation list']");

        // console.log("Found convos. ");
        // console.log(convos[0]);
        let nodes = convos[0].childNodes;
        // console.log(nodes);
        // console.log("Found child node convos");
        for (let i = 0; i < nodes.length; i++) {
            let linkClass = nodes[i].querySelectorAll("a[role='link']")[0]
            // console.log(linkClass);
            let convoLink = linkClass.getAttribute("data-href");
            // console.log(convoLink);
            unames.push(getNameFromURL(convoLink));
            let convoTitle = linkClass.querySelectorAll('span')[0].innerText;
            titles.push(convoTitle)
            // console.log(convoTitle);
        }
        console.log("Parasite: Found "+unames.length+" convos.");
        callback(unames, titles);
    } catch (err) {
        console.log("Error trying to find conversations: \n" + err);
    }

}

function getCurrentChatTitle() {
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
    return realTitle;
}

// function beginScript() {
//     getCurrentChatTitle(function(title) {
//         if (currentTitles.includes(title)) {
//             console.log("Parasite: Already has this person.");
//             return;
//         }
//         getUserName(title, function(username) {
//             updatePeople(title, username, function(titles, usernames, areNewPeople) {
//                 if (areNewPeople) {
//                     savePeople(titles, usernames, function() {
//                         // Tell the background script of new people
//                         newPeopleUpdate();
//                     });
//                     console.log("Parasite Script Finished.");
//                 }
//             });
//         });
//     });
// }
//
// function getCurrentChatTitle(callback) {
//     // console.log("Parasite: GET TITLE")
//     const id = "js_5";
//     console.log("Document ready state = " + document.readyState);
//     const container = document.getElementById(id);
//     const element = container.childNodes.item(0);
//     let realTitle;
//     if (!element) {
//         console.log("OOPS! No child element under element id -" + id);
//         return "No Title";
//     } else if (element.childElementCount > 0) {
//         realTitle = element.childNodes.item(0).innerHTML;
//         console.log("Title [nested] is =" + realTitle);
//     } else {
//         realTitle = element.innerHTML;
//         console.log("Title is =" + element.innerHTML);
//     }
//     callback(realTitle, updatePeople);
// }

// Get username by asking background script for url
// function getUserName(title, callback) {
//     // console.log("Parasite: GET USER NAME")
//     // Ask the background.js script for the current url
//     chrome.runtime.sendMessage({
//         greeting: "getPerson"
//     }, function(response) {
//         if (!response.username) {
//             console.log("Failure to retrieve username from background script.");
//         }
//         // console.log("Response = " + response.username);
//         let username = getNameFromURL(response.username);
//
//         if (typeof callback === "function") {
//             callback(username);
//         }
//     });
// }
