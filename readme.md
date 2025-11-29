Project Documentation: Kingston United Cricket Club (v2.2)
Project Status: Production / Tier-1 Security Hardened Architecture Type: Client-Side "Headless-Lite" (Static Site + JSON Data Layer) Security Grade: A+ (SecurityHeaders.com) Design System: "Kinetic Precision" (Tier-1 Sports Identity)
1. Executive Summary
The KUCC website is a modern, component-driven static site designed to match international sports standards. Version 2.2 represents the completion of a comprehensive Enterprise Security Audit, transforming the site from a standard static page into a hardened fortress.
The architecture decouples Data from Presentation using a lightweight vanilla JavaScript engine. The site now features bank-grade security protections (CSP, HSTS, SRI) while maintaining zero server-side maintenance costs.
2. Technical Architecture
2.1 The "Headless-Lite" Pattern (Secure Edition)
The site uses a Single Source of Truth pattern, now enhanced with rigorous input sanitization.
Data Layer (data.json): Contains global configuration, navigation, and content. Note: HTML tags (like <br>) are no longer supported here for security reasons.
Logic Layer (main.js): The secure engine. It fetches JSON, verifies integrity, sanitizes all URLs, and injects content using textContent (preventing XSS). It also handles the initialization of third-party libraries (Swiper.js) and RSS feeds to satisfy strict CSP rules.
Infrastructure Layer (netlify.toml): Controls server headers, caching policies, and the Content Security Policy firewall.
Presentation Layer (Skeleton HTML): HTML files contain only unique <main> content. No inline JavaScript is permitted.
2.2 Tech Stack
Core: Semantic HTML5, CSS3, Vanilla ES6 JavaScript (Strict Mode).
Styling: CSS Custom Properties (Tokens), Fluid Typography (clamp()), Grid/Flexbox.
External Dependencies (SRI Locked):
Swiper.js (v11.1.14): Pinned version with Subresource Integrity (SRI) hashing.
Hosting: Netlify (Production) with enforced HTTPS and Asset Optimization.
3. Design System & UX
3.1 Visual Philosophy: "Kinetic Precision"
Glassmorphism 2.0: High-contrast frosted glass effects (backdrop-filter).
Safe Typography: Headings now use white-space: pre-line to support line breaks securely without innerHTML.
Native Iconography: Swiper navigation arrows were converted from font-based icons to Hardcoded SVG Data URIs in CSS to prevent network blocking and improve loading speed.
3.2 Design Tokens
Colors remain strictly defined in styles.css:
Navy: var(--kucc-navy)
Gold: var(--kucc-gold)
Royal: var(--kucc-royal)
4. File Structure & Manifest
Plaintext
/root
├── netlify.toml          # SECURITY SHIELD: CSP, HSTS, Headers config
├── site.webmanifest      # PWA/Android Install Config
├── index.html            # Dashboard Home
├── about.html            # Club History
├── contact.html          # Contact Form (w/ Honeypot)
├── gear.html             # Pro-Shop (Swiper.js Logic via main.js)
├── join.html             # Membership App
├── fixtures.html         # Season Schedule
├── sponsors.html         # Partner Ecosystem
├── thank-you.html        # Success Page
├── data.json             # GLOBAL DATA (Strict JSON format)
├── main.js               # SECURE ENGINE: Injection, Sanitization, Routing
├── styles.css            # MASTER STYLES: 100% of site styling
├── favicon.ico           # Legacy Browser Icon
├── favicon.svg           # Modern SVG Icon
├── og-share-image.jpg    # Social Media Preview (1200x630)
└── assets/               # Local optimized images

5. Maintenance Guide for Developers
5.1 How to Update Global Content
Text: Open data.json. Update values.
Line Breaks: Do not use <br>. Use \n (newline character). The CSS white-space: pre-line handles the rendering.
Security: Ensure no HTML tags are put into JSON fields. They will render as plain text (e.g., <b> will show as the text "<b>", not bold).
5.2 How to Update Gear/Products
Gear is managed in gear.html.
Images/Links: Ensure all URLs are HTTPS.
Scripts: Do not add <script> tags for sliders in gear.html. Swiper initialization is now centralized in main.js (initGearSlider function).
5.3 Security Maintenance (Crucial)
If updating Swiper.js or any external library:
Generate Hash: Go to srihash.org.
Update HTML: Update the integrity="sha384-..." attribute in gear.html and main.js tags.
Update CSP: If the domain changes, update netlify.toml script-src and style-src.
6. Security Analysis (Tier-1 Hardened)
6.1 Defense Mechanisms
This site achieves an A+ Rating by implementing the following layers:
Strict Content Security Policy (CSP): Blocks all unauthorized scripts, inline execution (unsafe-inline), and data injection. Defined in netlify.toml.
XSS Immunity: main.js uses textContent exclusively for data injection. innerHTML is banned for user/JSON content.
Input Sanitization: A custom sanitizeUrl() function intercepts all href and src attributes, blocking javascript: and data: vectors.
Subresource Integrity (SRI): All CDN links (Swiper) are pinned to specific versions and cryptographically signed. If the CDN is hacked, the browser blocks the script.
Tabnabbing Protection: All target="_blank" links automatically have rel="noopener noreferrer".
Transport Security: HSTS (HTTP Strict Transport Security) is enforced for 1 year, forcing secure connections.
Feature Policy: Camera, Microphone, and Geolocation APIs are explicitly disabled via headers.
6.2 Form Security
Honeypot: Netlify Forms include a hidden bot-field. Automated spam bots are silently rejected.
No Backend: No SMTP credentials or server-side logic exposed to the client.
6.3 Performance
Cache Busting: main.js requests data.json?v=timestamp to prevent stale content delivery.
Asset Caching: Immutable assets (images/fonts) are cached for 1 year via netlify.toml headers.
7. Known Customizations
SVG Swiper Arrows: Located in styles.css. Overrides default Swiper font icons with background-image: url('data:image/svg...') for offline reliability and security.
Mobile Brand Override: Custom CSS ensures "Kingston United" text remains visible on small screens alongside the hamburger menu.
Sponsor Aspect Ratio: Forced 16/9 aspect ratio on sponsor cards to maintain grid uniformity.

Prepared for: Kingston United Cricket Club Date: November 2025 Version: 2.2 (Security Hardened & SEO Optimized) Audit Status: PASSED (A+)

