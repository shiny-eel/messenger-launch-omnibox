try {
    // const testURL = "https://www.messenger.com/t/nathan.henderson.7739";
    const loadWaitMillis = 800;
    // getDesiredURL(function(url) {
    //     editThing(url);
    // });
    getDesiredURL(function(url) {
        let maxScrolls = 5;
        let scrollCount = 1;
        if (!editThing(url)) {

            let intervals = setInterval(function() {

                if (!editThing(url) && scrollCount < maxScrolls) {
                    console.log("Executing scroll down");
                    scrollDown(scrollCount, function() {
                        // setTimeout()
                        scrollCount++;
                    });
                } else {
                    console.log("Finished scrolling.");
                    clearInterval(intervals);
                }

            }, loadWaitMillis);
        }
    });
    console.log("End of editMessenger.js");
} catch (err) {
    console.log("Error: You might not be able to call the extension" +
        " while in the messenger page multiple times.");
    console.log(err);
}



function editThing(url) {
    console.log("Attempting to switch to this tab =" + url);
    var button = document.querySelectorAll("a[data-href='" + url + "']");

    // console.log(typeof searchBox);
    if (button == null) {
        console.log("Did not find the element.");
    } else if (button.length < 1) {
        console.log("0 results found.");
        return false;
    } else {
        console.log("this is the button found: ")
        console.log(button);
        button[0].click();
        return true;
    }
    // searchBox.click();
}


function scrollDown(amount, callback) {
    const scrollPanelId = "js_8";

    let scrollPanel = document.getElementById(scrollPanelId);
    if (scrollPanel && amount) {
        console.log(scrollPanel);
        console.log("Height is =" + scrollPanel.clientHeight +
            " Amount is =" + amount);
        let newPos = (scrollPanel.clientHeight - 100) * amount;
        console.log("Scrolling to pos=" + newPos)
        scrollPanel.scrollTop = newPos;

    } else {
        console.log("Couldn't find scroll panel using id=" + scrollPanelId);
    }
    if (typeof callback === "function") {
        callback();
    }

}

// Gives the callback a single param - the desired URL.
function getDesiredURL(callback) {
    console.log("GETTING DESIRED URL FROM BACKGROUND.JS")

    // Ask the background.js script for the current url
    chrome.runtime.sendMessage({
        greeting: "getDesiredURL"
    }, function(response) {
        console.log("Response = " + response.url);

        if (typeof callback === "function") {
            callback(response.url);
        }
    });

}

// console.log("Found element " + collection + " length=" + collection.length)
// var contents = collection.item(0)
// console.log("Element is: " + contents)
// contents.select();
// contents.click();
// contents.value = "Stephanie";
// var evt = document.createEvent("HTMLEvents");
// // adding this created a magic and passes it as if
// evt.initEvent("change", false, true);
// contents.dispatchEvent(evt);

// var keyboardEvent = document.createEvent("KeyboardEvent");
// var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";
//
//
// keyboardEvent[initMethod](
//                    "keypress", // event type : keydown, keyup, keypress
//                     true, // bubbles
//                     true, // cancelable
//                     window, // viewArg: should be window
//                     false, // ctrlKeyArg
//                     false, // altKeyArg
//                     false, // shiftKeyArg
//                     false, // metaKeyArg
//                     90, // keyCodeArg : unsigned long the virtual key code, else 0
//                     0 // charCodeArgs : unsigned long the Unicode character associated with the depressed key, else 0
// );
// console.log("HERE")
// document.dispatchEvent(keyboardEvent);
