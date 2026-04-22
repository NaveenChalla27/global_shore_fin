// PM2 process file — run with: `pm2 start ecosystem.config.cjs`
module.exports = {
    apps: [
        {
            name: "edge-service",
            script: "server.js",
            cwd: __dirname,
            instances: 1,
            exec_mode: "fork",
            autorestart: true,
            watch: false,
            max_memory_restart: "300M",
            env: {
                NODE_ENV: "production",
                PORT: 4000,
                // Override these via `pm2 start ecosystem.config.cjs --update-env`
                // after editing .env, or set them here directly.
                ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || "",
                EXPOSE_DOCS: process.env.EXPOSE_DOCS || "false",
            },
        },
    ],
};
