import { 
  setupLayout, 
  showToast, 
  SPOONACULAR_API_KEY, 
  runSubstitutionEngine,
  handleApiError,
  getRecipeCookingMethods,
  renderCookingMethodBadges,
  getTimeCategoryBadgeHtml,
  renderRecipeImageThumbnail
} from "./common";
import { FALLBACK_RECIPES } from "./recipes-fallback";

// Global cache of all recipes fetched successfully
let CachedDetailedRecipes: any[] = [];
let LocalFavorites: any[] = [];
let PantryList: string[] = [];
let recipeNameSearchQuery = "";
// Pagination state values
let currentPage = 1;
let RECIPES_PER_PAGE = Number(localStorage.getItem("recipe_recipes_per_page") || "10");
if (RECIPES_PER_PAGE !== 10 && RECIPES_PER_PAGE !== 20 && RECIPES_PER_PAGE !== 30) {
  RECIPES_PER_PAGE = 10;
}

/**
 * Bootstrap Search
 */
document.addEventListener("DOMContentLoaded", () => {
  setupLayout("search");
  loadFavoritesData();
  loadPantryData();

  // Register Search by Name Triggers
  const searchInput = document.getElementById("recipe-name-search-input") as HTMLInputElement | null;
  const searchBtn = document.getElementById("recipe-name-search-btn");
  const clearBtn = document.getElementById("recipe-name-clear-btn");

  function handleSearchByNameSubmit() {
    if (!searchInput) return;
    const val = searchInput.value.trim();
    recipeNameSearchQuery = val;
    if (val) {
      clearBtn?.classList.remove("hidden");
    } else {
      clearBtn?.classList.add("hidden");
    }
    triggerSearch();
  }

  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", () => {
      handleSearchByNameSubmit();
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleSearchByNameSubmit();
      }
    });
  }

  if (clearBtn && searchInput) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      recipeNameSearchQuery = "";
      clearBtn.classList.add("hidden");
      triggerSearch();
    });
  }
  
  // Attach filter change listeners
  const filterTime = document.getElementById("filter-time") as HTMLInputElement | null;
  const filterTimeAround1h = document.getElementById("filter-time-around1h") as HTMLInputElement | null;
  const filterTime2h = document.getElementById("filter-time-2h") as HTMLInputElement | null;
  const filterAirfryer = document.getElementById("filter-airfryer") as HTMLInputElement | null;
  const filterOvenMethod = document.getElementById("filter-oven-method") as HTMLInputElement | null;
  const filterStovetop = document.getElementById("filter-stovetop") as HTMLInputElement | null;
  const filterSlowCooker = document.getElementById("filter-slow-cooker") as HTMLInputElement | null;

  if (filterTime) {
    filterTime.addEventListener("change", () => {
      applyFiltersAndRender(true);
    });
  }
  if (filterTimeAround1h) {
    filterTimeAround1h.addEventListener("change", () => {
      applyFiltersAndRender(true);
    });
  }
  if (filterTime2h) {
    filterTime2h.addEventListener("change", () => {
      applyFiltersAndRender(true);
    });
  }
  if (filterAirfryer) {
    filterAirfryer.addEventListener("change", () => {
      applyFiltersAndRender(true);
    });
  }
  if (filterOvenMethod) {
    filterOvenMethod.addEventListener("change", () => {
      applyFiltersAndRender(true);
    });
  }
  if (filterStovetop) {
    filterStovetop.addEventListener("change", () => {
      applyFiltersAndRender(true);
    });
  }
  if (filterSlowCooker) {
    filterSlowCooker.addEventListener("change", () => {
      applyFiltersAndRender(true);
    });
  }

  // Filters Drawer Toggle logic
  const filtersToggleBtn = document.getElementById("filters-toggle-btn");
  const filtersShelf = document.getElementById("filters-shelf");
  if (filtersToggleBtn && filtersShelf) {
    // Read previous state or default to open/closed
    const isShelfOpen = localStorage.getItem("filters_shelf_open_recipes") === "true";
    if (isShelfOpen) {
      filtersShelf.classList.remove("hidden");
      filtersToggleBtn.classList.add("bg-slate-100", "dark:bg-slate-800", "border-slate-500", "dark:border-amber-400");
    }

    filtersToggleBtn.addEventListener("click", () => {
      const isOpen = !filtersShelf.classList.contains("hidden");
      if (isOpen) {
        filtersShelf.classList.add("hidden");
        filtersToggleBtn.classList.remove("bg-slate-100", "dark:bg-slate-800", "border-slate-500", "dark:border-amber-400");
        localStorage.setItem("filters_shelf_open_recipes", "false");
      } else {
        filtersShelf.classList.remove("hidden");
        filtersToggleBtn.classList.add("bg-slate-100", "dark:bg-slate-800", "border-slate-500", "dark:border-amber-400");
        localStorage.setItem("filters_shelf_open_recipes", "true");
      }
    });
  }

  // Link show limit buttons click behavior
  const btn10 = document.getElementById("limit-10-btn");
  const btn20 = document.getElementById("limit-20-btn");
  const btn30 = document.getElementById("limit-30-btn");
  
  function updateLimitButtonsUI() {
    const activeClass = "px-3.5 py-1 text-xs font-black rounded-lg transition cursor-pointer bg-slate-900 border border-slate-950 text-white dark:bg-amber-400 dark:border-amber-350 dark:text-slate-950 shadow-xs";
    const inactiveClass = "px-3.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer text-slate-600 dark:text-slate-300 hover:text-slate-850 hover:bg-slate-100 dark:hover:bg-slate-700";

    if (btn10) btn10.className = RECIPES_PER_PAGE === 10 ? activeClass : inactiveClass;
    if (btn20) btn20.className = RECIPES_PER_PAGE === 20 ? activeClass : inactiveClass;
    if (btn30) btn30.className = RECIPES_PER_PAGE === 30 ? activeClass : inactiveClass;
  }

  updateLimitButtonsUI();

  if (btn10) {
    btn10.addEventListener("click", () => {
      if (RECIPES_PER_PAGE === 10) return;
      RECIPES_PER_PAGE = 10;
      localStorage.setItem("recipe_recipes_per_page", "10");
      updateLimitButtonsUI();
      applyFiltersAndRender(true);
    });
  }

  if (btn20) {
    btn20.addEventListener("click", () => {
      if (RECIPES_PER_PAGE === 20) return;
      RECIPES_PER_PAGE = 20;
      localStorage.setItem("recipe_recipes_per_page", "20");
      updateLimitButtonsUI();
      applyFiltersAndRender(true);
    });
  }

  if (btn30) {
    btn30.addEventListener("click", () => {
      if (RECIPES_PER_PAGE === 30) return;
      RECIPES_PER_PAGE = 30;
      localStorage.setItem("recipe_recipes_per_page", "30");
      updateLimitButtonsUI();
      applyFiltersAndRender(true);
    });
  }

  // Modal setup
  const closeBtn = document.getElementById("modal-close-btn");
  const modal = document.getElementById("recipe-modal");
  
  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
    // Click outside modal closing
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    });
  }

  // Run on start
  triggerSearch();
});

