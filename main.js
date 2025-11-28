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

// --- HELPER: SAFE URL SANITIZER ---
function sanitizeUrl(url) {
    const stringUrl = String(url);
    if (/^(http|https|mailto|\/|#)/i.test(stringUrl)) {
        return stringUrl;
    }
    console.warn(`Blocked unsafe URL: ${stringUrl}`);
    return '#';
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
            a.rel = "noopener noreferrer"; // SECURITY UPGRADE 3: Anti-Tabnabbing
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

    // SECURITY UPGRADE 4: textContent ONLY (FINAL FIX)
    // We now use CSS (white-space: pre-line) to handle the line breaks
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