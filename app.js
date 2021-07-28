const http = require("http");
const routse = require("./routes");

const server = http.createServer(routse);
server.listen(7777);