/**
 * Load Favorites mapping
 */
function loadFavoritesData(): void {
  try {
    const raw = localStorage.getItem("favorite_recipes");
    LocalFavorites = raw ? JSON.parse(raw) : [];
  } catch {
    LocalFavorites = [];
  }
}

/**
 * Persist favorites
 */
function saveFavoritesData(): void {
  try {
    localStorage.setItem("favorite_recipes", JSON.stringify(LocalFavorites));
  } catch (err) {
    console.error("Failed to commit favorites data:", err);
  }
}

/**
 * Load Pantry from storage
 */
function loadPantryData(): void {
  try {
    const raw = localStorage.getItem("pantry_list");
    PantryList = raw ? JSON.parse(raw) : [];
  } catch {
    PantryList = [];
  }

  const summary = document.getElementById("search-ingredients-summary");
  if (summary) {
    if (PantryList.length > 0) {
      summary.textContent = PantryList.join(", ");
    } else {
      summary.textContent = "None";
    }
  }
}

/**
 * Check if a recipe requires an oven based on instructions and equipment lists
 */
function checkRecipeOvenConstraint(recipe: any): boolean {
  // 1. Check steps equipment
  if (recipe.analyzedInstructions && Array.isArray(recipe.analyzedInstructions)) {
    for (const instruction of recipe.analyzedInstructions) {
      if (instruction.steps && Array.isArray(instruction.steps)) {
        for (const step of instruction.steps) {
          if (step.step && step.step.toLowerCase().includes("oven")) {
            return true;
          }
          if (step.equipment && Array.isArray(step.equipment)) {
            for (const eq of step.equipment) {
              if (eq.name && eq.name.toLowerCase().includes("oven")) {
                return true;
              }
            }
          }
        }
      }
    }
  }

  // 2. Check summary instructions text
  const textCheck = `${recipe.instructions || ""} ${recipe.summary || ""}`.toLowerCase();
  return textCheck.includes("oven");
}

/**
 * Loads and scores custom user-published recipes from localStorage against current pantry list
 */
