const express = require('express');
const fs = require('fs');
const app = express();

let port = 12312;

app.use(express.static('public'));

app.get('/', (req, res) => {
	fs.readFile('public/index.html' ,(err, contents) => res.send(contents.toString()));
});

app.listen(port, () => console.log('Server start listening on %d', port));