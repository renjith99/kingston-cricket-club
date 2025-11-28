document.addEventListener("DOMContentLoaded", () => {
    // SECURITY UPGRADE 1: Cache Busting
    fetch(`data.json?v=${Date.now()}`) 
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            // SECURITY UPGRADE 2: Data Integrity Check
            if (!data.navigation || !data.hero) throw new Error("Invalid JSON structure");
            initApp(data);
        })
        .catch(error => {
            console.error('Error loading config:', error);
        });

    // SECURITY UPGRADE 3: Initialize Third-Party Scripts internally
    initGearSlider();

    // SECURITY UPGRADE 4: Initialize RSS Feed internally
    initRSSFeed();
});

function initApp(data) {
    renderNavigation(data.navigation);
    renderMobileMenu(data.navigation);
    renderFooter(data.footer);
    
    if (document.querySelector('.hero-section')) {
        renderHero(data.hero);
        renderSponsors(data.sponsors);
    }
}

// --- HELPER: SAFE URL SANITIZER (Permissive Mode) ---
function sanitizeUrl(url) {
    const stringUrl = String(url).trim();
    
    // 1. Block dangerous protocols explicitly
    if (/^\s*(javascript|data|vbscript):/i.test(stringUrl)) {
        console.warn(`Blocked unsafe URL: ${stringUrl}`);
        return '#';
    }

    // 2. Allow http, https, mailto, tel, absolute paths (/), anchors (#), and relative paths
    return stringUrl;
}

// --- 1. DESKTOP NAVIGATION ---
function renderNavigation(navItems) {
    const desktopList = document.querySelector('.nav-links');
    if(!desktopList) return;
    
    desktopList.innerHTML = '';
    const currentPath = window.location.pathname.split("/").pop() || "index.html";

    navItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        
        a.href = sanitizeUrl(item.url);
        a.textContent = item.label;
        
        if (item.type === 'cta') {
            a.className = 'btn-cta';
            a.target = "_blank";
            a.rel = "noopener noreferrer"; // Anti-Tabnabbing
        } else {
            a.className = 'nav-link';
            if (item.url === currentPath) {
                a.classList.add('active');
            }
        }
        
        li.appendChild(a);
        desktopList.appendChild(li);
    });
}

