const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
    const { url } = req;
    if (url === "/ehsan") {
        res.write(
            "<html><head><titel>Ehsan First Server</title><body><h2>EHSNAN ROUT</h2></body></head></html>"
        );
    }
    console.log("URL:::", url);
    return res.end();
});

server.listen(7000);
