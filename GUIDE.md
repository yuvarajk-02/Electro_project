# AJM Electrical & Plumbing Website: Step-by-Step Guide

This guide explains the whole website in simple steps. You do not need to know coding to follow it.

---

## 0. What is in this folder

```
ajm-website/
├── index.html        ← the page content (text, sections, buttons)
├── css/style.css     ← the looks (colours, sizes, animation)
├── js/script.js      ← the behaviour (menu, slider, WhatsApp form)
├── images/logo.jpg   ← your logo picture
└── GUIDE.md          ← this file
```

**To open the site:** double-click `index.html`. It opens in your browser.
**Important:** keep the folders together. If you move only `index.html`, the colours and logo will disappear.

**To edit:** open the folder in VS Code (or Notepad), change text, save, then press refresh in the browser.

---

## 1. The big idea: 3 languages, 1 house

| Language | Job | Like a house | File |
|---|---|---|---|
| **HTML** | What is on the page | Walls and rooms | `index.html` |
| **CSS** | How it looks | Paint and furniture | `css/style.css` |
| **JavaScript** | What it does when you tap | Electricity and plumbing | `js/script.js` |

The page needs all three. HTML says "here is a button", CSS makes it yellow and round, JavaScript opens WhatsApp when pressed.

---

## 2. Reading HTML in 2 minutes

HTML is made of **tags** that wrap content:

```html
<h2>Our recent work</h2>          ← a heading
<p>Some text</p>                  ← a paragraph
<a href="tel:+918124052584">Call</a>   ← a link (here: a phone call)
<div class="card">...</div>       ← a box that holds other things
```

- `class="card"` is a **name tag**. CSS uses it to style the box.
- `id="form"` is a **unique name**. JavaScript uses it to find the element.
- `<!-- text -->` is a **comment**. The browser ignores it. Comments in this project mark each step.

---

## 3. Step-by-step: how the page is built (top to bottom)

### Step 1: The head (top of `index.html`)
Holds information the visitor doesn't see on the page:
- `<title>` is the text on the browser tab and in Google results.
- `<meta name="description">` is the short text Google may show under the title.
- `<meta name="viewport">` makes the page fit phone screens.
- The Google Fonts link loads the two fonts (Bricolage Grotesque for headings, DM Sans for text).
- `<link rel="stylesheet" href="css/style.css">` connects the CSS file.

### Step 2: Header and menu
```html
<header> logo + <nav> links </nav> + burger button </header>
```
- On a **laptop (wider than 1024px)** the links sit in a row.
- On a **tablet or phone** CSS hides the links and shows the three-line **burger button**. JavaScript opens the list when you tap it.
- The header uses `position: sticky`, so it stays at the top while you scroll.

### Step 3: Hero (the first blue area)
Two columns: headline, text and two buttons on the left; logo picture on the right.
- **Background animation:** `<div class="hbg">` has a moving glow, a sliding grid and 12 floating icons (bolt, drop, bulb, wrench, plug, pipe). It is pure CSS, with no video or image.
- On phones the two columns stay side by side (text left, logo right).

### Step 4: Services
Three cards: Electrical, Plumbing and Construction. Each card has a title, a list and a button.
The button's `data-pick="s1"` tells JavaScript which type to tick in the form when pressed.

### Step 5: Recent work slider
The HTML only has empty boxes (`id="filters"`, `id="gal"`). **JavaScript fills them** from a list called `WORK`. This is why you add photos by editing the list (see section 7).

### Step 6: Quote form → WhatsApp
Visitor chooses the type (Electrical, Plumbing, Construction, Emergency), types name, area and problem. A green preview bubble shows the message. Pressing the button opens WhatsApp with the message ready to send. **There is no server or database. WhatsApp handles the message.**

### Step 7: Contact
A yellow visiting card built with HTML and CSS, and two buttons (Call and WhatsApp).

### Step 8: Reviews
Three sample reviews. **Replace them with real ones** before going live.

### Step 9: FAQ
Uses `<details><summary>Question</summary><p>Answer</p></details>`. The browser opens and closes it by itself, so no JavaScript is needed.

### Step 10: Footer
One block: business name, call and WhatsApp links, copyright. On a laptop it is laid out in a row; on a phone it is stacked and centred.

### Step 11: Round WhatsApp button
The green circle at the bottom-right. It is a normal link:
```
https://wa.me/916380467953?text=Hello...
```
`wa.me/` + country code + number opens WhatsApp. `?text=` is the message that is pre-typed.

---

## 4. CSS in simple words (`css/style.css`)

Every rule has this shape:
```css
.btn-call { background: var(--volt); color: #0e2233; }
 ↑ who         ↑ what to change
```

