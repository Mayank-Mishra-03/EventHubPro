import "./utils/env.util.js";
import app from "./app.js";
import { connectSQL } from "./db/connectionToSQL.js";

connectSQL()
    .then(() => {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error starting the server:', error.message);
    });