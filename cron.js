const path = require('path');
const fs = require('fs');

async function unlinktmp() {
    let dir = path.join(__dirname, './public/tmp');
    let files = fs.readdirSync(dir);
    // filter .gitkeep
    files = files.filter((file) => file !== '.gitkeep');
    files.forEach((file) => {
        fs.unlinkSync(dir + '/' + file);
    });
    
}
unlinktmp();