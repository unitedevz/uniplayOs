# uniplayOs



this is our building block 👇

uniplayos/
│
├── 📄 index.js                 # Main server
├── 📄 proxy.js                 # Media proxy
├── 📄 embed.js                 # Embed script for websites
├── 📄 package.json             # Dependencies
├── 📄 .gitignore               # Git ignore
├── 📄 README.md                # Documentation
│
└── 📁 public/
    │
    ├── 📄 index.html           # Home (HTML + CSS + JS all in one)
    ├── 📄 player.html          # Player (HTML + CSS + JS all in one)
    ├── 📄 downloads.html       # Downloads (HTML + CSS + JS all in one)
    ├── 📄 settings.html        # Settings (HTML + CSS + JS all in one)
    ├── 📄 explore.html         # Explore (HTML + CSS + JS all in one)
    │
    └── 📁 js/
        └── 📁 utils/           # Shared utilities (loaded by all pages)
            ├── 📄 utils.js
            ├── 📄 storage.js
            ├── 📄 api.js
            ├── 📄 resolver.js
            └── 📄 download.js
