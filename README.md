# Neha's Creative Portfolio Website

A clean, modern, and responsive portfolio website built with pure **HTML5, CSS3, and minimal vanilla JavaScript**. Designed specifically for internship and entry-level job applications in **Graphic Design, Filmmaking, Video Editing, and Creative Media**.

---

## 📁 Project Structure

```
neha-portfolio/
├── index.html              # Main webpage with Hero, Reel, Projects, About, Skills & Contact
├── style.css               # Clean styling, CSS variables (dark theme), responsive layouts
├── script.js               # Minimal vanilla JS (filtering, mobile menu, modals, email copy)
├── README.md               # Quick-start guide and customization instructions
└── assets/
    ├── images/             # Place your project thumbnails, mockups, and profile photo here
    ├── videos/             # Place your showreel (.mp4 / .webm) or poster thumbnails here
    └── documents/          # Place your downloadable resume (e.g., resume.pdf) here
```

---

## 🚀 How to Run & View Locally

1. Open the `neha-portfolio` folder on your computer.
2. Double-click **`index.html`** to open it in any web browser (Chrome, Edge, Firefox, Safari).
3. Alternatively, if using VS Code, right-click `index.html` and click **"Open with Live Server"**.

---

## 🎨 How to Customize for Yourself

### 1. Adding Your Profile Photo
- Save your portrait as `profile.jpg` inside `assets/images/`.
- In `index.html`, locate the `#about` section and check the image path: `assets/images/profile.jpg`.

### 2. Adding Your Resume
- Save your resume PDF as `resume.pdf` inside `assets/documents/`.
- The "Download Resume" buttons in the navigation and About section are already linked to `assets/documents/resume.pdf`.

### 3. Adding Your Showreel Video
You have two easy options:
* **Option A (YouTube / Vimeo Embed):** Open `index.html`, find the `#reel` section, and paste your YouTube/Vimeo embed `<iframe>` into the designated placeholder.
* **Option B (Direct MP4 File):** Save your video file to `assets/videos/showreel.mp4` and uncomment the `<video>` tag provided in `index.html`.

### 4. Adding Your Own Projects
In `index.html`, find the `<div class="projects-grid">` section. Each project is wrapped in a `<article class="project-card" data-category="...">`:
* `data-category="graphic-design"` for branding, posters, editorial, typography.
* `data-category="video-film"` for short films, cinematography, directing.
* `data-category="branding-motion"` for motion graphics, title sequences, animations.
* Replace the placeholder images with your files from `assets/images/`.

### 5. Changing Colors & Fonts
Open `style.css`. Right at the top, you will find the `:root` variables:
```css
:root {
  --bg-primary: #0d0f12;       /* Background color */
  --bg-surface: #161820;       /* Card & section background */
  --accent: #f59e0b;           /* Accent color (amber gold) */
  --text-main: #f3f4f6;        /* Primary text */
  --text-muted: #9ba1b0;       /* Secondary text */
}
```
You can change any color code here and the entire website will update automatically!

---

## 🌐 Free Hosting & Deployment

When you are ready to publish:
* **GitHub Pages (Recommended):** Push this folder to a GitHub repository, go to **Settings > Pages**, select `main` branch and `/root`, and click Save. Your site will be live on `username.github.io/portfolio`!
* **Netlify / Vercel:** Simply drag and drop the `neha-portfolio` folder onto [Netlify Drop](https://app.netlify.com/drop) for instant free hosting with a custom domain option.
