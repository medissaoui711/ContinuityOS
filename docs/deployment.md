# 🚀 Production Deployment & Hosting Guide
### دليل النشر والتشغيل على خوادم الاستضافة الإنتاجية

---

## 🎯 Deployment Overview | نظرة عامة على النشر

**AR:** يوفر هذا الدليل الخطوات العملية والتعليمات الصارمة لنشر وتدشين منظومة **BCM Command Center** على البيئات المتقدمة مثل **Google Cloud Run**، **Vercel**، **Firebase Hosting**، وأي خادم استضافة ملفات ثنائية أو ثابته.

**EN:** This deployment guide outlines step-by-step instructions for building, validating, and hosting the **BCM Command Center** across enterprise-grade cloud container runtimes (**Google Cloud Run**) and modern edge static hosts (**Vercel**, **Firebase Hosting**, **Netlify**).

---

## 📋 Pre-Deployment Validation | التحقق قبل النشر

**AR:** قبل تنفيذ أمر البناء النهائي، يجب التأكد من خلو المشروع من أخطاء التجميع والنمطية عبر تنفيذ الأوامر التالية:

```bash
# 1. Run TypeScript Type Check | فحص أنواع TypeScript
npm run lint

# 2. Test Production Bundle Locally | اختبار البناء إنتاجياً محلياً
npm run build
```

---

## 📦 Production Build Command | أمر البناء الإنتاجي

```bash
# Generate optimized static bundle in dist/ directory
npm run build
```

The build command executes `vite build`, emitting static production assets into the `dist/` folder:
```
dist/
├── index.html          # Optimized HTML Entry
├── assets/
│   ├── index-*.js      # Minified & Tree-Shaken JavaScript Bundle
│   └── index-*.css     # Processed & Compressed Tailwind CSS Bundle
```

---

## ☁️ Deployment Target Strategies | استراتيجيات منصات النشر

### 1. Google Cloud Run (Containerized Deployment)
**AR:** الاستضافة الأساسية في بيئة الحاويات المعزولة Docker/Cloud Run:

* **Container Port Requirement:** `3000` (مُثبت وموجه عبر Nginx Reverse Proxy).
* **Start Command in `package.json`:**
  ```json
  {
    "scripts": {
      "start": "node server.ts",
      "build": "vite build"
    }
  }
  ```
* **Command:**
  ```bash
  gcloud run deploy bcm-command-center \
    --source . \
    --platform managed \
    --region europe-west2 \
    --allow-unauthenticated \
    --port 3000
  ```

### 2. Vercel / Netlify (Edge CDN Deployment)
**AR:** التوزيع على شبكات Vercel السريعة:

1. Link your GitHub / GitLab repository to Vercel.
2. Select **Vite** as the Framework Preset.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Click **Deploy**.

### 3. Firebase Hosting
```bash
# 1. Initialize Firebase Hosting
firebase init hosting

# 2. Set Public Directory to "dist"
# 3. Configure as single-page app: Yes

# 4. Deploy to Firebase
npm run build
firebase deploy --only hosting
```

---

## 🔐 Environment Variables & Security Configuration | المتغيرات والسرية

* **`.env.example` Declaration:**
  Ensure any new environment variables are documented in `.env.example`:
  ```env
  # .env.example
  VITE_APP_TITLE="BCM Command Center & Executive Operations Hub"
  ```
* **API Key Security Rule:** Never expose private API keys in client-side bundles. Always wrap server calls in `/api/*` Express routes if external AI/DB services are added.

---

## ✅ Post-Deployment Verification | التحقق بعد التدشين

1. **Verify HTTPS SSL Certificates:** Ensure traffic passes securely over HTTPS.
2. **Test Presence Grid Responsiveness:** Toggle staff presence status to verify zero-latency state persistence in `LocalStorage`.
3. **Verify ISO Continuity Score:** Confirm score calculation updates dynamically on attendance change.

<p align="center"><b>Production Deployment Ready • Enterprise Reliability Guaranteed</b></p>