| Idea | What it means | Where you see it |
|---|---|---|
| **Variables** `--volt`, `--navy` | Colours stored once at the top (`:root`) | Change `--volt` and every yellow changes |
| **Dark mode** | `@media (prefers-color-scheme: dark)` switches colours if the phone is in dark mode | Top of the file |
| **Flexbox** `display:flex` | Puts items in a row | Header, buttons |
| **Grid** `display:grid` | Puts items in columns | Hero, service cards, footer |
| **Media query** `@media(max-width:600px)` | Rules that apply only on small screens | Responsive layout |
| **Animation** `@keyframes` | Movement over time | Hero glow, floating icons, WhatsApp pulse |
| `position: fixed` | Stays on screen while scrolling | WhatsApp round button |

**Screen sizes used:** 1024px (menu becomes burger), 900px and 820px (columns stack), 600px and 560px (phone tweaks), 480px (small phones).

---

## 5. JavaScript in simple words (`js/script.js`)

The file has 6 parts, numbered in the comments.

1. **Mobile menu:** pressing the burger adds the word `open` to the menu. CSS shows the menu when it has `open`. Pressing a link, `Esc`, or enlarging the window closes it.
2. **Settings:** `WA_NUMBER` is your WhatsApp number. The form uses it.
3. **`WORK` list:** the data for the gallery pictures.
4. **`drawGal()`:** loops through `WORK`, creates one tile per item, and filters by All / Electrical / Plumbing / Construction. Clicking a picture opens it large.
5. **Slider:** arrow buttons scroll the row; it also moves by itself every 4 seconds and pauses when you touch it.
6. **WhatsApp form:** `build()` joins the answers into one text. On submit, it checks that "problem" and "area" are filled, then opens
   `https://wa.me/<number>?text=<message>`. `encodeURIComponent` turns spaces and symbols into a safe web address form.

---

## 6. How the form message is made (example)

Visitor picks **Plumbing**, types name "Ravi", area "Anna Street", problem "Tap leaking". The message becomes:

```
Hello AJM Electrical & Plumbing, I need help with: Plumbing work.
Problem: Tap leaking
Location: Anna Street
Name: Ravi
Please share a quote and arrival time.
```

---

## 7. How to change things (cheat sheet)

| I want to... | Do this |
|---|---|
| **Change the phone number** | In `index.html` search `8124052584` (3 places: `tel:` links) and the visible text `81240 52584` (4 places). Search and replace all. |
| **Change the WhatsApp number** | Search `916380467953` in `index.html` (3 places) **and** in `js/script.js` (`WA_NUMBER`). Format: country code + number, no spaces or `+`. |
| **Change the business name** | Search `AJM Electrical` in `index.html` and `js/script.js`. |
| **Change colours** | `css/style.css`, top, the `:root{ --volt:#ffc21a; --navy:#0c3a94; ... }` block. |
| **Change hero headline** | `index.html`, the `<h1>` inside `<section class="hero">`. |
| **Replace the logo** | Save a new picture as `images/logo.jpg` (same name). |
| **Add a real work photo** | Copy the photo into `images/` (e.g. `work1.jpg`), then in `js/script.js` add a line to `WORK`: `{c:"Electrical",t:"MCB board upgrade",src:"images/work1.jpg"},` (`c` must be Electrical, Plumbing or Construction). |
| **Add a service line** | In `index.html`, inside a service card, add `<li>New service</li>`. |
| **Edit a review** | `index.html`, section `id="reviews"`. |
| **Add an FAQ** | Copy one `<details>...</details>` block in section `id="faq"`. |
| **Slower / faster hero animation** | `css/style.css`: `.mesh` uses `16s`; icons use `--d` (seconds) in each icon's `style=`. |
| **Remove the floating WhatsApp button** | Delete the `<a class="wafab" ...>...</a>` block at the bottom of `index.html`. |

**Safe editing tip:** make a copy of the folder before big changes.

---

## 8. Put the website online (simple options)

1. **Netlify Drop (easiest):** go to app.netlify.com/drop and drag the whole `ajm-website` folder. You get a live link in seconds.
2. **GitHub Pages (free):** upload the folder to a GitHub repository, then turn on Pages in the settings.
3. **Any web hosting:** upload all files and folders into the `public_html` folder, keeping the structure.

Then: buy a domain (for example `yourname.in`), connect it, and add your business to **Google Business Profile** so people can find you on Maps.

---

## 9. Practice exercises

1. Change the hero headline and refresh the browser.
2. Change `--volt` to another colour and see all yellow buttons change.
3. Add a fifth FAQ question.
4. Add your first real work photo to the slider.
5. Change the WhatsApp message wording in the `build()` function and test the form.

---

## 10. Words you will meet

- **Responsive:** the page adjusts to phone, tablet and laptop.
- **Breakpoint:** the screen width where the layout changes.
- **Element:** one piece of HTML such as a button or a heading.
- **Class / id:** names used to connect HTML to CSS and JavaScript.
- **Event:** something the visitor does (click, type, scroll). JavaScript listens for events.
- **Data URI:** a picture written as text inside the code. The gallery placeholders use these.
