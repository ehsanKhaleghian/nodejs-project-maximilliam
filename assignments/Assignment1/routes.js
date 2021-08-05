const routes = (req, res) => {
    const { url, method } = req;
    if (url === "/") {
        res.setHeader("Content-Type", "text/html");
        res.write(`
        <html>
            <title>
                Assignment
            </title>
            <body>
                <h1>Welcome to Our SITE</h1>
            </body>
        </html>
        `);
        return res.end();
    }
    if (url === "/user") {
        res.write(`
        <html>
            <title>
                User Page
            </title>
            <body>
                <ul>
                    <li>User Number One</li>
                    <li>User Number Two</li>
                    <li>User Number Three</li>
                    <li>User Number Four</li>
                </ul>
            </body>
        </html>
        `);
    }
};

module.exports = routes;
