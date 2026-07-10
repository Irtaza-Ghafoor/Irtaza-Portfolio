# Irtaza Ahmad Portfolio 🚀

A modern, responsive, and high-performance portfolio website built with React, TypeScript, and 3D technologies.

![Portfolio-Preview](public/images/preview.png)

## About Me 👋

I'm **Irtaza Ahmad**, a Gold Medalist and AI/ML Engineer studying Computer Science at Bahria University (Lateral Entry BSCS, 2025 - 2027). I have a passion for turning data into intelligent, real-world solutions — designing, benchmarking, and deploying end-to-end machine learning pipelines across healthcare, telecom, and drug discovery.

## Features ✨

- 🧑‍🎨 **Interactive 3D character** rendered with Three.js / React Three Fiber that reacts to cursor movement.
- 🌀 **Buttery smooth scrolling** powered by GSAP ScrollSmoother, with scroll-scrubbed hero animations.
- 🪄 **Physics-driven tech stack** — floating skill balls simulated with Rapier physics.
- 📊 **Live GitHub section** — a self-updating contribution calendar (private repos included, via an authenticated serverless function), plus top repositories and profile stats pulled straight from the GitHub API.
- 📱 **Fully responsive** — tuned from large desktops down to small phones, with a polished mobile nav drawer.
- ✉️ **Working contact form** and a custom animated cursor.
- ⚡ **Performance-focused** — capped device pixel ratio, gated WebGL render loops, and lean scroll handlers.

## Featured Projects 🏗️

- **Customer Segmentation Matrix** - [GitHub](https://github.com/Irtaza-Ghafoor/customer-segmentation-matrix-kmeans)
  Unsupervised customer segmentation using K-Means++ and the Elbow Method.
- **Chronic Kidney Disease Prediction** - [GitHub](https://github.com/Irtaza-Ghafoor/chronic-kidney-disease-ensemble-prediction)
  Soft-voting ensemble (Random Forest, XGBoost, Logistic Regression) with MICE imputation for CKD risk screening.
- **Telecom Customer Churn Prediction** - [GitHub](https://github.com/Irtaza-Ghafoor/telecom-customer-churn-prediction-ensemble)
  Churn prediction with a stratified XGBoost + Random Forest ensemble (ROC-AUC ≈ 0.844).
- **Used Car Price Prediction** - [GitHub](https://github.com/Irtaza-Ghafoor/used-car-price-prediction-ensemble)
  Vehicle price regression using a Random Forest + XGBoost VotingRegressor (R² ≈ 0.9429).

## Professional Experience 💼

- **AI/ML Intern** @ Infinitiv.ai (2026 - Present)
  Building and evaluating machine learning pipelines — regression, classification, and ensemble models — with a focus on data preprocessing, feature engineering, and model deployment.

## Tech Stack 🛠️

- **Languages:** Python, C++, TypeScript, JavaScript
- **Machine Learning:** Scikit-Learn, XGBoost, LightGBM, CatBoost, Ensemble Learning (Voting, Stacking)
- **Data Engineering & EDA:** MICE Imputation, Feature Scaling, Frequency/Target Encoding, Pandas, NumPy
- **Deep Learning & GenAI:** PyTorch, TensorFlow, Hugging Face, LangChain, OpenAI & Anthropic APIs
- **Frontend (this site):** React, Vite, Three.js, React Three Fiber, GSAP
- **Tools:** Git, GitHub, Docker, Jupyter Notebook, Google Colab, VS Code

## Contact & Connect 🔗

- 📧 **Email:** [irtazaahmad2715@gmail.com](mailto:irtazaahmad2715@gmail.com)
- 🐙 **GitHub:** [@Irtaza-Ghafoor](https://github.com/Irtaza-Ghafoor)
- 💼 **LinkedIn:** [Irtaza Ahmad](https://www.linkedin.com/in/irtaza-ahmad-1962602a5/)
- 🐦 **Twitter/X:** [@irtazaghafoor27](https://x.com/irtazaghafoor27)
- 📸 **Instagram:** [@__.irtaza11](https://www.instagram.com/__.irtaza11)

## Getting Started 🚀

```bash
# Clone the repository
git clone https://github.com/Irtaza-Ghafoor/Irtaza-Portfolio.git
cd Irtaza-Portfolio

# Install dependencies
npm install

# Start the dev server
npm run dev

# Create a production build
npm run build

# Preview the production build
npm run preview
```

The app runs on Vite — the dev server starts at `http://localhost:5173` by default.

## Environment Variables 🔑

The serverless functions in [`/api`](api) need a few secrets. Add them to a
`.env.local` file (gitignored) for local development, and to your Vercel project's
**Settings → Environment Variables** for production.

| Variable | Used by | Purpose |
| --- | --- | --- |
| `GITHUB_TOKEN` | `api/github-contributions.ts`, `api/github-repos.ts` | GitHub PAT (classic, `read:user` scope). Powers the live GitHub section — **private-inclusive** contribution counts and **pinned** repositories. Without it, both endpoints fall back to public-only data. |
| `EMAIL_USER` | `api/contact.ts` | Gmail address that receives contact-form messages. |
| `EMAIL_PASS` | `api/contact.ts` | Gmail [app password](https://myaccount.google.com/apppasswords) for that account. |

> Serverless functions only run on Vercel (`vercel dev`), so plain `npm run dev`
> uses the public-only fallbacks locally. To include **private** contributions,
> also enable *GitHub → Settings → Public profile → "Include private contributions
> on my profile"*.

## GitHub Integration ⚙️

The live GitHub section is driven by two small serverless functions in [`/api`](api)
that talk to GitHub's **authenticated GraphQL API** (using `GITHUB_TOKEN`). Both are
edge-cached and auto-update — no redeploy needed when your GitHub activity changes.

### Live contributions — [`api/github-contributions.ts`](api/github-contributions.ts)

- Returns the **contribution calendar for a given year** (`?year=2026`), including
  **private-repo** contributions so the total matches what you see on your GitHub
  profile. Falls back to the public API (public-only count) if the token is missing.
- The frontend renders a **custom calendar grid** (in the site's teal theme) with a
  **year selector** — current year back to your account's join year — and always
  draws the **full Jan–Dec** grid like GitHub, with future days as empty cells.
- **Timezone-correct:** year boundaries use `TZ_OFFSET` (default `+05:00`, PKT) so
  today's contributions bucket onto the right day. Change this one constant if your
  GitHub timezone differs.
- **Cache:** 5 minutes — new contributions appear within ~5–10 minutes.

### Pinned repositories — [`api/github-repos.ts`](api/github-repos.ts)

- Returns your **first 3 pinned repositories** (name, description, language, stars,
  forks) via GraphQL — pinned repos are **not** available through the REST API.
- Change your pins on GitHub and the site follows automatically (in pin order).
  Falls back to most recently-updated public repos if the token is missing or you
  have no pins.
- **Cache:** 1 hour — pins change rarely.

## License

This project is open source and available under the [MIT License](LICENSE).
