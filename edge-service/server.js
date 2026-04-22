// Bootstrap. Just starts the app the factory builds.
import {createApp} from "./src/app.js";
import {DATA_DIR, PORT} from "./src/config/paths.js";

const app = createApp();

app.listen(PORT, () => {
    console.log(`[edge-service] listening on http://localhost:${PORT}`);
    console.log(`[edge-service] docs:       http://localhost:${PORT}/docs`);
});
