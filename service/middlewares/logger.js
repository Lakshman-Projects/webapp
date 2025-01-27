import morgan from "morgan";
import fs from "fs";
import path from "path";

// Create a writable stream for file logging
const logStream = fs.createWriteStream(path.join("logs", "access.log"), {
    flags: "a",
});

// Morgan middleware hybrid(console + file) setup
const logger = morgan("combined", {
    stream: {
        write: (message) => {
            console.log(message.trim()); // Log to console
            logStream.write(message); // Write to file
        },
    },
});

export default logger;
