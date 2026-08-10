# WorldStar Hip Hop - Official Platform

Enterprise Next.js 14 Web Application for WorldStar Hip Hop, featuring cinematic artist rosters, HD music video pipelines, live audio streaming, and executive A&R admin management.

## 🚀 Quick Start Guide (For Any Computer / Laptop)

### 1. Clone Repository
```bash
git clone https://github.com/website7742-rgb/web.git
cd web
```

### 2. Environment Setup
Create a `.env.local` file in the root directory and copy the contents from `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://krnsfelxtkpsiueuovwp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

CLOUDFLARE_R2_ACCOUNT_ID="your_account_id"
CLOUDFLARE_R2_ACCESS_KEY_ID="your_access_key"
CLOUDFLARE_R2_SECRET_ACCESS_KEY="your_secret_key"
CLOUDFLARE_R2_BUCKET_NAME="worldstarhiphop"

RESEND_API_KEY="your_resend_api_key"
VERCEL_TOKEN="your_vercel_token"
GITHUB_TOKEN="your_github_token"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Localhost Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Live Production Application
- **Main Production Link**: [https://website7742-rgb.vercel.app](https://website7742-rgb.vercel.app)
- **Web Mirror**: [https://web-dusky-pi-53.vercel.app](https://web-dusky-pi-53.vercel.app)

---

## 🛠 Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS, Framer Motion
- **Database & Storage**: Supabase Cloud, Cloudflare R2
- **Hosting**: Vercel CI/CD
- **Version Control**: Git / GitHub (`website7742-rgb/web`)