function loadCustomPublishedRecipes(): any[] {
  try {
    const raw = localStorage.getItem("custom_published_recipes");
    if (!raw) return [];
    let customs = JSON.parse(raw);
    if (!Array.isArray(customs)) return [];

    // Filter by name query
    if (recipeNameSearchQuery) {
      const q = recipeNameSearchQuery.toLowerCase();
      customs = customs.filter((r: any) => 
        r.title.toLowerCase().includes(q) || 
        (r.summary && r.summary.toLowerCase().includes(q))
      );
    }

    return customs.map((recipe: any) => {
      const recipeIngredients = (recipe.extendedIngredients || []).map((ing: any) => (ing.name || "").toLowerCase());
      const matched = recipeIngredients.filter((ingName: any) => 
        PantryList.some(p => p.toLowerCase() === ingName || p.toLowerCase().includes(ingName) || ingName.includes(p.toLowerCase()))
      );
      const hasCount = matched.length;
      const matchPercentage = recipeIngredients.length > 0 ? (hasCount / recipeIngredients.length) : 0;
      
      return {
        ...recipe,
        matchPercentage: Math.round(matchPercentage * 100),
        matchCount: hasCount,
        totalIngredientsCount: recipeIngredients.length
      };
    });
  } catch (err) {
    console.error("Failed to load custom local recipes:", err);
    return [];
  }
}

/**
 * Load offline robust fallback when Spoonacular fails or times out
 */
function loadOfflineFallbackRecipes(): void {
  let list = [...FALLBACK_RECIPES];

  // If there is an active search query, filter list by name
  if (recipeNameSearchQuery) {
    const q = recipeNameSearchQuery.toLowerCase();
    list = list.filter(r => 
      r.title.toLowerCase().includes(q) || 
      (r.summary && r.summary.toLowerCase().includes(q))
    );
  }

  // Map and score all fallback recipes based on user pantry
  const localMatches = list.map(recipe => {
    const recipeIngredients = (recipe.extendedIngredients || []).map(ing => ing.name.toLowerCase());
    const matched = recipeIngredients.filter(ingName => 
      PantryList.some(p => p.toLowerCase() === ingName || p.toLowerCase().includes(ingName) || ingName.includes(p.toLowerCase()))
    );
    const hasCount = matched.length;
    const matchPercentage = recipeIngredients.length > 0 ? (hasCount / recipeIngredients.length) : 0;
    return {
      recipe,
      matchCount: hasCount,
      matchPercentage: matchPercentage
    };
  });

  // Sort by match score (highest percentage/matched count first)
  localMatches.sort((a, b) => b.matchPercentage - a.matchPercentage || b.matchCount - a.matchCount);

  CachedDetailedRecipes = localMatches.map(item => ({
    ...item.recipe,
    matchPercentage: Math.round(item.matchPercentage * 100),
    matchCount: item.matchCount,
    totalIngredientsCount: item.recipe.extendedIngredients.length
  }));

  const fallbackIndicator = document.getElementById("offline-fallback-indicator");
  if (fallbackIndicator) {
    fallbackIndicator.classList.remove("hidden");
  }
}

/**
 * Formulate request, fetch ID list and information mappings
 */
