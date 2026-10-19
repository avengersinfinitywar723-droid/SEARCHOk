# SEARCH OK – Hosting Guide

## Pehle website ka code GitHub mein add hona chahiye

Sirf repository banane se website ka code usme nahi aata. Preview par `/guide/github` kholo. Apna repository naam check karo, **GitHub mein code add karo** dabao aur GitHub editor mein **Commit changes** karo. Actions run hone ke baad Code tab mein `src/`, `package.json`, `package-lock.json`, `Dockerfile`, aur `public/` dikhne chahiye.

Agar editor blank ho to guide ka **Import file copy karo** button use karke paste karo. GitHub Actions disabled hon to repository ke Actions tab se enable karo. Actions/branch policies import ko block karein to ZIP wala manual option use karo.

### ZIP wala option

Preview par `/downloads/search-ok-source.zip` kholo. ZIP ko pehle Extract karo. Computer par GitHub ke **Upload files** page mein extracted folders aur files drag-drop karke Commit karo. `package.json` repo root mein hona chahiye. Sirf ZIP upload karne se code extract nahi hoga. Phone par folders upload karna mushkil ho sakta hai; import button behtar hai.

`.env`, passwords, API keys aur apni video files GitHub par mat daalo.

## Railway deployment

Railway ki current pricing aur account limits pehle check karo: https://docs.railway.com/pricing/plans . Trial/free credits limited hain; ye unlimited, hamesha-free hosting ka promise nahi hai.

1. Railway par GitHub se login karo.
2. **New Project → Deploy from GitHub repo** mein apni repository select karo.
3. Project mein **New → Database → PostgreSQL** add karo.
4. Website service ke **Variables** mein set karo:
   - `DATABASE_URL`: PostgreSQL service ka reference, jaise `${{Postgres.DATABASE_URL}}`. Database service ka naam alag ho to reference bhi alag hoga; variable reference picker use karo.
   - `UPLOAD_DIR`: `/app/uploads`
5. Website service ko ek persistent **Volume** attach karo. Mount path `/app/uploads` rakho. Storage plan ki capacity check karo.
6. Changes deploy karo. Build complete aur service healthy hone ka intezar karo.
7. **Settings → Networking → Generate Domain**. Target port pooche to `3000` use karo.

Ye hosting link tab tak chalega jab tak service, database aur account active hain. Credits khatam hone ya service delete hone par site ruk sakti hai.

## Docker/VPS

Docker Compose v2 installed server par project folder mein `docker compose up -d --build` chalao. Included compose configuration app ko port 80 par publish karti hai aur database/video volumes rakhti hai. Server/firewall mein port 80 allow karo. Public production use ke liye HTTPS/reverse proxy, secure database credentials aur backups configure karo.

Oracle Always Free eligibility, regional availability aur capacity par depend karta hai. Isse guaranteed capacity ya permanent availability samajhkar mat chalo.

## Render

Included `render.yaml` se Blueprint deployment possible hai, subject to Render's current plans. Free ephemeral disk uploaded video files ko restart/redeploy par retain nahi karti. Free PostgreSQL bhi provider limits/expiry ke under hai. Sirf free Blueprint ko permanent video hosting na samjho; persistent video storage aur durable database chahiye.

## Important

- GitHub Pages is app ko nahi chala sakta: Next.js server aur PostgreSQL chahiye.
- Video count ki application limit nahi hai, lekin disk space, upload handling, bandwidth aur host limits apply hote hain.
- Current app mein login/access control nahi hai. Public use se pehle owner-only upload/edit/delete protection add karo.
- `DATABASE_URL` sirf hosting ke Secrets/Variables mein rakho, repository mein nahi.
