const http = require("http");
const fs = require("fs");
const server = http.createServer((req, res) => {
    const url = req.url;
    console.log("URL::::", url);
    const method = req.method;
    if (url === "/message") {
        res.setHeader("Content-Type", "text/html");
        res.write("<html>");
        res.write("<head><title>INPUT MESSAGE</title><head>");
        res.write(
            "<body><form action='message' method='POST'><input type='text' name='message'><button type='submit'>SEND</button></input></form></body>"
        );
        res.write("</html>");
        return res.end();
    }
    if (url === "/message" && method === "POST") {
        fs.writeFileSync("message.txt", "DUMMY");
        res.statusCode = 302;
        res.setHeader("location", "/");
        return res.end();
    }
});
server.listen(7777);
