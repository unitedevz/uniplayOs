# uniplayOs



this is our building block 👇

## Project Structure

```text
uniplayos/
├── index.js
├── proxy.js
├── embed.js
├── package.json
├── .gitignore
├── README.md
└── public/
    └── js/
        └── utils/
            ├── utils.js
            ├── storage.js
            ├── api.js
            ├── resolver.js
            └── download.js
└── views/
    └── components/
        ├── header.ejs
        ├── footer.ejs
    └── layouts/
        ├── mainLayout.ejs
    ├── index.ejs
    ├── player.ejs
    ├── downloads.ejs
    ├── settings.ejs
    ├── explore.ejs
```

we have added embed.js this is the entry point for websites to add UniplayOS to their pages. It's like a bridge between the website and our UniplayOS player.
so when user uses let's say : uniplayOs.com/embed.js it calls player.html
