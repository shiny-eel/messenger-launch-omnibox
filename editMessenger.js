function editThing() {
console.log("hello we need to edit the messenger page.");
var collection = document.getElementsByClassName("_58al");

// console.log(typeof searchBox);
if (collection == null) {
    console.log("Did not find the element.")
} else {

    console.log("Found element "+collection+" length="+collection.length)
    var contents = collection.item(0)
    console.log("Element is: "+contents)
    contents.select();
    contents.click();
    contents.value = "Stephanie";
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("change", false, true); // adding this created a magic and passes it as if
    contents.dispatchEvent(evt);
}
// searchBox.click();
}
editThing();

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
