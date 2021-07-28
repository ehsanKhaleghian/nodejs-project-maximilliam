const fs = require("fs");
const body = [];

const routes = (req, res) => {
    const url = req.url;
    const method = req.method;
    if (url === "/") {
        res.setHeader("Content-Type", "text/html");
        res.write("<html>");
        res.write("<head><title>INPUT MESSAGE</title><head>");
        res.write(
            "<body><form action='message' method='POST'><input type='text' name='senior developer'><button type='submit'>SEND</button></input></form></body>"
        );
        res.write("</html>");
        return res.end();
    }
    if (url === "/message" && method === "POST") {
        req.on("data", (chunk) => {
            body.push(chunk);
        });
        req.on("end", () => {
            const parsedBody = Buffer.concat(body).toString();
            res.statusCode = 302;
            fs.writeFileSync("message.txt", parsedBody);
            res.setHeader("location", "/");
            return res.end();
        });
    }
};

module.exports = routes;
