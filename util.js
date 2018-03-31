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
       let allNames = this.title.split("\\s+");
       // console.log("Allnames length ="+allNames.length+" "+allNames);
       for (let i = 0; i < allNames.length; i++) {
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
           content: fbMessengerURL.replace("*", "t/" + this.username),
           description: this.title
       };
       return suggestion;
   }
}

function loadPeople(callback) {

    console.log("Util: Loading people from persistence");
    let allUsernames;
    let allTitles;
    let people = [];
    chrome.storage.sync.get(null, function(result) {
        // console.log('Current saved usernames are: ' + result[USERNAME_KEY]);
        console.log('Current saved people are: ' + result[TITLE_KEY]);
        if (!result[USERNAME_KEY] || !result[TITLE_KEY]) {
            // Null contents
            // console.log("HERE");
            // allTitles = ["Lei Liao", "Eko Huang", "Agrippa Cahya", "Honorinus Octavia", "Sigeberht Januarius", "Cornelius Herminius", "Tane Awhina", "Hemi Nikora"];
            // allUsernames = ["lei.l", "echo.echo", "cahyass", "honor", "monthlies", "sterner.stuff", "tree-tree", "hemi"];
            // var arrayLength = allUsernames.length;
            // for (var i = 0; i < arrayLength; i++) {
            //     // log(allUsernames[i]);
            //     people.push(new Person(allTitles[i], allUsernames[i]));
            // }
            callback([], [], []);
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
            callback(people, allTitles, allUsernames);
        }
    });
}


function savePeople(titles, usernames, callback) {
    console.log("Util: Persisting people")
    if (titles.length < 1 || usernames.length < 1) {
        console.log("Empty titles/usernames... Deleting persistent storage.");
    }
    var items = {};
    items[USERNAME_KEY] = usernames;
    items[TITLE_KEY] = titles;
    // items[USERNAME_KEY] = [];
    // console.log("Updated people: "+items[USERNAME_KEY]);
    chrome.storage.sync.set(items, function() {
        // console.log('Saved people are: ' + items[USERNAME_KEY]);
        console.log('Saved people are: ' + items[TITLE_KEY]);
        if (typeof callback === "function") {
            callback();
        }
    });
}