async function triggerSearch(): Promise<void> {
  const loading = document.getElementById("loading");
  const grid = document.getElementById("recipes-grid");
  const norecipes = document.getElementById("no-recipes-found");

  if (!loading || !grid || !norecipes) return;

  const fallbackIndicator = document.getElementById("offline-fallback-indicator");
  if (fallbackIndicator) {
    fallbackIndicator.classList.add("hidden");
  }

  // Clear any existing alert banner first
  const alertContainer = document.getElementById("global-alert-container");
  if (alertContainer) {
    alertContainer.innerHTML = "";
    alertContainer.classList.add("hidden");
  }

  // If there is no pantry list and no search query, we show empty pantry warning
  if (PantryList.length === 0 && !recipeNameSearchQuery) {
    loading.classList.add("hidden");
    norecipes.classList.add("hidden");
    grid.classList.remove("hidden");

    // Shuffle and load all fallback recipes randomly
    const randomized = [...FALLBACK_RECIPES].sort(() => 0.5 - Math.random());
    CachedDetailedRecipes = randomized.map(recipe => ({
      ...recipe,
      matchPercentage: 0,
      matchCount: 0,
      totalIngredientsCount: (recipe.extendedIngredients || []).length
    }));

    const customsState = loadCustomPublishedRecipes();
    CachedDetailedRecipes = [...customsState, ...CachedDetailedRecipes];

    showCustomAlert(
      "empty-pantry-random",
      "🍳 Your pantry is empty but here are some recipes for the future",
      "Stock your kitchen ingredients using the pantry ingredients list to get precise ingredient-matching and custom substitution indicators!",
      "warning",
      { label: "Go Stock Ingredients Pantry", href: "ingredients.html" }
    );

    applyFiltersAndRender();
    return;
  }

  try {
    loading.classList.remove("hidden");
    grid.classList.add("hidden");
    norecipes.classList.add("hidden");

    // We implement a fast robust Promise.race timeout for Spoonacular API search
    const apiCallPromise = (async () => {
      let findUrl = "";
      
      if (recipeNameSearchQuery) {
        // Search by name query (using Spoonacular complexSearch with addRecipeInformation & fillIngredients)
        findUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(recipeNameSearchQuery)}&addRecipeInformation=true&fillIngredients=true&number=60&apiKey=${SPOONACULAR_API_KEY}`;
        const resList = await fetch(findUrl);
        if (!resList.ok) {
          await handleApiError(resList, "Failed looking up recipes by name.");
        }
        const data = await resList.json();
        return data.results || [];
      } else {
        // Default ingredient matching search
        findUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(PantryList.join(","))}&number=60&apiKey=${SPOONACULAR_API_KEY}`;
        const resHeaders = await fetch(findUrl);
        if (!resHeaders.ok) {
          await handleApiError(resHeaders, "Failed looking up recipes matching your ingredients list.");
        }

        const headersList: any[] = await resHeaders.json();
        if (!headersList || headersList.length === 0) {
          return [];
        }

        // Fetch informational details for each in parallel
        const infoPromises = headersList.map(async (header) => {
          const infoUrl = `https://api.spoonacular.com/recipes/${header.id}/information?apiKey=${SPOONACULAR_API_KEY}`;
          const resInfo = await fetch(infoUrl);
          if (!resInfo.ok) {
            console.warn(`Could not load details for recipe ID ${header.id}`);
            return null;
          }
          return await resInfo.json();
        });

        const detailedList = await Promise.all(infoPromises);
        return detailedList.filter((item): item is any => item !== null);
      }
    })();

    const timeoutPromise = new Promise<any[]>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout (2.5s exceeded)")), 2500)
    );

    // Race the API call with our timeout trigger
    const results = await Promise.race([apiCallPromise, timeoutPromise]);
    
    if (results && results.length > 0) {
      CachedDetailedRecipes = results;
    } else {
      // In case they returned empty results, let's load fallback recipes so they have a filled dashboard
      loadOfflineFallbackRecipes();
    }

    const customsState = loadCustomPublishedRecipes();
    CachedDetailedRecipes = [...customsState, ...CachedDetailedRecipes];

    loading.classList.add("hidden");
    applyFiltersAndRender();
  } catch (err: any) {
    console.warn("Spoonacular API Search failed or timed out. Triggering beautiful offline fallback. Error details:", err);
    
    // Smoothly load offline culinary pantry database
    loadOfflineFallbackRecipes();

    const customsState = loadCustomPublishedRecipes();
    CachedDetailedRecipes = [...customsState, ...CachedDetailedRecipes];
    
    loading.classList.add("hidden");
    applyFiltersAndRender();
  }
}

/**
 * Filter the Cached list and draw the current results
 */