// --- 2. MOBILE MENU LOGIC ---
function renderMobileMenu(navItems) {
    const toggleBtn = document.querySelector('.mobile-toggle');
    if(!toggleBtn) return;

    const mobilePanel = document.createElement('div');
    mobilePanel.className = 'mobile-nav-panel';
    
    const ul = document.createElement('ul');
    ul.className = 'mobile-drawer-list';
    
    navItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        
        a.href = sanitizeUrl(item.url);
        a.textContent = item.label;
        
        if(item.type === 'cta') a.style.color = 'var(--kucc-gold)';
        
        a.addEventListener('click', () => {
            mobilePanel.classList.remove('active');
            document.body.style.overflow = '';
        });

        li.appendChild(a);
        ul.appendChild(li);
    });

    mobilePanel.appendChild(ul);
    document.body.appendChild(mobilePanel);

    // Toggle Logic
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = mobilePanel.classList.contains('active');
        if (isActive) {
            mobilePanel.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            mobilePanel.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });

    document.addEventListener('click', (e) => {
        if (mobilePanel.classList.contains('active') && !mobilePanel.contains(e.target) && !toggleBtn.contains(e.target)) {
            mobilePanel.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// --- 3. HOME PAGE: HERO INJECTION ---
function renderHero(heroData) {
    const h1 = document.querySelector('.hero-h1');
    const p = document.querySelector('.hero-sub');
    const cta = document.querySelector('.hero-cta');

    // SECURITY UPGRADE: textContent ONLY
    // Uses CSS (white-space: pre-line) to handle line breaks from JSON
    if(h1) h1.textContent = heroData.headline; 
    
    if(p) p.textContent = heroData.subheadline;
    
    if(cta) {
        cta.textContent = heroData.ctaText;
        cta.href = sanitizeUrl(heroData.ctaLink);
    }
}

// --- 4. HOME PAGE: SPONSOR GRID ---
function renderSponsors(sponsors) {
    const grid = document.querySelector('.sponsor-grid');
    if(!grid) return;

    grid.innerHTML = '';
    
    sponsors.forEach(sponsor => {
        const card = document.createElement('div');
        card.className = 'sponsor-card';
        
        const img = document.createElement('img');
        img.src = sanitizeUrl(sponsor.image);
        img.alt = sponsor.name;
        img.style.marginBottom = '1rem';
        
        const link = document.createElement('a');
        link.href = sanitizeUrl(sponsor.link);
        link.className = 'btn-text';
        link.textContent = 'Visit Partner \u2192'; 
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        
        card.appendChild(img);
        card.appendChild(link);
        grid.appendChild(card);
    });
}

// --- 5. GLOBAL FOOTER ---
function renderFooter(footerData) {
    const footer = document.querySelector('.site-footer');
    if(!footer) return;

    // Building DOM elements safely (No innerHTML)
    footer.innerHTML = ''; 
    
    const container = document.createElement('div');
    container.className = 'container';
    container.style.textAlign = 'center';
    container.style.padding = '2rem 0';
    container.style.color = 'rgba(255,255,255,0.5)';
    container.style.fontSize = '0.9rem';

    // Social Link
    const socialDiv = document.createElement('div');
    socialDiv.style.marginBottom = '1rem';
    
    const socialLink = document.createElement('a');
    socialLink.href = sanitizeUrl(footerData.socials[0].url);
    socialLink.target = "_blank";
    socialLink.rel = "noopener noreferrer";
    socialLink.style.color = 'white';
    socialLink.style.fontWeight = '600';
    socialLink.textContent = 'Instagram';
    
    socialDiv.appendChild(socialLink);
    
    const copyP = document.createElement('p');
    copyP.textContent = `© ${footerData.copyright}`;

    container.appendChild(socialDiv);
    container.appendChild(copyP);
    footer.appendChild(container);
}

// --- 6. SWIPER INITIALIZATION (Secure Logic) ---
function initGearSlider() {
    const sliderElement = document.querySelector('.gear-slider');
    
    if (sliderElement && typeof Swiper !== 'undefined') {
        new Swiper('.gear-slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            grabCursor: true,
            pagination: { el: '.swiper-pagination', clickable: true },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
            breakpoints: {
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
            }
        });
        console.log("Swiper initialized via Main Engine.");
    } else if (sliderElement && typeof Swiper === 'undefined') {
        console.error("Swiper JS failed to load via CDN. Check SRI Hash.");
    }
}

// --- 7. RSS FEED LOGIC (Secure Logic - No innerHTML) ---
function initRSSFeed() {
    const container = document.getElementById("rss-feed-container");
    if (!container) return;

    fetch("https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent("https://www.espncricinfo.com/rss/content/story/feeds/0.xml"))
        .then(r => r.json())
        .then(data => {
            if (!data.items) {
                container.innerHTML = "<p class='text-muted'>News currently unavailable.</p>";
                return;
            }

            const list = document.createElement("ul");
            list.className = "news-list";

            data.items.slice(0, 4).forEach(item => {
                const li = document.createElement("li");
                li.className = "news-item";
                
                // Securely build the link element
                const a = document.createElement('a');
                a.href = sanitizeUrl(item.link);
                a.target = "_blank";
                a.rel = "noopener noreferrer";
                
                // Title Span
                const spanTitle = document.createElement('span');
                spanTitle.className = "news-title";
                spanTitle.textContent = item.title;
                
                // Arrow Span
                const spanArrow = document.createElement('span');
                spanArrow.className = "news-arrow";
                spanArrow.textContent = " \u2192"; // Arrow symbol
                
                a.appendChild(spanTitle);
                a.appendChild(spanArrow);
                li.appendChild(a);
                list.appendChild(li);
            });

            container.innerHTML = "";
            container.appendChild(list);
        })
        .catch(() => {
            container.innerHTML = "<p class='text-muted'>Could not load news feed.</p>";
        });
}