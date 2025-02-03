// Importing Neccesary libraries

const fs = require("fs");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const PORT = process.env.PORT || 5000;
const LOG_FILE = "logfile.log";

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public")); // Serve frontend files

// Function to get last 10 lines of the log file
function getLast10Lines(filePath) {
    if (!fs.existsSync(filePath)) return "Log file not found.";

    const stats = fs.statSync(filePath);
    const fileSize = stats.size;
    const bufferSize = 1024; // Read in chunks (1 KB)

    let buffer = Buffer.alloc(bufferSize);
    let position = fileSize;
    let lines = [];

    const fd = fs.openSync(filePath, "r"); // Opens file in read mode

    while (position > 0 && lines.length < 10) {
        const bytesToRead = Math.min(bufferSize, position);
        position -= bytesToRead;
        fs.readSync(fd, buffer, 0, bytesToRead, position);

        const chunk = buffer.toString("utf-8", 0, bytesToRead);
        lines = chunk.split("\n").concat(lines).slice(-10);
    }

    fs.closeSync(fd);
    return lines.join("\n");
}

io.on("connection", (socket) => {
    console.log("Client Connected");

    // Send last 10 lines when client connects
    socket.emit("initialLogs", getLast10Lines(LOG_FILE));

    // Watch for new log updates
    fs.watchFile(LOG_FILE, { interval: 1000 }, (curr, prev) => {
        if (curr.mtime !== prev.mtime) {
            fs.readFile(LOG_FILE, "utf-8", (err, data) => {
                if (err) return console.error("Error reading log file:", err);
                const lines = data.trim().split("\n");
                const newLog = lines[lines.length - 1]; // Get the latest log
                socket.emit("newLog", newLog);
            });
        }
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
        fs.unwatchFile(LOG_FILE);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});