const fbMessengerURL = "https://www.messenger.com/*";
const USERNAME_KEY = "LIST OF PEOPLE";
const TITLE_KEY = "LIST OF TITLES";

let titles;
let usernames;

loadPeople(function(titles, usernames) {
    this.titles = titles;
    this.usernames  = usernames;
});

chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
    console.log("New input is: "+text);
    suggest([
      {content: text + " one", description: "the first one"},
      {content: text + " number two", description: "the second entry"}
    ]);
    chrome.omnibox.setDefaultSuggestion(
        {description: "description"}
    );
})

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
    function(text) {
        goToMessenger();
    });
// chrome.omnibox.onInputStarted.addListener(


function goToMessenger(text) {
    var oldTabID
    var currentTab
    // Encode user input for special characters , / ? : @ & = + $ #
    log("Going to Messenger");

    chrome.tabs.query({
        "url": fbMessengerURL
    }, function(tabs) {
        if (tabs.length > 0) { // Messenger tab already exists
            var tabID = tabs[0].id;
            log("Tab ID =" + tabID);
            // https://developer.chrome.com/extensions/tabs#method-update
            chrome.tabs.update(tabID, {
                "highlighted": true,
                "active": true
            }, function(tab) {
                currentTab = tab;
                chrome.tabs.update(tab.id, {
                    "pinned": true
                }, editMessengerPage(tab.id));
            });

        } else { // Messenger tab needs to be created

            var newURL = 'https://www.messenger.com';
            chrome.tabs.create({
                url: newURL
            }, function(tab) {
                currentTab = tab;
                chrome.tabs.update(tab.id, {
                    "pinned": true
                }, editMessengerPage(tab.id));

            });
        }
    });
}

function editMessengerPage(tabID) {
    log("Calling the edit function.");
    chrome.tabs.executeScript(tabID, {
        file: "editMessenger.js"
    });
    chrome.tabs.onUpdated.addListener(function(tabId, info) {
        if (info.status === 'complete' && tabId == tabID) {

            log("Calling the edit function.");
            chrome.tabs.executeScript(tabID, {
                file: "editMessenger.js"
            });
        }
    });
}

function log(text) {
    var bkg = chrome.extension.getBackgroundPage();
    bkg.console.log(text);
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.greeting == "getPerson")
            sendResponse({
                username: sender.tab.url
            });
    });

function loadPeople(callback) {
    console.log("LOAD SAVED PEOPLE");
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
