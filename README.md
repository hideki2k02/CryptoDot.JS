# CryptoDot.JS
### Cryptography made simple, open-source, and free!

# What is CryptoDot and how was it made?
### CryptoDot was made to simplify your Encryption needs.

### The program was made with [HTML5](https://en.wikipedia.org/wiki/HTML5), [CSS](https://en.wikipedia.org/wiki/CSS) and [Node.js](https://en.wikipedia.org/wiki/Node.js) with the help of the Software Framework [Electron.js](https://en.wikipedia.org/wiki/Electron_(software_framework)).

## Previously it was made with [GODOT Engine](https://godotengine.org/) but it was too resource intensive for a text app.

# Libaries used
### The Library i used for Encryption and Decryption is [Crypto.JS](https://cryptojs.gitbook.io/docs/)
### The library i used to generate Public/Private Keys: [TweetNaCl.js](https://www.npmjs.com/package/tweetnacl)
### The library used for Single-Page-App was written by 10c8
### The Encryption Methods i used are: [AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) (key varies), [SHA-256](https://en.wikipedia.org/wiki/SHA-2) and [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2)

# How does the program work?
### You can Encrypt any Data using a Node Name and a Node Key
### The same goes for Decryption, but to Decrypt you only need the Node Name and the Node Key
### The data input/output is in Node Content

### Notes for Encryption: If a Node already exists with that name, it will OVERWRITE it! so be careful (and i don't intend to change this for now)
### Note 2: If you are afraid to acidentally overwrite a Node, you can always save the Node Name somewhere safe, as even if they have the name, they won't know whats inside without the password ;)

### (Not even me, thats the 🦆ing point anyway).

# Nodes explained
### Nodes are just Fancy names. Thats all.

### Node Name = File Name (Output will be a [SHA-256 hash](https://en.wikipedia.org/wiki/SHA-2))
### Node Key = Encryption Key (Will be converted to [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2))
### Node Content = Data Input/Output (depends on the operation; will create [AES data](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) if you are encrypting)

### Notes: Theoretically, not even the current [World's Strongest Computer](https://www.bbc.com/news/world-asia-53147684#:~:text=The%20newly%20crowned%20world's%20fastest,IBM%20machine%20in%20the%20US.) should be able to crack your Node any time soon (he's also busy fighting CoVid). Just don't use something simple as your Birthday as your Friends may guess it.

# Donations?
### Check [this page](https://www.notion.so/Buy-me-a-Coffe-623096e67a074056be6bf11e33ea4bb8) to Donate me some Crypto!

# TL;DR Licensing
# Copyright (c) 2013-2021 GitHub Inc. (Electron.JS)
# Copyright (c) 2009-2013 Jeff Mott (Crypto.JS)
# Copyright (c) 2013-2016 Evan Vosberg (Crypto.JS)
# Copyright (c) 2020-2021 10c8 (Coast.JS)
# Copyright (c) 2020 dchest (TweetNaCl.js)

### NONE of the Libraries used on this Program are owned by me. I only used them and i do NOT take credit for any.
### All rights reserved to their respective owners.

### The ONLY thing that is Copyrighted by me is the program itself, following the statement below:

### 1. You CAN share the program as long as you DO NOT make profit from it.
### 2. I'm not responsible for anything that happens related to this program.
### 3. You SHOULD AVOID reposting the download for this program, you should instead use my Github link
### 4. You MAY NOT claim the program as your own
