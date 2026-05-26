/**
 * Daily Pot Shared Core Utilities
 * Contains: Dynamic UI injection (Navbar & Footer), Toast Manager, Spoonacular API Config, and Substitution Engine
 */

export const SPOONACULAR_API_KEY = "3335e03f47e14f6cb9ba95c9d14d0489";

// Ingredient Substitution Tiers
export interface SubstitutionTier {
  tier1: string;
  tier2: string;
}

export const SUBSTITUTIONS: SubstitutionTier[] = [
  { tier1: "butter", tier2: "margarine" },
  { tier1: "milk", tier2: "soy milk" },
  { tier1: "white sugar", tier2: "brown sugar" },
  { tier1: "sour cream", tier2: "Greek yogurt" }
];

// Helper to sanitize ingredient names for robust matching
export function sanitizeIngredientName(name: string): string {
  return name.toLowerCase().trim().replace(/s$/, ""); // very simple plural stripping for edge cases
}

/**
 * Substitution Check Result
 */
export interface SubstitutionResult {
  hasSubstitutions: boolean;
  warnings: string[];
}

/**
 * Check if recipe is missing tier1 ingredients and if tier2 ingredients are present in the pantry.
 * @param recipeIngredients List of ingredient names in the recipe
 * @param pantryItems Current list of pantry ingredient names from localStorage
 */
export function runSubstitutionEngine(recipeIngredients: string[], pantryItems: string[]): SubstitutionResult {
  const pantryLower = pantryItems.map(item => item.toLowerCase().trim());
  const warnings: string[] = [];

  SUBSTITUTIONS.forEach(({ tier1, tier2 }) => {
    // Check if recipe needs tier1
    const recipeNeedsTier1 = recipeIngredients.some(ing => 
      ing.toLowerCase().includes(tier1.toLowerCase())
    );

    // If recipe needs tier1
    if (recipeNeedsTier1) {
      // Check if user has tier 1 in pantry
      const userHasTier1 = pantryLower.some(p => p === tier1.toLowerCase() || p.includes(tier1.toLowerCase()));
      
      if (!userHasTier1) {
        // Since user doesn't have tier 1, check if they have Tier 2
        const userHasTier2 = pantryLower.some(p => p === tier2.toLowerCase() || p.includes(tier2.toLowerCase()));
        if (userHasTier2) {
          warnings.push(`Recipe requires "${tier1}". Substituting with Quality-Reducing alternative "${tier2}" from your pantry.`);
        }
      }
    }
  });

  return {
    hasSubstitutions: warnings.length > 0,
    warnings
  };
}

/**
 * Toast Notification Engine
 */
export function showToast(message: string, type: 'success' | 'warning' | 'error' = 'success', duration = 5000): void {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full px-4 sm:px-0 pointer-events-none';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-slide-in pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg bg-white ${
    type === 'success' ? 'border-slate-350 text-slate-900 shadow-sm' :
    type === 'warning' ? 'border-amber-350 text-amber-950 shadow-xs' :
    'border-red-300 text-red-900 shadow-xs'
  }`;

  let icon = '';
  if (type === 'success') {
    icon = `<svg class="w-5 h-5 text-slate-800 dark:text-amber-250 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
  } else if (type === 'warning') {
    icon = `<svg class="w-5 h-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`;
  } else {
    icon = `<svg class="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`;
  }

  // Use a temporary host to parse button triggers
  toast.innerHTML = `
    ${icon}
    <div class="flex-1 text-sm font-medium pr-1 whitespace-pre-line">${message}</div>
    <button class="text-gray-400 hover:text-gray-600 transition cursor-pointer" aria-label="Dismiss toast">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
    </button>
  `;

  // Dismiss button action
  const closeBtn = toast.querySelector('button');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.2s ease';
      setTimeout(() => toast.remove(), 200);
    });
  }

  container.appendChild(toast);

  // Auto-dismiss
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }
  }, duration);
}

/**
 * Handle API Error status codes gracefully and display full details
 */
export async function handleApiError(response: Response, defaultMsg: string): Promise<never> {
  let message = defaultMsg;
  if (response.status === 402) {
    message = "🔑 Quota exceeded, using local database";
  } else if (!response.ok) {
    try {
      const errBody = await response.json();
      message = errBody.message || `API Error: ${response.status} ${response.statusText}`;
    } catch {
      message = `HTTP Connection Issue [${response.status}]: Could not communicate with ingredients database.`;
    }
  }
  showToast(message, "error", 8000);
  throw new Error(message);
}

/**
 * Custom template for injecting standard layout (Navbar, Mobile menu, Footer)
 */