function applyFiltersAndRender(resetPage: any = true): void {
  const grid = document.getElementById("recipes-grid");
  const norecipes = document.getElementById("no-recipes-found");
  const paginationControls = document.getElementById("pagination-controls");

  if (!grid || !norecipes) return;

  const filterTime = document.getElementById("filter-time") as HTMLInputElement | null;
  const filterTimeAround1h = document.getElementById("filter-time-around1h") as HTMLInputElement | null;
  const filterTime2h = document.getElementById("filter-time-2h") as HTMLInputElement | null;

  const max30Mins = filterTime?.checked || false;
  const around1h = filterTimeAround1h?.checked || false;
  const over2h = filterTime2h?.checked || false;

  // Filter local copy
  let visibleRecipes = [...CachedDetailedRecipes];

  const hasTimeFilter = max30Mins || around1h || over2h;
  if (hasTimeFilter) {
    visibleRecipes = visibleRecipes.filter(recipe => {
      const readyTime = Number(recipe.readyInMinutes || 30);
      if (max30Mins && readyTime <= 30) return true;
      if (around1h && readyTime > 30 && readyTime < 120) return true;
      if (over2h && readyTime >= 120) return true;
      return false;
    });
  }

  // Multi-select Cooking Method Styles
  const airfryerActive = (document.getElementById("filter-airfryer") as HTMLInputElement | null)?.checked || false;
  const ovenMethodActive = (document.getElementById("filter-oven-method") as HTMLInputElement | null)?.checked || false;
  const stovetopActive = (document.getElementById("filter-stovetop") as HTMLInputElement | null)?.checked || false;
  const slowCookerActive = (document.getElementById("filter-slow-cooker") as HTMLInputElement | null)?.checked || false;

  const styleFilterActive = airfryerActive || ovenMethodActive || stovetopActive || slowCookerActive;

  if (styleFilterActive) {
    visibleRecipes = visibleRecipes.filter(recipe => {
      const methods = getRecipeCookingMethods(recipe);
      if (airfryerActive && methods.includes("Air Fryer")) return true;
      if (ovenMethodActive && methods.includes("Oven")) return true;
      if (stovetopActive && methods.includes("Stovetop")) return true;
      if (slowCookerActive && methods.includes("Slow Cooker")) return true;
      return false;
    });
  }

  // Update active badge counts
  updateActiveFiltersBadgeCount();

  const totalCount = visibleRecipes.length;

  if (resetPage === true || (resetPage && typeof resetPage === "object")) {
    currentPage = 1;
  }

  const totalPages = Math.ceil(totalCount / RECIPES_PER_PAGE);
  if (currentPage > totalPages && totalPages > 0) {
    currentPage = totalPages;
  }

  const startIndex = (currentPage - 1) * RECIPES_PER_PAGE;
  const endIndex = startIndex + RECIPES_PER_PAGE;
  const pageRecipes = visibleRecipes.slice(startIndex, endIndex);

  // Draw Grid
  grid.innerHTML = "";

  if (totalCount === 0) {
    grid.classList.add("hidden");
    norecipes.classList.remove("hidden");
    if (paginationControls) {
      paginationControls.classList.add("hidden");
    }
    const submsg = document.getElementById("no-recipes-submsg");
    if (submsg) {
      submsg.textContent = "Your active search and filter constraints filtered out all recipe recommendations! Try turning off some toggles.";
    }
    return;
  }

  grid.classList.remove("hidden");
  norecipes.classList.add("hidden");

  // Render pagination buttons
  renderPaginationControls(totalCount);

  pageRecipes.forEach(recipe => {
    // Process substitution check
    const recipeIngredients = (recipe.extendedIngredients || []).map((ing: any) => ing.name || "");
    const subResult = runSubstitutionEngine(recipeIngredients, PantryList);

    const isFav = LocalFavorites.some(f => f.id === recipe.id);

    // Calculate match percentage dynamically
    let pct = 0;
    if (recipe.matchPercentage !== undefined) {
      pct = recipe.matchPercentage;
    } else {
      const lowerNames = recipeIngredients.map((name: string) => name.toLowerCase());
      const hasCount = lowerNames.filter((ingName: string) => 
        PantryList.some((p: string) => p.toLowerCase() === ingName || p.toLowerCase().includes(ingName) || ingName.includes(p.toLowerCase()))
      ).length;
      pct = lowerNames.length > 0 ? Math.round((hasCount / lowerNames.length) * 100) : 100;
    }

    const card = document.createElement("div");
    card.className = "bg-white rounded-2xl border border-slate-205 shadow-sm overflow-hidden hover:shadow-xs transition duration-300 flex flex-col group h-full relative cursor-pointer hover:border-slate-850 dark:hover:border-amber-300";

    // Build Substitution banner tag snippet
    let subTagHtml = "";
    if (subResult.hasSubstitutions) {
      subTagHtml = `
        <div class="absolute top-3 left-3 z-10 bg-amber-500 text-white text-[10px] px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1 font-bold tracking-wider uppercase pointer-events-none">
          ⚠️ Substitutions Ready
        </div>
      `;
    }

    card.innerHTML = `
      <!-- Thumbnail Header -->
      <div class="relative h-48 bg-slate-100 dark:bg-slate-950 shrink-0 overflow-hidden">
        ${subTagHtml}
        ${renderRecipeImageThumbnail(recipe)}
        <!-- Hearts layout -->
        <button 
          class="fav-toggle-btn absolute top-3 right-3 p-2 bg-white/95 text-slate-400 hover:text-red-500 active:scale-95 transition shadow-xs cursor-pointer rounded-full z-10"
          data-id="${recipe.id}"
          aria-label="Toggle favorites list"
        >
          <svg class="w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <!-- Specs info -->
      <div class="p-5 flex-1 flex flex-col justify-between">
        <div class="space-y-2">
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            ${getTimeCategoryBadgeHtml(recipe)}
            <span class="inline-flex items-center text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-slate-150 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-350 dark:border-slate-800 font-mono">
              Ready in ${recipe.readyInMinutes}m
            </span>
            <span class="inline-flex items-center text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-950 uppercase border border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/40">
              🎯 ${pct}% Matched
            </span>
            ${renderCookingMethodBadges(recipe)}
          </div>

          <h3 class="font-display font-bold text-slate-850 dark:text-amber-100 line-clamp-2 leading-snug text-base group-hover:text-slate-950 dark:group-hover:text-white transition">
            ${recipe.title}
          </h3>

          <!-- Details snippets -->
          <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            ${recipe.summary ? recipe.summary.replace(/<[^>]*>/g, '') : 'Ready to cook. Click anywhere on card to explore instructions.'}
          </p>
        </div>

        <!-- Call to Action indicator details -->
        <div class="mt-4 pt-4 border-t border-slate-205 border-dashed flex items-center justify-between">
          <span class="text-[10px] text-slate-400 font-mono tracking-wider">ID: ${recipe.id}</span>
          <span 
            class="text-xs font-bold text-slate-900 dark:text-amber-200 flex items-center gap-1 transition-all group-hover:text-slate-950 dark:group-hover:text-amber-100 group-hover:underline"
          >
            Read Details ➔
          </span>
        </div>
      </div>
    `;

    // Hook listeners
    // 1. Favorite Toggle
    const favBtn = card.querySelector(".fav-toggle-btn");
    favBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(recipe);
    });

    // 2. Open Details modal on full card click
    card.addEventListener("click", () => {
      openDetailsModal(recipe, subResult);
    });

    grid.appendChild(card);
  });
}

