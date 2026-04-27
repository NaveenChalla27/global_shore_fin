import { createApp } from "../src/app.js";

let app;

export const config = {
  runtime: "nodejs",
};

export default function handler(req, res) {
  if (!app) {
    app = createApp(); // cache instance
  }
  return app(req, res);
}