# MyBot Front-End Deployment Guide (cPanel / Superhosting.bg)

This guide explains how to build and deploy the React front-end to a cPanel-based hosting environment like Superhosting.bg.

## Prerequisites
1.  **Node.js**: Ensure you have Node.js installed locally to run the build.
2.  **FTP/File Manager Access**: You need access to your cPanel File Manager or an FTP client (like FileZilla).

## Step 1: Configuration Check
Ensure `MyBotFrontEnd/src/utils/api.js` points to your production API URL:
```javascript
const api = axios.create({
  baseURL: 'https://your-api-url.com/api', // Update this to your live Render/cPanel API URL
});
```

## Step 2: Build the Project
Run the following command in the `MyBotFrontEnd` directory:
```bash
npm run build
```
This will create a `dist` folder containing the optimized production files.

## Step 3: Deployment to cPanel
1.  **Open File Manager**: Log into cPanel and go to **File Manager**.
2.  **Navigate to Root**: Go to `public_html` (or the subdirectory where you want to host the site).
3.  **Upload Files**: Upload all the contents of the `dist` folder directly into `public_html`.
    -   *Note: Do not upload the `dist` folder itself, only its contents (index.html, assets/, .htaccess, etc.).*
4.  **Verify .htaccess**: Ensure the `.htaccess` file (provided in the `public` folder) is present in `public_html`. This file is crucial for React Router to work properly (it prevents 404 errors on page refresh).

## Routing Fix (.htaccess)
If you missed uploading the `.htaccess` file, create one in `public_html` with this content:
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## Handling Subdirectories
If you are hosting the app in a subdirectory (e.g., `MyBotRobotics.com/app/`):
1.  Update `vite.config.js`: `base: '/app/'`.
2.  Update `.htaccess`: `RewriteRule . /app/index.html [L]`.

## Troubleshooting
-   **White Screen**: Check the browser console (F12) for errors. Usually caused by incorrect `baseURL` in `api.js` or incorrect `base` in `vite.config.js`.
-   **404 on Refresh**: This means the `.htaccess` file is missing or not working.
