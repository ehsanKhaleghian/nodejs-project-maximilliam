const fs = require("fs");
fs.writeFileSync("nodeText.txt", "Hello From Node");

setTimeout(() => console.log("Fetch Data"), 2000);
