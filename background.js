const fbMessengerURL = "https://www.messenger.com/*"
// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
    // chrome.omnibox.onInputStarted.addListener(
    function(text) {
        var oldTabID
        var currentTab
        // Encode user input for special characters , / ? : @ & = + $ #
        log("Here");


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
                    },editMessengerPage(tab.id)
                );


                });

            } else { // Messenger tab needs to be created

                var newURL = 'https://www.messenger.com';
                chrome.tabs.create({
                    url: newURL
                }, function(tab) {
                    currentTab = tab;
                    chrome.tabs.update(tab.id, {
                        "pinned": true
                    },editMessengerPage(tab.id));

                });
            }
        });

    });


function editMessengerPage(tabID) {
    log("Calling the edit function.");
    chrome.tabs.executeScript(tabID, {
        file: "editMessenger.js"
    });
    chrome.tabs.onUpdated.addListener(function (tabId , info) {
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
