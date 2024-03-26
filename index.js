const express = require("express");
const app = express();
const fs = require("fs");
const mime = require('mime-types')

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/video/:file", function (req, res) {
    const selectedFile = req.params.file;
const range = req.headers.range;
if (!range) {
    res.status(400).send("range not found on the header");
}

const videoPath = "storage/"+selectedFile;
const file = fs.statSync(videoPath)
const videoSize = file.size;
const fileType = mime.lookup(videoPath);

const start = Number(range.replace(/\D/g, ""));
const end = Math.min(start + mbToBytes(1), videoSize - 1);

const contentLength = end - start + 1;
const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": fileType,
};

res.writeHead(206, headers);

const videoStream = fs.createReadStream(videoPath, { start, end });
videoStream.pipe(res);
});


function mbToBytes(size) {
    return size * 1000000
}

app.listen(8000, function () {
    console.log("Listening on port 8000!");
});