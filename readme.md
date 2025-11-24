Project Documentation: Kingston United Cricket Club (v2.0)
Project Status: Production-Ready / Live Architecture Type: Client-Side "Headless-Lite" (Static Site + JSON Data Layer) Design System: "Kinetic Precision" (Tier-1 Sports Identity)

1. Executive Summary
The KUCC website was refactored from a legacy static site into a modern, component-driven architecture. The goal was to elevate the club's digital presence to match international sports standards (ICC, Premier League) while maintaining low technical debt.

The new architecture decouples Data (navigation, global settings, sponsors) from Presentation (HTML/CSS), using a lightweight vanilla JavaScript engine to inject content. This ensures global consistency without the need for a heavy backend or complex build pipeline (React/Angular).

2. Technical Architecture
2.1 The "Headless-Lite" Pattern
Instead of hardcoding the Header, Footer, and Navigation into every HTML file (which causes maintenance errors), the site uses a Single Source of Truth pattern.

Data Layer (data.json): Contains global configuration, navigation links, hero content, sponsor data, and footer links.

Logic Layer (main.js): Fetches the JSON on load, parses it, and dynamically injects the Header, Mobile Drawer, and Footer into the DOM of every page.

Presentation Layer (Skeleton HTML): HTML files contain only unique <main> content. The header/footer tags are empty shells waiting for injection.

2.2 Tech Stack
Core: Semantic HTML5, CSS3 (Modern Features), Vanilla ES6 JavaScript.

Styling Engine: CSS Layers (@layer), CSS Custom Properties (Tokens), Fluid Typography (clamp()), Container Queries logic, and CSS Grid/Flexbox.

External Dependencies:

Swiper.js: For the touch-responsive Gear carousel.

Google Fonts: Inter & Poppins.

Phosphor/SVG Icons: Inline SVG for maximum performance.

Hosting: Static Hosting (GitHub Pages / Netlify). No server-side processing required.

3. Design System & UX
3.1 Visual Philosophy: "Kinetic Precision"
The design mimics high-end sports applications using:

Glassmorphism 2.0: High-contrast frosted glass effects for cards (backdrop-filter: blur(10px)).

Bento Grids: Content organized into modular, responsive grid blocks.

Mesh Gradients: Dynamic backgrounds using radial gradients to create depth.

3.2 Design Tokens (Brand Identity)
Colors are strictly defined in styles.css using CSS Variables:

Navy (Primary): var(--kucc-navy) (Pantone 296C)

Royal Blue (Secondary): var(--kucc-royal) (Pantone 7686C)

Gold (Accent): var(--kucc-gold) (Pantone 7560C)

Typography: Headings (Poppins), Body (Inter). Fonts use fluid scaling, meaning they mathematically resize based on viewport width, not fixed breakpoints.

4. File Structure & Manifest
Plaintext

/root
├── index.html            # Dashboard Home (Hero + Live News + Sponsors)
├── about.html            # Club History & Leadership Bento Grid
├── contact.html          # Contact Form (Glass Card) + Info Sidebar
├── gear.html             # Pro-Shop Product Showcase (Swiper.js)
├── join.html             # Membership App + Perks Grid
├── sponsors.html         # Partner Ecosystem (Card Layout)
├── thank-you.html        # Success Page (General)
├── thank-you-contact.html# Success Page (Contact specific)
├── data.json             # GLOBAL DATA: Nav, Footer, Home Hero, Sponsors
├── main.js               # THE ENGINE: DOM Injection, Routing, Mobile Menu
├── styles.css            # MASTER STYLES: 100% of site styling
└── assets/               # logo.png, business cards, etc.
5. Maintenance Guide for Developers
5.1 How to Update Global Content
To change the Navigation Menu, Footer Links, or Home Page Hero Text:

Open data.json.

Edit the values.

Save.

Result: The change instantly reflects on ALL 8 pages.

5.2 How to Update Sponsors
To add or remove a sponsor:

Open data.json.

Locate the "sponsors" array.

Add a new object { "name": "...", "image": "...", "link": "..." }.

Result: The Home page ticker and the Sponsors page grid update automatically.

5.3 How to Update Gear/Products
Note: Gear is managed in HTML, not JSON, to allow for complex Swiper.js layout control.

Open gear.html.

Locate the .swiper-slide blocks.

Edit the Image src, Title <h3>, or Button Link <a href="...">.

5.4 How to Update CSS
All styles are in styles.css.

Do not use hardcoded pixels. Use the defined variables (var(--space-unit)).

Mobile Overrides: Located at the bottom of the file under @media (max-width: 768px).

6. Security & Performance Analysis
6.1 Security Posture
Attack Surface: Negligible. Since there is no database and no server-side code (PHP/Node), SQL Injection and Server-Side Request Forgery (SSRF) are impossible.

Form Handling: Forms use Netlify/Static attributes (data-netlify="true"). No SMTP credentials are exposed in the client code.

CORS (Cross-Origin Resource Sharing): The main.js uses fetch(). On local file systems (file://), this is blocked by browsers. Development must occur on a local server (localhost) or a live environment (HTTPS).

6.2 Performance
LCP (Largest Contentful Paint): Optimized by using minimal, inline SVG icons and no heavy framework bundles.

CLS (Cumulative Layout Shift): Minimized by defining aspect ratios on images (e.g., the Sponsor card fix aspect-ratio: 16/9).

Caching: The browser caches data.json and styles.css after the first page load, making navigation between pages near-instant.

7. Known Customizations
Mobile Brand Name: A custom override was applied in styles.css to ensure "Kingston United" remains visible on mobile devices next to the hamburger menu (.hidden-mobile set to inline-block on small screens).

Sponsor Card Aspect Ratio: The CSS for .partner-logo-wrapper was modified to aspect-ratio: 16/9 with padding: 0 to accommodate wide business cards without cropping or shrinking.

Gear Buttons: The "View Details" buttons were updated to "Buy Now" with target="_blank" to facilitate direct affiliate/purchase links.

Prepared for: Kingston United Cricket Club Date: October 2023 Version: 2.0 (Stable)