export function setupLayout(activePage: 'pantry' | 'ingredients' | 'search' | 'calendar' | 'favorites' | 'contact' | 'publish'): void {
  const isSelected = (pageName: string) => activePage === pageName 
    ? "text-slate-900 dark:text-amber-100 border-b-2 border-slate-900 dark:border-amber-350 pb-1 font-extrabold font-sans" 
    : "text-slate-500 hover:text-slate-900 transition font-medium cursor-pointer pb-1 font-sans";

  const navbarHtml = `
  <nav class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
      <div class="flex justify-between items-center h-20">
        <!-- Logo and Brand Column with fixed min-width to balance the layout -->
        <div class="flex items-center min-w-[150px] md:min-w-[220px]">
          <a href="index.html" class="flex items-center gap-3 group">
            <div class="w-11 h-11 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
              <svg class="w-11 h-11" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Fire / Flames -->
                <g id="fire">
                  <!-- Back Fire -->
                  <path d="M70 170C70 170 80 145 92 140C97 148 100 156 100 165C108 145 125 130 135 145C138 138 144 146 142 152C148 145 156 155 152 165" stroke="#F97316" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                  <!-- Outer main flame -->
                  <path d="M50 162C60 185 85 195 100 195C115 195 140 185 150 162C155 175 140 185 130 185C135 175 125 160 120 150C118 165 110 175 100 180C90 175 82 165 80 150C75 160 65 175 70 185C60 185 45 175 50 162Z" fill="#EF4444" />
                  <!-- Medium Flame -->
                  <path d="M68 170C75 185 90 190 100 190C110 190 125 185 132 170C135 175 128 180 122 180C125 172 118 162 114 156C112 168 106 174 100 178C94 174 88 168 86 156C82 162 75 172 78 180C72 180 65 175 68 170Z" fill="#F97316" />
                  <!-- Inner Yellow Flame -->
                  <path d="M82 175C88 185 95 188 100 188C105 188 112 185 118 175C115 179 110 178 108 178C108 173 104 167 102 162C102 170 98 174 100 178C96 176 92 173 92 167C90 173 85 179 88 178C85 178 80 179 82 175Z" fill="#FBBF24" />
                </g>

                <!-- Pot Body -->
                <g id="pot">
                  <!-- Pot Handles -->
                  <path d="M48 118C35 118 35 132 48 132" stroke="#CBD5E1" stroke-width="6" stroke-linecap="round" />
                  <path d="M152 118C165 118 165 132 152 132" stroke="#CBD5E1" stroke-width="6" stroke-linecap="round" />
                  <!-- Inner Handle Shadows / Accents -->
                  <path d="M48 122C38 122 38 128 48 128" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" />
                  <path d="M152 122C162 122 162 128 152 128" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" />

                  <!-- Pot Base Curved Outline and Body -->
                  <path d="M46 110C46 142 54 166 100 166C146 166 154 142 154 110" fill="#E2E8F0" stroke="#94A3B8" stroke-width="4" stroke-linejoin="round" />
                  <!-- Reflections / Metallic Shine on the Pot -->
                  <path d="M55 114C55 138 60 156 90 158" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" />
                  <path d="M141 125C138 140 130 150 115 154" stroke="#CBD5E1" stroke-width="3" stroke-linecap="round" />

                  <!-- Top Pot Rim Outer -->
                  <ellipse cx="100" cy="110" rx="48" ry="8" fill="#F1F5F9" stroke="#94A3B8" stroke-width="4" />
                  <!-- Top Pot Rim Inner Shadow -->
                  <ellipse cx="100" cy="110" rx="40" ry="5" fill="#E2E8F0" />
                </g>

                <!-- Floating Ingredients -->
                <g id="ingredients">
                  <!-- Red Bell Pepper (Left) -->
                  <path d="M54 62C50 56 50 48 57 46C60 45 64 47 67 50C70 47 74 45 77 46C84 48 84 56 80 62C75 68 59 68 54 62Z" fill="#EF4444" />
                  <path d="M67 46C67 42 63 39 65 37" stroke="#22C55E" stroke-width="3" stroke-linecap="round" /> <!-- Stem -->
                  <path d="M58 50C56 52 56 57 59 60" stroke="#FF8A8A" stroke-width="2" stroke-linecap="round" /> <!-- Shine -->

                  <!-- Orange Carrot (Center-Right, Angled) -->
                  <g transform="translate(10, -5)">
                    <!-- Carrot Body -->
                    <path d="M85 65C87 63 118 35 125 38C128 41 113 70 108 72L85 65Z" fill="#F97316" />
                    <!-- Carrot details -->
                    <path d="M96 58L99 61" stroke="#EA580C" stroke-width="2" stroke-linecap="round" />
                    <path d="M107 48L110 51" stroke="#EA580C" stroke-width="2" stroke-linecap="round" />
                    <path d="M115 41L118 44" stroke="#EA580C" stroke-width="2" stroke-linecap="round" />
                    <!-- Carrot Green Stem -->
                    <path d="M125 38C128 35 135 32 138 34" stroke="#22C55E" stroke-width="3" stroke-linecap="round" />
                    <path d="M124 39C125 33 128 27 131 29" stroke="#22C55E" stroke-width="2" stroke-linecap="round" />
                  </g>

                  <!-- Tomato (Center-Bottom) -->
                  <circle cx="115" cy="85" r="13" fill="#EF4444" />
                  <circle cx="111" cy="81" r="3" fill="#FF8A8A" /> <!-- Shine -->
                  <!-- Tomato Top Green Leaf Star -->
                  <path d="M115 72L115 75M115 72L112 74M115 72L118 74M115 72L112 71M115 72L118 71" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" />

                  <!-- Red Onion Slice (Right) -->
                  <g transform="translate(140, 55)">
                    <!-- Outer Purple Shell -->
                    <circle cx="0" cy="0" r="14" fill="#A855F7" />
                    <!-- Inner White/Pink Details -->
                    <circle cx="0" cy="0" r="11" fill="#F3E8FF" />
                    <circle cx="0" cy="0" r="8" fill="#D8B4FE" />
                    <circle cx="0" cy="0" r="5" fill="#F3E8FF" />
                    <circle cx="0" cy="0" r="2" fill="#C084FC" />
                  </g>

                  <!-- Green Herbs / Spinach Leaves (Floating around) -->
                  <!-- Left Leaf -->
                  <path d="M40 76C42 70 52 70 50 80C46 82 38 82 40 76Z" fill="#22C55E" />
                  <path d="M40 76C44 76 46 78 48 80" stroke="#16A34A" stroke-width="1" />
                  <!-- Mid-Left Leaf -->
                  <g transform="translate(70, 75) rotate(-30)">
                    <path d="M0 -6C2 -12 12 -12 10 -2C6 0 -2 0 0 -6Z" fill="#22C55E" />
                  </g>
                  <!-- Right Leaf -->
                  <g transform="translate(145, 95) rotate(45)">
                    <path d="M0 -8C3 -15 15 -15 12 -2C7 0 -3 0 0 -8Z" fill="#22C55E" />
                  </g>
                  <!-- Tiny Green Peas -->
                  <circle cx="95" cy="50" r="3" fill="#22C55E" />
                  <circle cx="82" cy="55" r="2.5" fill="#22C55E" />
                  <circle cx="102" cy="72" r="3" fill="#22C55E" />
                </g>
              </svg>
            </div>
            <span class="font-display font-extrabold text-xl tracking-tight text-slate-900 dark:text-amber-150 group-hover:text-slate-950 dark:group-hover:text-amber-100 transition whitespace-nowrap">
              DAILY POT
            </span>
          </a>
        </div>

        <!-- Fully Centered Main Navigation with Publish '+' inline -->
        <div class="hidden md:flex flex-1 items-center justify-center gap-8 lg:gap-10 text-base md:text-lg font-bold tracking-wide">
          <a href="ingredients.html" class="${isSelected('ingredients')}">Pantry</a>
          <a href="search.html" class="${isSelected('search')}">Search</a>
          
          <!-- Large, Beautiful Centered Publish Plus Button -->
          <a href="publish.html" 
             class="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-slate-900 dark:border-amber-350 font-black transition duration-150 transform hover:scale-110 active:scale-95 shadow-[2px_2px_0px_0px_#0f172a] dark:shadow-[2px_2px_0px_0px_#ecbc82] select-none shrink-0 mx-1
             ${activePage === 'publish'
               ? 'bg-slate-950 text-white dark:bg-amber-400 dark:text-slate-950'
               : 'bg-slate-50 text-slate-800 hover:bg-slate-950 hover:text-white dark:bg-slate-900 dark:text-amber-100 dark:hover:bg-amber-350 dark:hover:text-slate-950'
             }" 
             title="Publish New Recipe"
          >
            <span class="text-xl font-black font-mono">+</span>
          </a>
          
          <a href="favorites.html" class="${isSelected('favorites')}">My Recipes</a>
          <a href="contact.html" class="${isSelected('contact')}">Contact</a>
        </div>

        <!-- System Controls with matching min-width to balance the layout -->
        <div class="flex items-center justify-end min-w-[150px] md:min-w-[220px] gap-3">
          <!-- Night Mode Theme Toggle -->
          <button id="theme-toggle-btn" class="p-2.5 transition cursor-pointer flex items-center justify-center shrink-0 hover:scale-115 active:scale-90" aria-label="Toggle Night Mode">
            <span id="theme-toggle-icon" class="text-xl select-none">☀️</span>
          </button>

          <!-- Mobile Menu Button -->
          <div class="flex items-center md:hidden">
            <button id="mobile-menu-toggle-btn" class="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-hidden focus:ring-2 focus:ring-inset focus:ring-slate-400 cursor-pointer" aria-expanded="false">
              <span class="sr-only">Open main menu</span>
              <svg id="hamburger-icon" class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg id="close-icon" class="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Panel -->
    <div class="hidden md:hidden border-b border-slate-200 bg-white" id="mobile-nav-panel">
      <div class="pt-2 pb-3 space-y-1 px-4">
        <a href="ingredients.html" class="block pl-3 pr-4 py-2 rounded-lg text-base font-medium ${activePage === 'ingredients' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}">Pantry</a>
        <a href="search.html" class="block pl-3 pr-4 py-2 rounded-lg text-base font-medium ${activePage === 'search' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}">Search</a>
        <a href="publish.html" class="flex items-center justify-between pl-3 pr-4 py-2 rounded-lg text-base font-medium ${activePage === 'publish' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-755'}">
          <span>Publish Recipe</span>
          <span class="w-6 h-6 rounded-full bg-slate-950 dark:bg-amber-400 text-white dark:text-slate-950 flex items-center justify-center font-bold font-mono text-xs shadow-3xs">+</span>
        </a>
        <a href="favorites.html" class="block pl-3 pr-4 py-2 rounded-lg text-base font-medium ${activePage === 'favorites' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}">My Recipes</a>
        <a href="contact.html" class="block pl-3 pr-4 py-2 rounded-lg text-base font-medium ${activePage === 'contact' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}">Contact</a>
      </div>
    </div>
  </nav>
  `;

  const footerHtml = `
  <footer class="px-8 py-6 bg-white border-t border-slate-205 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500 gap-6 mt-auto">
    <div class="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2">
      <button id="footer-faq-btn" class="hover:underline hover:text-slate-950 dark:hover:text-amber-100 transition font-bold cursor-pointer font-sans select-none flex items-center gap-1.5 focus:outline-none">
        <span>💬</span> Frequently Asked Questions (FAQ)
      </button>
      <span class="hidden md:inline text-slate-350 dark:text-slate-700 select-none">&bull;</span>
      <a href="contact.html" class="hover:underline hover:text-slate-950 dark:hover:text-amber-100 transition font-bold flex items-center gap-1.5">
        <span>✉️</span> Support or Help Center
      </a>
    </div>
    <div class="text-center md:text-right font-sans tracking-wide text-slate-455 space-y-1">
      <div>
        © 2026 <span class="font-bold text-slate-700 dark:text-amber-200">Daily Pot</span>. All rights reserved.
      </div>
      <div class="text-[9px] font-mono select-none opacity-80" id="offline-fallback-indicator-outer">
        <span id="offline-fallback-indicator" class="hidden inline-flex items-center gap-1 font-bold text-emerald-800 dark:text-emerald-400">
          💾 Offline Pantry Mode Active
        </span>
      </div>
    </div>
  </footer>
  `;

  // Inject Navigation
  const navContainer = document.getElementById('navbar');
  if (navContainer) {
    navContainer.outerHTML = navbarHtml;

    // Mobile menu show/hide
    const menuBtn = document.getElementById('mobile-menu-toggle-btn');
    const navPanel = document.getElementById('mobile-nav-panel');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');

    if (menuBtn && navPanel && hamburgerIcon && closeIcon) {
      menuBtn.addEventListener('click', () => {
        const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
        
        if (isExpanded) {
          navPanel.classList.add('hidden');
          hamburgerIcon.classList.remove('hidden');
          closeIcon.classList.add('hidden');
        } else {
          navPanel.classList.remove('hidden');
          hamburgerIcon.classList.add('hidden');
          closeIcon.classList.remove('hidden');
        }
      });
    }
  }

  // Inject Footer (if element with ID footer exists or just append to end of body)
  const footerContainer = document.getElementById('footer');
  if (footerContainer) {
    footerContainer.outerHTML = footerHtml;
  } else {
    const footerDiv = document.createElement('div');
    footerDiv.innerHTML = footerHtml;
    document.body.appendChild(footerDiv);
  }

  // Create & Wire Up FAQ Modal
  let faqModal = document.getElementById('faq-modal');
  if (!faqModal) {
    faqModal = document.createElement('div');
    faqModal.id = 'faq-modal';
    faqModal.className = 'hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition duration-200 animate-fade-in font-sans';
    faqModal.innerHTML = `
      <div class="bg-white rounded-3xl border border-slate-250 dark:border-amber-400 shadow-xl max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        <div class="absolute top-0 left-0 right-0 h-1 bg-slate-800 dark:bg-amber-400"></div>
        
        <div class="flex items-center justify-between border-b border-slate-205 pb-3 mb-5">
          <h2 class="font-display font-black text-xl text-slate-850 dark:text-amber-100 flex items-center gap-2">
            <span>❓</span> Frequently Asked Questions (FAQ)
          </h2>
          <button id="faq-modal-close" class="text-xs font-bold text-slate-400 hover:text-slate-605 dark:hover:text-amber-100 cursor-pointer p-1">
            ✕ Click to Close
          </button>
        </div>

        <div class="space-y-5 text-left">
          <div>
            <h3 class="font-sans font-bold text-sm text-slate-800 dark:text-amber-200">How does the Smart Pantry Matching work?</h3>
            <p class="text-xs text-slate-505 dark:text-slate-400 mt-1 leading-relaxed">
              Our matching engine scans the ingredients in your pantry stock, ranks them, and instantly matches them to available recipes. It prioritizes recipes with fewer missing ingredients, so you can cook immediately!
            </p>
          </div>

          <div>
            <h3 class="font-sans font-bold text-sm text-slate-800 dark:text-amber-200">What are "Smart Substitutions" in recipes?</h3>
            <p class="text-xs text-slate-550 dark:text-slate-400 mt-1 leading-relaxed">
              If a recipe requests dairy or baking goods like <strong class="text-slate-700 dark:text-amber-100">butter, milk, white sugar, or sour cream</strong> and you don't have them stocked, our engine intelligently flags alternatives like <strong class="text-slate-705 dark:text-amber-200">margarine, soy milk, brown sugar, or Greek yogurt</strong> automatically.
            </p>
          </div>

          <div>
            <h3 class="font-sans font-bold text-sm text-slate-800 dark:text-amber-200">Where is my data saved? Is it private?</h3>
            <p class="text-xs text-slate-550 dark:text-slate-400 mt-1 leading-relaxed">
              Yes, absolutely. Daily Pot stores 100% of your ingredient pantry, daily calendar schedules, and favorite lists directly inside your browser's local sandbox storage (localStorage). It keeps your pantry entirely offline-first, private, and secured.
            </p>
          </div>

          <div>
            <h3 class="font-sans font-bold text-sm text-slate-800 dark:text-amber-200">How do I contact support or get direct help?</h3>
            <p class="text-xs text-slate-550 dark:text-slate-400 mt-1 leading-relaxed">
              Navigate to the <a href="contact.html" class="underline text-slate-700 dark:text-amber-200 font-bold hover:text-slate-900">Support Desk</a> on our Contact page to shoot our support desk a direct support inquiry!
            </p>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-205 flex justify-end">
          <button id="faq-modal-ok" class="px-5 py-2.5 bg-slate-900 hover:bg-slate-950 text-white dark:bg-amber-400 dark:hover:bg-amber-500 dark:text-slate-950 text-xs font-bold rounded-xl transition cursor-pointer">
            Got it, thank you!
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(faqModal);
  }

  const faqBtn = document.getElementById('footer-faq-btn');
  const faqClose = document.getElementById('faq-modal-close');
  const faqOk = document.getElementById('faq-modal-ok');

  if (faqBtn && faqModal) {
    faqBtn.addEventListener('click', (e) => {
      e.preventDefault();
      faqModal!.classList.remove('hidden');
    });
  }

  const hideFaq = () => {
    if (faqModal) faqModal.classList.add('hidden');
  };

  if (faqClose) faqClose.addEventListener('click', hideFaq);
  if (faqOk) faqOk.addEventListener('click', hideFaq);
  if (faqModal) {
    faqModal.addEventListener('click', (e) => {
      if (e.target === faqModal) hideFaq();
    });
  }


  // Night Mode theme wireup
  const themeToggle = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-toggle-icon');

  function updateThemeUI(isDark: boolean) {
    if (isDark) {
      document.documentElement.classList.add('dark');
      if (themeIcon) themeIcon.textContent = '🌙';
      if (themeToggle) {
        themeToggle.className = "p-2.5 transition cursor-pointer flex items-center justify-center shrink-0 hover:scale-115 active:scale-90";
      }
    } else {
      document.documentElement.classList.remove('dark');
      if (themeIcon) themeIcon.textContent = '☀️';
      if (themeToggle) {
        themeToggle.className = "p-2.5 transition cursor-pointer flex items-center justify-center shrink-0 hover:scale-115 active:scale-90";
      }
    }
  }

  // Bind Init & Toggle Actions
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isCurrentlyDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
  updateThemeUI(isCurrentlyDark);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDarkNow = document.documentElement.classList.contains('dark');
      const nextDark = !isDarkNow;
      localStorage.setItem('theme', nextDark ? 'dark' : 'light');
      updateThemeUI(nextDark);
    });
  }
}

/**
 * Classifies a recipe into cooking methods (Air Fryer, Oven, Stovetop, Slow Cooker)
 * based on ingredients, title, equipment/steps, instructions or explicit fields.
 */
export function getRecipeCookingMethods(recipe: any): string[] {
  const methods: string[] = [];

  const title = (recipe.title || "").toLowerCase();
  const summary = (recipe.summary || "").toLowerCase();
  const instText = (recipe.instructions || "").toLowerCase();

  let hasAirFryer = false;
  let hasOven = false;
  let hasStovetop = false;
  let hasSlowCooker = false;

  // 1. Check title/summary/instructions text for direct references
  if (
    title.includes("air fryer") || title.includes("airfryer") || title.includes("air fry") ||
    summary.includes("air fryer") || summary.includes("airfryer") || summary.includes("air fry") ||
    instText.includes("air fryer") || instText.includes("airfryer") || instText.includes("air fry")
  ) {
    hasAirFryer = true;
  }

  if (
    title.includes("slow cooker") || title.includes("crockpot") || title.includes("crock pot") || title.includes("slow-cooker") ||
    summary.includes("slow cooker") || summary.includes("crockpot") || summary.includes("crock pot") || summary.includes("slow-cooker") ||
    instText.includes("slow cooker") || instText.includes("crockpot") || instText.includes("crock pot") || instText.includes("slow-cooker")
  ) {
    hasSlowCooker = true;
  }

  if (
    title.includes("oven") || title.includes("bake") || title.includes("roast") || title.includes("broil") || title.includes("casserole") || title.includes("lasagna") ||
    summary.includes("oven") || summary.includes("bake") || summary.includes("roast") || summary.includes("broil") || summary.includes("casserole") || summary.includes("lasagna") ||
    instText.includes("oven") || instText.includes("bake") || instText.includes("roast") || instText.includes("broil")
  ) {
    hasOven = true;
  }

  if (
    title.includes("pan") || title.includes("skillet") || title.includes("stovetop") || title.includes("stove") || title.includes("griddle") || title.includes("stir fry") || title.includes("pot") || title.includes("soup") || title.includes("sauté") ||
    summary.includes("pan") || summary.includes("skillet") || summary.includes("stovetop") || summary.includes("stove") || summary.includes("griddle") || summary.includes("stir fry") || summary.includes("pot") || summary.includes("soup") || summary.includes("sauté") ||
    instText.includes("pan") || instText.includes("skillet") || instText.includes("stovetop") || instText.includes("stove") || instText.includes("griddle") || instText.includes("stir-fry") || instText.includes("pot") || instText.includes("soup") || instText.includes("sauté")
  ) {
    hasStovetop = true;
  }

  // 2. Check steps & equipment
  if (recipe.analyzedInstructions && Array.isArray(recipe.analyzedInstructions)) {
    for (const instruction of recipe.analyzedInstructions) {
      if (instruction.steps && Array.isArray(instruction.steps)) {
        for (const step of instruction.steps) {
          const stepText = (step.step || "").toLowerCase();
          if (stepText.includes("air fryer") || stepText.includes("airfryer") || stepText.includes("air fry")) {
            hasAirFryer = true;
          }
          if (stepText.includes("oven") || stepText.includes("bake") || stepText.includes("roast") || stepText.includes("broil") || stepText.includes("temperature of 200") || stepText.includes("180 c") || stepText.includes("200 c") || stepText.includes("180°c") || stepText.includes("200°c")) {
            hasOven = true;
          }
          if (stepText.includes("slow cooker") || stepText.includes("crockpot") || stepText.includes("crock pot") || stepText.includes("slow-cooker")) {
            hasSlowCooker = true;
          }
          if (stepText.includes("pan") || stepText.includes("skillet") || stepText.includes("stovetop") || stepText.includes("stove") || stepText.includes("pot") || stepText.includes("sauté") || stepText.includes("sear") || stepText.includes("scramble") || stepText.includes("simmer") || stepText.includes("stir-fry") || stepText.includes("boil")) {
            hasStovetop = true;
          }

          if (step.equipment && Array.isArray(step.equipment)) {
            for (const eq of step.equipment) {
              const eqName = (eq.name || "").toLowerCase();
              if (eqName.includes("air fryer") || eqName.includes("airfryer") || eqName.includes("air fry")) hasAirFryer = true;
              if (eqName.includes("oven") || eqName.includes("baking disk") || eqName.includes("baking sheet") || eqName.includes("baking tray") || eqName.includes("casserole")) hasOven = true;
              if (eqName.includes("slow cooker") || eqName.includes("crockpot") || eqName.includes("crock pot") || eqName.includes("slow-cooker")) hasSlowCooker = true;
              if (eqName.includes("pan") || eqName.includes("skillet") || eqName.includes("stovetop") || eqName.includes("stove") || eqName.includes("pot") || eqName.includes("saucepan") || eqName.includes("wok") || eqName.includes("griddle")) hasStovetop = true;
            }
          }
        }
      }
    }
  }

  if (hasAirFryer) methods.push("Air Fryer");
  if (hasOven) methods.push("Oven");
  if (hasSlowCooker) methods.push("Slow Cooker");
  if (hasStovetop) methods.push("Stovetop");

  // Fallback explicit tags array if any
  if (recipe.cookingMethods && Array.isArray(recipe.cookingMethods)) {
    recipe.cookingMethods.forEach((m: string) => {
      if (!methods.includes(m)) {
        methods.push(m);
      }
    });
  }

  // Deduplicate and return
  return Array.from(new Set(methods));
}

/**
 * Returns HTML string representation of a beautifully colored badge matching the recipe's readyInMinutes category
 */
export function getTimeCategoryBadgeHtml(recipe: any): string {
  const readyTime = Number(recipe.readyInMinutes || 30);
  if (readyTime <= 30) {
    return `<span class="inline-flex items-center text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-250 dark:bg-amber-950/25 dark:text-amber-200 dark:border-amber-950/40 uppercase">
      ⏰ Under 30 Mins
    </span>`;
  } else if (readyTime < 120) {
    return `<span class="inline-flex items-center text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-150 uppercase">
      ⌛ Around 1 Hour
    </span>`;
  } else {
    return `<span class="inline-flex items-center text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-pink-50 text-pink-800 border border-pink-150 uppercase">
      ⏳ 2 Hours or More
    </span>`;
  }
}

/**
 * Returns HTML string representation of beautiful cooking method badges for a recipe
 */
export function renderCookingMethodBadges(recipe: any): string {
  const methods = getRecipeCookingMethods(recipe);
  if (methods.length === 0) return "";
  return methods.map(m => {
    let style = "bg-slate-100 text-slate-600 border-slate-200";
    let icon = "🍳";
    if (m === "Air Fryer") {
      style = "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/40";
      icon = "💨";
    } else if (m === "Oven") {
      style = "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/40 dark:text-rose-350 dark:border-rose-900/40";
      icon = "🔥";
    } else if (m === "Stovetop") {
      style = "bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900/40";
      icon = "🍳";
    } else if (m === "Slow Cooker") {
      style = "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/40";
      icon = "🍲";
    }
    return `<span class="inline-flex items-center text-[10px] font-bold tracking-wider px-2 py-0.5 rounded ${style} uppercase border">
      ${icon} ${m}
    </span>`;
  }).join("\n");
}

/**
 * Returns a fallback emoji representing the dish, along with the most common/primary ingredient.
 */
export function getRecipeFallbackDetails(recipe: any): { emoji: string; text: string } {
  const title = (recipe.title || "").toLowerCase();
  const summary = (recipe.summary || "").toLowerCase();

  // Dictionary of ingredient/dish name keywords to emojis
  const INGREDIENT_EMOJIS: { [key: string]: string } = {
    banana: "🍌",
    strawberry: "🍓",
    strawberries: "🍓",
    honey: "🍯",
    apple: "🍎",
    apples: "🍎",
    egg: "🍳",
    eggs: "🍳",
    chicken: "🍗",
    turkey: "🦃",
    beef: "🥩",
    steak: "🥩",
    pork: "🥓",
    bacon: "🥓",
    salmon: "🐟",
    tuna: "🐟",
    shrimp: "🍤",
    shrimps: "🍤",
    prawn: "🍤",
    prawns: "🍤",
    cod: "🐟",
    fish: "🐟",
    spinach: "🥬",
    lettuce: "🥬",
    cabbage: "🥬",
    kale: "🥬",
    salad: "🥗",
    broccoli: "🥦",
    tomato: "🍅",
    tomatoes: "🍅",
    mushroom: "🍄",
    mushrooms: "🍄",
    cheese: "🧀",
    milk: "🥛",
    cream: "🥛",
    butter: "🧈",
    yogurt: "🥛",
    potato: "🥔",
    potatoes: "🥔",
    onion: "🧅",
    onions: "🧅",
    garlic: "🧄",
    rice: "🍚",
    bread: "🍞",
    toast: "🍞",
    flour: "🌾",
    oat: "🌾",
    oats: "🌾",
    quinoa: "🌾",
    chia: "🌱",
    seed: "🌱",
    seeds: "🌱",
    tofu: "🌱",
    carrot: "🥕",
    carrots: "🥕",
    cucumber: "🥒",
    cucumbers: "🥒",
    pepper: "🫑",
    peppers: "🫑",
    chili: "🌶️",
    lemon: "🍋",
    lime: "🍋",
    orange: "🍊",
    avocado: "🥑",
    avocados: "🥑",
    grape: "🍇",
    grapes: "🍇",
    blueberry: "🫐",
    blueberries: "🫐",
    blackberry: "🫐",
    peach: "🍑",
    pineapple: "🍍",
    pear: "🍐",
    cherry: "🍒",
    cherries: "🍒",
    coconut: "🥥",
    oil: "🫒",
    olive: "🫒",
    olives: "🫒",
    nut: "🥜",
    peanut: "🥜",
    almond: "🥜",
    walnut: "🥜",
    chocolate: "🍫",
    cocoa: "🍫",
    sugar: "🍬",
    herb: "🌿",
    herbs: "🌿",
    parsley: "🌿",
    basil: "🌿",
    cilantro: "🌿",
    mint: "🌿",
    mustard: "🍯",
    syrup: "🍯",
    water: "💧",
    wine: "🍷",
    beer: "🍺",
    salt: "🧂",
    tortilla: "🫓",
    taco: "🌮",
    burrito: "🌯",
    pasta: "🍝",
    noodle: "🍝",
    noodles: "🍝",
    spaghetti: "🍝"
  };

  // Find emojis for each ingredient in the recipe
  const ingredientEmojis: string[] = [];
  const ignoredIngredients = ["salt", "pepper", "water", "olive oil", "vegetable oil", "oil", "butter", "cooking spray", "black pepper"];
  
  let primaryIngredient = "";

  if (recipe.extendedIngredients && Array.isArray(recipe.extendedIngredients) && recipe.extendedIngredients.length > 0) {
    const validIngs = recipe.extendedIngredients.filter((ing: any) => {
      const name = (ing.name || "").toLowerCase();
      return name && !ignoredIngredients.some(ig => name === ig || name.includes(ig));
    });
    
    const mainIng = validIngs.length > 0 ? validIngs[0] : recipe.extendedIngredients[0];
    primaryIngredient = mainIng ? (mainIng.name || "") : "";

    // Map ingredients to emojis
    recipe.extendedIngredients.forEach((ing: any) => {
      const name = (ing.name || "").toLowerCase();
      if (!name) return;

      // Find first matching emoji from key
      for (const [key, em] of Object.entries(INGREDIENT_EMOJIS)) {
        if (name.includes(key)) {
          if (!ingredientEmojis.includes(em)) {
            ingredientEmojis.push(em);
          }
          break; // Avoid double matching same ingredient
        }
      }
    });
  }

  // Fallback to title keywords if ingredient list is empty or returns no emojis
  if (ingredientEmojis.length === 0) {
    for (const [key, em] of Object.entries(INGREDIENT_EMOJIS)) {
      if (title.includes(key)) {
        if (!ingredientEmojis.includes(em)) {
          ingredientEmojis.push(em);
        }
      }
    }
  }

  // Limit compiled emojis to maximum 4 to keep it looking beautiful & clean
  let emoji = "";
  if (ingredientEmojis.length > 0) {
    emoji = ingredientEmojis.slice(0, 4).join("");
  }

  // Global default fallback emoji if none resolved
  if (!emoji) {
    if (title.includes("salad") || summary.includes("salad")) {
      emoji = "🥗";
    } else if (title.includes("burrito") || summary.includes("burrito") || title.includes("wrap")) {
      emoji = "🌯";
    } else if (title.includes("chicken") || title.includes("turkey") || title.includes("poultry")) {
      emoji = "🍗";
    } else if (title.includes("beef") || title.includes("steak") || title.includes("pork") || title.includes("meat")) {
      emoji = "🥩";
    } else if (title.includes("soup") || title.includes("stew") || title.includes("chowder")) {
      emoji = "🍲";
    } else if (title.includes("pasta") || title.includes("noodle") || title.includes("spaghetti")) {
      emoji = "🍝";
    } else if (title.includes("egg") || title.includes("omelette") || title.includes("scramble")) {
      emoji = "🍳";
    } else if (title.includes("salmon") || title.includes("tuna") || title.includes("fish") || title.includes("shrimp") || title.includes("seafood")) {
      emoji = "🍤";
    } else if (title.includes("bread") || title.includes("toast") || title.includes("sandwich")) {
      emoji = "🍞";
    } else {
      emoji = "🍽️";
    }
  }

  if (!primaryIngredient) {
    primaryIngredient = "Fresh Ingredients";
  }

  return {
    emoji,
    text: primaryIngredient
  };
}

/**
 * Renders a thumbnail container with support for missing or broken image links.
 * Showcases beautiful graphic typography with fallback emoji and most common primary ingredient card directly if no loadable image sources exist.
 */
export function renderRecipeImageThumbnail(recipe: any): string {
  const { emoji, text } = getRecipeFallbackDetails(recipe);
  const title = recipe.title || "Recipe";
  
  const imgUrl = recipe.image || "";
  const isMock = !imgUrl || imgUrl === "#" || imgUrl.includes("example.com");

  if (isMock) {
    return `
      <div class="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-center select-none absolute inset-0 z-0">
         <span class="text-5xl mb-2 filter drop-shadow-md transform group-hover:scale-110 transition duration-300">${emoji}</span>
         <span class="text-xs font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase truncate max-w-full px-2" title="Primary Ingredient: ${text}">
           ${text}
         </span>
      </div>
    `;
  }

  return `
    <img 
      src="${imgUrl}" 
      alt="${title}" 
      class="w-full h-full object-cover transition duration-350 absolute inset-0 z-10"
      referrerpolicy="no-referrer"
      onerror="this.style.display='none'; if (this.nextElementSibling) this.nextElementSibling.classList.remove('hidden');"
    />
    <div class="recipe-fallback-placeholder hidden w-full h-full flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-center select-none absolute inset-0 z-0">
       <span class="text-5xl mb-2 filter drop-shadow-md transform group-hover:scale-110 transition duration-300">${emoji}</span>
       <span class="text-[11px] font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase truncate max-w-full px-2" title="Primary Ingredient: ${text}">
         ${text}
       </span>
    </div>
  `;
}

