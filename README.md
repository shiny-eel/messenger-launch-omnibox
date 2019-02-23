# New version, with UI, in [this repo](https://github.com/shiny-eel/messenger-launch)

# <img src="https://raw.githubusercontent.com/shiny-eel/messenger-launch/master/resources/mailbox_colour.png" alt="mail" width="40" height="40"/> mail - Messenger App Intelligent Launcher

*A Chrome Omnibox extension for quickly launching Facebook Messenger*

Author: **shiny-eel**  
README Updated: **31/03/18**
___

### Overview
Mail is intended to be an efficient, lightweight add-on for those who use the [Facebook Messenger](https://www.messenger.com/) browser site often. It speeds up workflow by removing the need to interact with the Messenger page's UI to open specific chats, by instead using the power of the **Omnibox** (Chrome's address bar).

![So speedy!](https://raw.githubusercontent.com/shiny-eel/messenger-launch/master/resources/messenger-demo.gif)

#### Features
- **ONE TAB**. If you have a Messenger tab open, Mail will use that. If you don't, it'll open one. (*And pin it too!*)
- **Smart-ish Suggestions**. Mail will match based on both chat URL (i.e. their FB username), as well as chat title. This works for both normal chats and group chats.
- **No Login Needed**. As long as messenger.com works for you normally, Mail will too.

#### How It Works
Every time you open messenger.com, Mail *learns* the names and urls of loaded conversations. (Don't worry - Mail won't spy on the content of the chat). Then, whenever you activate Mail by typing `m [space]` into your Omnibox, Mail will suggest to you chats based on what it's learnt!  

From there, it's easy to select a suggestion, hit `[enter/return]`, and be taken straight to the conversation you were thinking about.

#### Why not just use Chrome's history-based suggestions?
- It only suggests based on URL, not actual Facebook friend/groupchat names.
- You'll waste time and data by loading a full page every time.
- You'll probably end up with a bunch of different Messenger tabs open.
- It doesn't have a cool icon.

___
### Details

This extension runs by listening to and acting upon Chrome tabs. It simply interacts with the Messenger web page - there is no accessing of your account, sending of messages, or leaking of databases.

Since the Zucc doesn't give public access to a Messenger API to send and receive messages with, we are stucc with using Facebook's own implementations. Mail helps improve this predicament by making messenger.com more powerful.

#### Permissions
On install, Mail will ask for permission to:
- *Read and change data for messenger.com*
- *Read your browsing history*

While the first is pretty self explanatory, the second may sound unnecessary. The reason it comes up is that mail accesses the [tabs api](https://developer.chrome.com/extensions/tabs) to control how to open the messenger tab. [All Chrome extensions that use this api elicit this warning](https://developer.chrome.com/extensions/permission_warnings).





___
Thanks to [Hare Krishna](https://thenounproject.com/aathis/) and [The Noun Project](https://thenounproject.com) for the icon.
