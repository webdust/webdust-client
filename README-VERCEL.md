# Webdust v3 for the existing Vercel project

This is the Arabian-marketplace v3 design, prepared for the existing `webdust/webdust-client` GitHub repository. It belongs in the **webdust-v3** subfolder. The existing Remix source stays in place.

## Upload through GitHub

1. Extract the ZIP on Windows.
2. Open https://github.com/webdust/webdust-client and choose **Add file → Upload files**.
3. Drag the entire extracted **webdust-v3 folder** onto the upload page. Upload the folder, not the ZIP and not its loose contents.
4. Verify that the listed paths start with `webdust-v3/`, including `webdust-v3/package.json` and `webdust-v3/vercel.json`.
5. Commit the files to `main` with the message `Add Webdust v3 website`.

## Configure the existing Vercel project

In `webdust-client-mpgf`, open Settings → Build and Deployment (or General, depending on the dashboard layout).

- **Root Directory:** `webdust-v3`
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm ci`
- **Node.js Version:** 22.x

The bundled `vercel.json` supplies the framework, build, output and install settings. Set Root Directory in the Vercel dashboard. Save and redeploy the latest `main` commit. Disabling the old build cache for the first deployment avoids carrying over the old Remix build state.

Vercel may initially rebuild the existing Remix root when the upload is committed. The v3 design is deployed only after the project uses `webdust-v3` as its Root Directory and is redeployed successfully.

Keep the existing `webdust.in` project domain, Vercel DNS records and Zoho email records unchanged. Cloudflare is not required for this route.

Check the new deployment URL before relying on the production domain. The old source remains in Git history and at the repository root; switching Root Directory back to its previous value and redeploying is a source-level fallback.

## Editing later

The content studio is local-only. For local editing: `npm.cmd ci`, then `npm.cmd run dev`. Edit the website through its footer button and save to `data/content.json`. Commit the changed content file to GitHub to trigger a new deployment. The public site reads the built `content.json` snapshot and does not expose the local write API.

The default project entries are labelled concepts. The contact form prepares an email in the visitor's email application; it does not send server-side email automatically.

## Validation and references

Run `npm.cmd test` and `npm.cmd run build` from this folder. Vercel settings follow https://vercel.com/docs/frameworks/frontend/vite and https://vercel.com/docs/project-configuration/vercel-json .
