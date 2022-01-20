# THIS PROJECT IS ABANDONED (This page is also outdated, its just here as an "Archive")
**Why did i abandon the project?**

At the time i had several health issues, mental ones included unfortunately
Some of the problems like a infection i had (?) were solved, others remain
I might be feeling/getting better but i dont want to continue this project anymore, in fact sometimes i dont even feel like coding.

**What about the source code?**

Feel free to use the code as you like, fork it, whatever, just credit me if i inspire you to do anything
Its hard to give up on something i spent 3 months making pretty much alone just to give up at the last step... 
But its better to release the code than to let it rot in a Hard Drive.
Not sure if the program will work, but you will have to install Electron manually on the project's folder

# CryptoDot.JS

Cryptography made simple, open-source, and free!

## What is CryptoDot and how was it made?
CryptoDot was made to simplify your Encryption needs.

The program was made with [HTML5](https://en.wikipedia.org/wiki/HTML5), [CSS](https://en.wikipedia.org/wiki/CSS) and [Node.js](https://en.wikipedia.org/wiki/Node.js) with the help of the Software Framework [Electron.js](https://en.wikipedia.org/wiki/Electron_(software_framework)).

Previously it was made with [GODOT Engine](https://godotengine.org/) but it was too resource intensive for a text app.

## Libaries used
The Library i used for Encryption and Decryption is [Crypto.JS](https://cryptojs.gitbook.io/docs/)

The library used for Single-Page-App was written by 10c8

## How does the program work?
You can Encrypt any Text Data using a Node Name and a Node Key

The same goes for Decryption, but to Decrypt you only need the Node Name and the Node Key

The data input/output is in Node Content

**Notes for Encryption: If a Node already exists with that name, it will OVERWRITE it! so be careful (and i don't intend to change this)**

**Note 2: If you are afraid to acidentally overwrite a Node, you can always save the Node Name somewhere safe, as even if they have the name, they won't know whats inside without the password ;)**

**(Not even me, thats the 🦆ing point anyway).**

## Nodes explained
Nodes are just Fancy names. Thats all.

**Node Name = File Name (Output will be a [SHA-256 hash](https://en.wikipedia.org/wiki/SHA-2))**

**Node Key = Encryption Key (Will be converted to [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2))**

**Node Content = Data Input/Output (depends on the operation; will create [AES data](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) if you are encrypting)**

**Notes: Theoretically, not even the current [World's Strongest Computer](https://www.bbc.com/news/world-asia-53147684#:~:text=The%20newly%20crowned%20world's%20fastest,IBM%20machine%20in%20the%20US.) should be able to crack your Node any time soon (he's also busy fighting CoVid).**

Just don't use something simple as your Birthday as your Friends may guess it.

## Credits
**GitHub Inc. (Electron.JS)**

**Jeff Mott (Crypto.JS)**

**Evan Vosberg (Crypto.JS)**
    
**10c8 (Coast.JS)**
