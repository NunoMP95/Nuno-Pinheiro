# Nuno Pinheiro – Portfolio

My UX portfolio, built with [Eleventy](https://www.11ty.dev/) (a static site generator). It has a light and a dark theme, and the output is plain HTML, CSS and JavaScript.

- **You edit:** `src/`, which holds Markdown, data (JSON) and templates.
- **Eleventy builds:** `_site/`, which is what gets published. Never edit it by hand.

---

## 1. First-time setup (once per computer)

1. Install **Node.js LTS** from [nodejs.org](https://nodejs.org/) (version 18 or newer).
2. Install **VS Code** from [code.visualstudio.com](https://code.visualstudio.com/), then open this folder in it (File → Open Folder → `repos/nuno-portfolio`).
3. Open the terminal in VS Code (**View → Terminal**) and run:
   ```bash
   npm install
   ```
   This downloads Eleventy into `node_modules/` (ignored by Git).

## 2. Everyday commands

| Command | What it does |
|---|---|
| `npm start` | Builds the site and opens a live preview at **http://localhost:8080**. The page reloads every time you save. Stop it with Ctrl+C. |
| `npm run build` | Builds the site into `_site/` once |
| `npm test` | Runs the automated tests. You should see `# pass 13`, `# fail 0` |

> Opening the HTML files by double-clicking no longer works, because the pages use site-wide links like `/styles.css`. Always preview with `npm start`.

## 3. Where to change things

| I want to… | Edit this |
|---|---|
| Change my email, LinkedIn, CV file or locations | `src/_data/site.json`: changes every page at once |
| Add, edit or reorder project cards | `src/_data/projects.json` |
| Change the key numbers | `src/_data/stats.json` |
| Edit my roles | `src/_data/experience.json` |
| Edit skills or education | `src/_data/skills.json`, `src/_data/education.json` |
| Change the navigation links | `src/_data/navigation.json` |
| Edit the hero text | `src/index.njk` |
| Edit a case study | `src/case-studies/<name>.md` |
| Change colours, fonts, roundness, width or section order | `src/config.js`, or use the design panel (section 6) |
| Change styling | `src/styles.css` |
| Change the header, footer or page `<head>` | `src/_includes/partials/` and `src/_includes/layouts/base.njk` |

**Add your CV:** save it as `src/nuno-pinheiro-cv.pdf`. It's copied to the site automatically.

## 4. Add a new case study

1. Copy `src/case-studies/scheduling-optimisation-engine.md` and rename it, e.g. `ui-kit.md`. The file name becomes the address: `/case-studies/ui-kit/`.
2. Update the **front matter**, the block between the `---` lines at the top: `title`, `heading`, `project`, `label`, `facts`, `contents` and `order`.
3. Write the body in Markdown. Wrap each section like this:
   ```
   {% csSection "research", "03 · Research" %}
   ## Mapping the whole service

   Your paragraphs, **bold**, lists…
   {% endcsSection %}
   ```
   The first value is the section's id, which the contents links at the top point to. The second is the small label above the heading.
4. Link it from the home page by adding `"url": "/case-studies/ui-kit/"` to that project in `src/_data/projects.json`.
5. Check it with `npm start`.

Yellow highlights are placeholders still to write. Search for `todo` to find them all.

## 4b. Add images to a case study

1. Save the image in `src/images/case-studies/<case-study-name>/`, e.g. `src/images/case-studies/scheduling-optimisation-engine/blueprint.png`.
2. In the case study's Markdown file, add:
   ```
   {% figure "/images/case-studies/scheduling-optimisation-engine/blueprint.png", "What the image shows, for screen reader users", "Optional caption shown under the image" %}
   ```
   Put it on its own line, with a blank line above and below.
3. Run `npm start` to check it.

Tips:
- **Alt text is required.** The build stops with an error if it's missing. Describe what someone should understand from the image, not "image of…". Use `""` only for purely decorative images.
- **Size:** export at about 1600px wide, as `.png` for diagrams and UI or `.jpg`/`.webp` for photos. Aim for under 300 KB per image (compress with [Squoosh](https://squoosh.app/)).
- **File names:** lowercase with hyphens, no spaces, e.g. `service-blueprint-overview.png`.
- **NDA:** only use recreated or redacted visuals: simplified diagrams, blurred layouts, generic wireframes. Never real client screens, names or data.

## 5. Light and dark mode

- **First visit:** the site follows the visitor's device setting.
- **Sun/moon button:** switches theme, and the choice is remembered on every page.
- **No saved choice yet:** the site follows device changes live.
- **Forcing one theme:** set `defaultTheme` to `"dark"` or `"light"` in `src/config.js` (default `"system"`).

## 6. Design panel

Run `npm start` and open **http://localhost:8080/?edit**.

1. Change colours (per theme; use the sun/moon button to switch), the first-visit theme, fonts, roundness, width and section order.
2. Click **Download config.js** and replace `src/config.js` to keep your changes.

Keep text contrast at **4.5:1** or more. Check with [WebAIM's contrast checker](https://webaim.org/resources/contrastchecker/).

## 7. Publish on GitHub Pages (automatic)

The file `.github/workflows/deploy.yml` builds, tests and publishes the site every time you push.

1. Create a new **public** repository on GitHub called `YOUR-USERNAME.github.io`. Don't add a README.
2. In this folder's terminal, run:
   ```bash
   git add .
   git commit -m "Portfolio built with Eleventy"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-USERNAME.github.io.git
   git push -u origin main
   ```
3. On GitHub, go to **Settings → Pages**, set **Source** to **GitHub Actions**, and save.
4. Open the **Actions** tab and wait for the green tick, about a minute. The site is live at `https://YOUR-USERNAME.github.io`.
5. From then on: edit → `git add .` → `git commit -m "what changed"` → `git push`.

After your first `npm install`, commit the generated `package-lock.json`. You can then change `npm install` to `npm ci` in the workflow.

## 8. How the project is organised

```
eleventy.config.mjs          Eleventy settings: folders, copied files, shortcodes
package.json                 commands (start, build, test) and Eleventy version
.github/workflows/deploy.yml build + test + publish on every push
src/
  _data/                     content as data (site, projects, stats, experience…)
  _includes/layouts/
    base.njk                 <head>, header, footer: every page uses it
    case-study.njk           case study wrapper: back link, facts, contents
  _includes/partials/        header, footer, project card, stat, icons, blueprint visual
  case-studies/
    case-studies.json        defaults for every case study (layout, address, NDA note)
    *.md                     one Markdown file per case study
  index.njk                  home page (loops over the data)
  styles.css                 all styling, in 15 numbered sections
  config.js                  design settings (colours, fonts, theme, sections)
  js/                        behaviour: theme, menu, motion, sections, design panel
tests/unit.test.js           tests for the logic in src/js
```

**Patterns used**

- **Content and presentation are separate.** Data and Markdown hold the content; layouts and partials hold the markup, written once.
- **Partials are reusable components.** One `project-card.njk` renders every card with the same accessible markup.
- **Behaviour is modular.** Each file in `src/js` does one job, with an observer-based config store and injected browser APIs, so the logic is unit-tested.

## 9. Accessibility built in

- Skip link, landmarks, one `h1` per page, logical headings
- Visible focus on everything you can click; buttons and links at least 44px
- Phone menu with `aria-expanded`; Escape closes it and returns focus
- No endless motion; nothing animates with **Reduce motion** on; everything is visible without JavaScript
- Text contrast passes WCAG AA in both themes

Before publishing, also test with **VoiceOver** (Cmd+F5), with the keyboard only, and with Lighthouse (Chrome → DevTools).
