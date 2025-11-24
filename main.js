document.addEventListener("DOMContentLoaded", () => {
    // 1. Fetch Configuration
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            initApp(data);
        })
        .catch(error => console.error('Error loading config:', error));
});

function initApp(data) {
    renderNavigation(data.navigation);
    renderMobileMenu(data.navigation); // NEW: Builds the mobile drawer
    renderFooter(data.footer);
    
    // Only run these if we are on the Home Page
    if (document.querySelector('.hero-section')) {
        renderHero(data.hero);
        renderSponsors(data.sponsors);
    }
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
        
        a.href = item.url;
        a.textContent = item.label;
        
        if (item.type === 'cta') {
            a.className = 'btn-cta';
            a.target = "_blank";
        } else {
            a.className = 'nav-link';
            // Active State Logic
            if (item.url === currentPath) {
                a.classList.add('active');
            }
        }
        
        li.appendChild(a);
        desktopList.appendChild(li);
    });
}

// --- 2. MOBILE MENU LOGIC (The Drawer) ---
function renderMobileMenu(navItems) {
    const toggleBtn = document.querySelector('.mobile-toggle');
    if(!toggleBtn) return;

    // Create the Mobile Panel HTML
    const mobilePanel = document.createElement('div');
    mobilePanel.className = 'mobile-nav-panel';
    mobilePanel.innerHTML = `<ul class="mobile-drawer-list"></ul>`;
    document.body.appendChild(mobilePanel);

    const list = mobilePanel.querySelector('ul');

    // Populate Links
    navItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.url;
        a.textContent = item.label;
        if(item.type === 'cta') a.style.color = 'var(--kucc-gold)';
        
        // Close menu on click
        a.addEventListener('click', () => {
            mobilePanel.classList.remove('active');
            document.body.style.overflow = '';
        });

        li.appendChild(a);
        list.appendChild(li);
    });

    // Toggle Logic
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = mobilePanel.classList.contains('active');
        
        if (isActive) {
            mobilePanel.classList.remove('active');
            document.body.style.overflow = ''; // Enable scroll
        } else {
            mobilePanel.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock scroll
        }
    });

    // Close on click outside
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

    if(h1) h1.innerHTML = heroData.headline; 
    if(p) p.innerHTML = heroData.subheadline;
    if(cta) {
        cta.textContent = heroData.ctaText;
        cta.href = heroData.ctaLink;
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
        img.src = sponsor.image;
        img.alt = sponsor.name;
        img.style.marginBottom = '1rem';
        
        const link = document.createElement('a');
        link.href = sponsor.link;
        link.className = 'btn-text';
        link.textContent = 'Visit Partner \u2192'; // Arrow symbol
        link.target = "_blank";
        
        card.appendChild(img);
        card.appendChild(link);
        grid.appendChild(card);
    });
}

// --- 5. GLOBAL FOOTER ---
function renderFooter(footerData) {
    const footer = document.querySelector('.site-footer');
    if(!footer) return;

    footer.innerHTML = `
        <div class="container" style="text-align: center; padding: 2rem 0; color: rgba(255,255,255,0.5); font-size: 0.9rem;">
            <div style="margin-bottom: 1rem;">
                <a href="${footerData.socials[0].url}" target="_blank" style="color: white; font-weight: 600;">Instagram</a>
            </div>
            <p>&copy; ${footerData.copyright}</p>
        </div>
    `;
}