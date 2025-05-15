// loop through all the items in ../locales/locale/{portal,search,comments,ghost}.json and replace {{ with { and }} with }
let fs = require('fs');
let path = require('path');

const LOCALES_DIR = path.join(__dirname, 'locales');
const SUPPORTED_LOCALES = fs.readdirSync(LOCALES_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

SUPPORTED_LOCALES.forEach(locale => {
    const portal = require(path.join(LOCALES_DIR, locale, 'portal.json'));
    const search = require(path.join(LOCALES_DIR, locale, 'search.json'));
    const comments = require(path.join(LOCALES_DIR, locale, 'comments.json'));
    const ghost = require(path.join(LOCALES_DIR, locale, 'ghost.json'));
    const signupForm = require(path.join(LOCALES_DIR, locale, 'signup-form.json'));

    const files = [portal, search, comments, ghost, signupForm];
    console.log('Processing locale:', locale);
    files.forEach(file => {
        for (const key in file) {
            // Replace all occurrences of {{ with { and }} with } in both the key and the value
            if (file.hasOwnProperty(key)) {
                // fix the value
                file[key] = file[key].replace(/{{/g, '{').replace(/}}/g, '}');
                // change the key itself
                if (key.includes('{{') && key.includes('}}')) {
                    let newKey = key.replace(/{{/g, '{').replace(/}}/g, '}');
                    file[newKey] = file[key];
                    delete file[key];
                }
            }
        }
        // write out the updated file
        let filename = path.join(LOCALES_DIR, locale, 
            file === portal ? 'portal.json' : file === search ? 'search.json' : 
            file === comments ? 'comments.json' : file === ghost? 'ghost.json' : file === signupForm ? 'signup-form.json' : 'broken');
        fs.writeFileSync(filename, JSON.stringify(file, null, 4));

    });
});