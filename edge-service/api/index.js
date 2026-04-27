// Vercel auto-discovers files in /api/ as serverless functions.
// This re-exports the Express app as the default handler.
import { createApp } from "../src/app.js";

export default createApp();
