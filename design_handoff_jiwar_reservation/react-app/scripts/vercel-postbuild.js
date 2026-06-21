// Vercel runs `vercel-build` instead of `build` automatically if it exists.
// This repo builds one dist/ with two entries (index.html = client, admin.html
// = admin). Each Vercel project sets DEPLOY_TARGET=admin or =client as an env
// var, and this script makes the right entry the SPA root for that project.
import { copyFileSync, existsSync } from 'node:fs';

if (process.env.DEPLOY_TARGET === 'admin') {
  if (!existsSync('dist/admin.html')) {
    throw new Error('dist/admin.html not found — did the build run?');
  }
  copyFileSync('dist/admin.html', 'dist/index.html');
  console.log('[vercel-postbuild] DEPLOY_TARGET=admin — admin.html is now the SPA root');
} else {
  console.log('[vercel-postbuild] DEPLOY_TARGET=client (default) — index.html is the SPA root');
}
