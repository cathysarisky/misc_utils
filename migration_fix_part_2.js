// Combine newsletter.json and ghost.json files for each locale
let fs = require('fs');
let path = require('path');

const LOCALES_DIR = path.join(__dirname, 'locales');
const SUPPORTED_LOCALES = fs.readdirSync(LOCALES_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

SUPPORTED_LOCALES.forEach(locale => {
    console.log('Processing locale:', locale);
    
    try {
        const newsletter = require(path.join(LOCALES_DIR, locale, 'newsletter.json'));
        const ghost = require(path.join(LOCALES_DIR, locale, 'ghost.json'));
        
        // Combine the objects
        const combined = {
            ...newsletter,
            ...ghost
        };
        
        // Write the combined file
        const outputPath = path.join(LOCALES_DIR, locale, 'ghost.json');
        fs.writeFileSync(outputPath, JSON.stringify(combined, null, 4));
        console.log(`Successfully combined files for ${locale}`);
    } catch (error) {
        console.error(`Error processing ${locale}:`, error.message);
    }
});