/**
 * Render pagination numbers, prev & next controls, and explicit last page shortcut button
 */
function renderPaginationControls(totalResults: number): void {
  const container = document.getElementById("pagination-controls");
  if (!container) return;

  const totalPages = Math.ceil(totalResults / RECIPES_PER_PAGE);

  if (totalPages <= 1) {
    container.classList.add("hidden");
    return;
  }

  container.classList.remove("hidden");
  container.innerHTML = "";

  // 1. Previous page button
  const prevBtn = document.createElement("button");
  prevBtn.innerHTML = `
    <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
    <span>Prev</span>
  `;
  prevBtn.className = `flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer border ${
    currentPage === 1 
      ? "text-slate-300 border-slate-100 dark:text-slate-600 dark:border-slate-850 cursor-not-allowed pointer-events-none" 
      : "text-slate-650 border-slate-200 dark:text-slate-300 dark:border-slate-700 hover:border-slate-850 hover:text-slate-900 hover:bg-slate-100/55 dark:hover:border-amber-350 dark:hover:text-amber-100 dark:hover:bg-amber-950/20"
  }`;
  if (currentPage > 1) {
    prevBtn.addEventListener("click", () => {
      currentPage--;
      applyFiltersAndRender(false);
      scrollToRecipesHeader();
    });
  }
  container.appendChild(prevBtn);

  // 2. Compact range of page numbers
  for (let p = 1; p <= totalPages; p++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = p.toString();
    if (p === currentPage) {
      pageBtn.className = "px-3.5 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer bg-slate-900 hover:bg-slate-950 text-white dark:bg-amber-400 dark:hover:bg-amber-500 dark:text-slate-900 shadow-xs border border-slate-950 dark:border-amber-300";
    } else {
      pageBtn.className = "px-3.5 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer border border-slate-250 text-slate-605 hover:border-slate-850 hover:text-slate-900 bg-slate-50 hover:bg-white dark:border-slate-800 dark:text-slate-300 dark:save-bg-slate-900/40 dark:hover:bg-slate-800 dark:hover:border-amber-450 dark:hover:text-amber-150";
      pageBtn.addEventListener("click", () => {
        currentPage = p;
        applyFiltersAndRender(false);
        scrollToRecipesHeader();
      });
    }
    container.appendChild(pageBtn);
  }

  // 3. Last page available button with the actual page number explicitly in it
  const separator = document.createElement("span");
  separator.className = "text-slate-300 dark:text-slate-700 mx-1 font-mono text-xs select-none";
  separator.textContent = "|";
  container.appendChild(separator);

  const lastBtn = document.createElement("button");
  lastBtn.textContent = `Last (${totalPages})`;
  lastBtn.className = `px-3.5 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer border ${
    currentPage === totalPages
      ? "bg-slate-900 hover:bg-slate-950 text-white dark:bg-amber-400 dark:hover:bg-amber-500 dark:text-slate-900 shadow-xs border-slate-950 dark:border-amber-300 pointer-events-none"
      : "border-slate-250 text-slate-605 hover:border-slate-850 hover:text-slate-900 bg-slate-50 hover:bg-white dark:border-slate-805 dark:text-slate-300 dark:bg-slate-900/40 dark:hover:bg-slate-800 dark:hover:border-amber-450 dark:hover:text-amber-105"
  }`;
  if (currentPage !== totalPages) {
    lastBtn.addEventListener("click", () => {
      currentPage = totalPages;
      applyFiltersAndRender(false);
      scrollToRecipesHeader();
    });
  }
  container.appendChild(lastBtn);

  // 4. Next page button
  const nextBtn = document.createElement("button");
  nextBtn.innerHTML = `
    <span>Next</span>
    <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  `;
  nextBtn.className = `flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer border ${
    currentPage === totalPages 
      ? "text-slate-300 border-slate-100 dark:text-slate-600 dark:border-slate-850 cursor-not-allowed pointer-events-none" 
      : "text-slate-650 border-slate-200 dark:text-slate-305 dark:border-slate-700 hover:border-slate-850 hover:text-slate-900 hover:bg-slate-100/55 dark:hover:border-amber-350 dark:hover:text-amber-100 dark:hover:bg-amber-950/20"
  }`;
  if (currentPage < totalPages) {
    nextBtn.addEventListener("click", () => {
      currentPage++;
      applyFiltersAndRender(false);
      scrollToRecipesHeader();
    });
  }
  container.appendChild(nextBtn);
}

