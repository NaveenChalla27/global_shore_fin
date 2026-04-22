# Deploying to Hostinger

This project has two parts:

| Part | Stack | Where it goes on Hostinger |
| --- | --- | --- |
| `client/` | React + Vite (static files) | **Web Hosting** → `public_html` (or any subdirectory + domain) |
| `edge-service/` | Node.js (Express) | **Cloud Hosting** or **VPS** (shared Web Hosting cannot run Node) |

> Hostinger's *Premium / Business Web Hosting* plans are PHP-only and cannot host the Node API. You need either a **VPS** plan or a **Cloud Startup/Professional** plan with Node.js support for the edge-service. The static React app can stay on any plan.

---

## 0. One-time DNS setup (recommended)

Point two records to your Hostinger services:

```
globalshorefinservices.com     A     <web hosting IP>
www                            CNAME globalshorefinservices.com
api.globalshorefinservices.com A     <vps / cloud IP>
```

Issue free SSL for both in **hPanel → SSL** (Let's Encrypt).

---

## 1. Build & deploy the React client

### a) Configure the API URL

Edit `client/.env.production`:

```env
VITE_API_BASE_URL=https://api.globalshorefinservices.com/api
```

### b) Build locally

```powershell
cd client
npm ci
npm run build
```

Vite emits the production bundle into `client/dist/`.

### c) Upload to Hostinger

In **hPanel → File Manager → public_html**:

1. Delete the default `default.php` / placeholder files.
2. Upload **everything inside** `client/dist/` (not the `dist` folder itself).
   - `index.html`
   - `assets/` (hashed JS + CSS)
   - `api/` (static JSON fallbacks)
   - `.htaccess` (already included from `public/.htaccess`)

> Tip: zip the `dist` folder, upload the zip, then *Extract* in File Manager — much faster than drag-drop.

### d) Verify

- `https://globalshorefinservices.com/` → home page.
- Refresh on `/blog` → still loads (the `.htaccess` rewrites everything to `index.html`).
- Open DevTools → Network → confirm `https://api.globalshorefinservices.com/api/countries` returns 200.

---

## 2. Deploy the edge-service to Hostinger VPS / Cloud

### a) Provision

**hPanel → VPS → New VPS** (Ubuntu 22.04 template). SSH in:

```bash
ssh root@<vps-ip>
```

### b) Install Node 20 + PM2 + nginx

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx
sudo npm install -g pm2
```

### c) Push the code

From your laptop:

```powershell
cd C:\Users\Naveen_Challa1\Desktop\mohan_project
scp -r edge-service root@<vps-ip>:/var/www/
```

(Or `git clone` on the VPS — preferred. Add a private GitHub repo and clone it.)

### d) Install + configure

```bash
cd /var/www/edge-service
npm ci --omit=dev
cp .env.example .env
nano .env          # set ALLOWED_ORIGINS to your front-end origin(s)
```

### e) Start with PM2

```bash
pm2 start ecosystem.config.cjs --update-env
pm2 save
pm2 startup        # follow the printed `sudo env PATH=... systemctl ...` command
```

Confirm: `curl http://localhost:4000/api/health` → `{"ok":true,"service":"edge"}`.

### f) Reverse-proxy with nginx (so the API is reachable on port 443)

```bash
sudo nano /etc/nginx/sites-available/edge-service
```

```nginx
server {
    listen 80;
    server_name api.globalshorefinservices.com;

    client_max_body_size 2m;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/edge-service /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### g) HTTPS via Let's Encrypt

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.globalshorefinservices.com
```

Certbot rewrites the nginx config to listen on 443 and auto-renews via cron.

### h) Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## 3. Post-deploy checks

- `https://api.globalshorefinservices.com/api/health` → 200
- Front-end home page loads countries from the API (Network tab).
- Submit a booking form → `GET https://api.globalshorefinservices.com/api/bookings` shows the new entry.
- `pm2 logs edge-service` → no errors.

---

## 4. Re-deploys

### Client (every time you change UI)

```powershell
cd client
npm run build
# upload contents of dist/ to public_html (overwrite)
```

### Edge-service (every time you change API)

```bash
ssh root@<vps-ip>
cd /var/www/edge-service
git pull           # or rsync the new files
npm ci --omit=dev
pm2 restart edge-service --update-env
```

---

## 5. Backups

Bookings, posts, contacts, countries are JSON files under `edge-service/data/`. Add a daily cron:

```bash
sudo crontab -e
0 2 * * * tar -czf /var/backups/edge-service-$(date +\%F).tgz /var/www/edge-service/data
```

---

## 6. Optional — single-server layout

If you bought one VPS and want both on it:

1. Build the React app and copy `client/dist/` to `/var/www/globalshore-web/`.
2. Add a second nginx server block:

```nginx
server {
    listen 80;
    server_name globalshorefinservices.com www.globalshorefinservices.com;
    root /var/www/globalshore-web;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

3. Run certbot on that domain too. Set `VITE_API_BASE_URL=https://api.globalshorefinservices.com/api` (or `/api` if you proxy everything through one host).
