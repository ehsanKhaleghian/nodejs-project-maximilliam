const http = require("http");
const route = require("./routes.js");

const server = http.createServer(route);
server.listen(7000);
