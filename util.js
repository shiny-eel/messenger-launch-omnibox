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