/**
 * Simple helper to scroll back up to the search results header
 */
function scrollToRecipesHeader(): void {
  const element = document.getElementById("recipes-grid");
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/**
 * Show a banner custom alert dialog in UI
 */
function showCustomAlert(id: string, title: string, text: string, type: 'error' | 'warning', cta?: { label: string, href: string }): void {
  const container = document.getElementById("global-alert-container");
  if (!container) return;

  const btnHtml = cta 
    ? `<div class="mt-3.5">
         <a href="${cta.href}" class="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-950 dark:bg-amber-400 dark:hover:bg-amber-500 dark:text-slate-900 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer">
           🥦 ${cta.label}
         </a>
       </div>`
    : '';

  container.innerHTML = `
    <div class="rounded-xl border p-4 flex items-start gap-4 transition-colors duration-300 ${
      type === 'error' 
        ? 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-200' 
        : 'bg-amber-50 border-amber-300 text-amber-950 dark:bg-amber-950/40 dark:border-amber-900/50 dark:text-amber-200'
    }">
      <span class="text-xl shrink-0">${type === 'error' ? '❌' : '💡'}</span>
      <div class="flex-1">
        <h4 class="font-bold text-sm tracking-tight mb-0.5 ${type === 'error' ? 'text-red-900 dark:text-red-100' : 'text-amber-950 dark:text-amber-200'}">${title}</h4>
        <p class="text-xs ${type === 'error' ? 'text-red-800 dark:text-red-300/90' : 'text-amber-900 dark:text-amber-300/90'} leading-relaxed">${text}</p>
        ${btnHtml}
      </div>
    </div>
  `;
  container.classList.remove("hidden");
}

/**
 * Handle Favorite Toggle
 */
function toggleFavorite(recipe: any): void {
  const idx = LocalFavorites.findIndex(f => f.id === recipe.id);
  
  if (idx !== -1) {
    LocalFavorites.splice(idx, 1);
    showToast(`Removed "${recipe.title}" from Favorites list.`, "warning", 2000);
  } else {
    // Save minimal package needed for favorite render!
    // The details include readiness, instructions, etc., so we store the full object to keep offline capability!
    LocalFavorites.push(recipe);
    showToast(`Added "${recipe.title}" to Favorites list!`, "success", 2000);
  }

  saveFavoritesData();
  applyFiltersAndRender();
}

/**
 * Display full recipes information details inside modal block
 */
function openDetailsModal(recipe: any, subResult: any): void {
  const modal = document.getElementById("recipe-modal");
  if (!modal) return;

  // Header Details
  const imgElement = document.getElementById("modal-img") as HTMLImageElement | null;
  if (imgElement) {
    imgElement.src = recipe.image || "";
    imgElement.alt = recipe.title;
  }

  const titleElement = document.getElementById("modal-title");
  if (titleElement) titleElement.textContent = recipe.title;

  const prepElement = document.getElementById("modal-prep");
  if (prepElement) prepElement.textContent = `⏰ Ready in ${recipe.readyInMinutes}m`;

  const servingsElement = document.getElementById("modal-servings");
  if (servingsElement) servingsElement.textContent = `🥣 ${recipe.servings || 4} Servings`;

  // Summary content
  const descElement = document.getElementById("modal-desc");
  if (descElement) {
    descElement.innerHTML = recipe.summary || "No description provided.";
  }

  // Substitutions warnings list
  const subBanner = document.getElementById("modal-substitutes-banner");
  const subList = document.getElementById("modal-substitutes-list");
  
  if (subBanner && subList) {
    if (subResult.hasSubstitutions) {
      subBanner.classList.remove("hidden");
      subList.innerHTML = "";
      subResult.warnings.forEach((warn: string) => {
        const li = document.createElement("li");
        li.textContent = warn;
        subList.appendChild(li);
      });
    } else {
      subBanner.classList.add("hidden");
    }
  }

  // Ingredients lists
  const ingList = document.getElementById("modal-ingredients-list");
  if (ingList) {
    ingList.innerHTML = "";
    (recipe.extendedIngredients || []).forEach((ing: any) => {
      const li = document.createElement("li");
      li.className = "flex justify-between items-center py-1.5 border-b border-gray-50";
      
      const amountStr = `${ing.amount} ${ing.unit}`.trim();
      li.innerHTML = `
        <span class="font-medium text-gray-800">${ing.name || ing.originalName}</span>
        <span class="font-mono text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">${amountStr}</span>
      `;
      ingList.appendChild(li);
    });
  }

  // Instructions Steps list
  const stepsList = document.getElementById("modal-steps-list");
  if (stepsList) {
    stepsList.innerHTML = "";
    
    let stepCount = 0;
    if (recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0) {
      recipe.analyzedInstructions.forEach((inst: any) => {
        (inst.steps || []).forEach((step: any) => {
          stepCount++;
          const li = document.createElement("li");
          li.className = "pl-2 leading-relaxed";
          li.textContent = step.step || "";
          stepsList.appendChild(li);
        });
      });
    }

    if (stepCount === 0) {
      const li = document.createElement("li");
      li.className = "list-none pr-4 italic text-gray-400";
      li.textContent = "Detailed preparation steps not available. Please visit the original site below.";
      stepsList.appendChild(li);
    }
  }

  // Configure original reading link
  const originalLink = document.getElementById("modal-view-original") as HTMLAnchorElement | null;
  if (originalLink) {
    const url = recipe.spoonacularSourceUrl || recipe.sourceUrl || "";
    const isMock = !url || url.includes("example.com") || url === "#";
    const isCustom = typeof recipe.id === "string";
    if (isMock || isCustom) {
      originalLink.classList.add("hidden");
    } else {
      originalLink.classList.remove("hidden");
      originalLink.href = url;
    }
  }

  // Favorite button inside modal
  const favBtn = document.getElementById("modal-fav-btn");
  if (favBtn) {
    const isFav = LocalFavorites.some(f => f.id === recipe.id);
    favBtn.className = `inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border text-xs font-semibold transition cursor-pointer ${
      isFav 
        ? "border-amber-300 bg-amber-100 text-amber-950 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/40" 
        : "border-slate-200 bg-white text-slate-700 hover:bg-amber-50 hover:text-amber-950 hover:border-amber-300 dark:bg-slate-800 dark:text-slate-350 dark:border-slate-700 dark:hover:bg-amber-950/20 dark:hover:text-amber-200"
    }`;
    favBtn.innerHTML = `
      <svg class="w-4 h-4 ${isFav ? 'fill-amber-500 text-amber-500' : 'text-gray-400'}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      ${isFav ? "My Favorite Recipe" : "Add to Favorites"}
    `;

    // Overwrite onClick listener safely
    favBtn.onclick = (e) => {
      e.preventDefault();
      toggleFavorite(recipe);
      // close modal and show updated list
      modal.classList.add("hidden");
    };
  }

  // Unhide
  modal.classList.remove("hidden");
}

/**
 * Update the active badge count display next to the Filters button
 */
function updateActiveFiltersBadgeCount(): void {
  const filterTime = document.getElementById("filter-time") as HTMLInputElement | null;
  const filterTimeAround1h = document.getElementById("filter-time-around1h") as HTMLInputElement | null;
  const filterTime2h = document.getElementById("filter-time-2h") as HTMLInputElement | null;
  const filterAirfryer = document.getElementById("filter-airfryer") as HTMLInputElement | null;
  const filterOvenMethod = document.getElementById("filter-oven-method") as HTMLInputElement | null;
  const filterStovetop = document.getElementById("filter-stovetop") as HTMLInputElement | null;
  const filterSlowCooker = document.getElementById("filter-slow-cooker") as HTMLInputElement | null;
  const activeFiltersCount = document.getElementById("active-filters-count");

  if (!activeFiltersCount) return;

  let activeCount = 0;
  if (filterTime?.checked) activeCount++;
  if (filterTimeAround1h?.checked) activeCount++;
  if (filterTime2h?.checked) activeCount++;
  if (filterAirfryer?.checked) activeCount++;
  if (filterOvenMethod?.checked) activeCount++;
  if (filterStovetop?.checked) activeCount++;
  if (filterSlowCooker?.checked) activeCount++;

  if (activeCount > 0) {
    activeFiltersCount.textContent = String(activeCount);
    activeFiltersCount.classList.remove("hidden");
    activeFiltersCount.classList.add("flex");
  } else {
    activeFiltersCount.classList.add("hidden");
    activeFiltersCount.classList.remove("flex");
  }
}

