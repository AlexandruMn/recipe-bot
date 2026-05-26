import { setupLayout, showToast, runSubstitutionEngine, renderCookingMethodBadges, getTimeCategoryBadgeHtml, renderRecipeImageThumbnail } from "./common";

// Interface definitions
interface MealScheduleItem {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  recipeId: string;
  recipeTitle: string;
  recipeImage?: string;
}

// Global state collections
let FavoriteList: any[] = [];
let PublishedList: any[] = [];
let ScheduledMeals: MealScheduleItem[] = [];
let PantryList: string[] = [];

// Tab management state
type ActiveTab = "published" | "favorites" | "calendar";
let currentRecipesTab: ActiveTab = "published";

// Calendar state coordinates
let calendarDisplayDate = new Date();
let selectedScheduleDateStr = "";
let calendarSelectionMode: 'favorites' | 'custom' = 'favorites';

document.addEventListener("DOMContentLoaded", () => {
  // Bind standard header & footer context
  setupLayout("favorites");

  // Load persistence structures
  loadPantryData();
  loadAllHubData();

  // Initialize form default dates to today
  initDefaultScheduleDate();

  // Core Render routines
  refreshTabContent();
  refreshBadges();

  // Bind Top Tab Buttons
  bindTabTriggers();

  // Bind Custom and Favorites Action triggers
  bindTabFeatureActions();

  // Modal close handlers
  bindModalCloseTriggers();
});

/**
 * Access storage
 */
function loadPantryData(): void {
  try {
    const raw = localStorage.getItem("pantry_list");
    PantryList = raw ? JSON.parse(raw) : [];
  } catch {
    PantryList = [];
  }
}

function loadAllHubData(): void {
  // 1. Favorites list
  try {
    const rawFavs = localStorage.getItem("favorite_recipes");
    FavoriteList = rawFavs ? JSON.parse(rawFavs) : [];
  } catch {
    FavoriteList = [];
  }

  // 2. Custom published recipes
  try {
    const rawPubs = localStorage.getItem("custom_published_recipes");
    PublishedList = rawPubs ? JSON.parse(rawPubs) : [];
  } catch {
    PublishedList = [];
  }

  // 3. Calendar planned meals
  try {
    const rawCal = localStorage.getItem("meal_calendar");
    ScheduledMeals = rawCal ? JSON.parse(rawCal) : [];
  } catch {
    ScheduledMeals = [];
  }
}

function saveFavoritesData(): void {
  try {
    localStorage.setItem("favorite_recipes", JSON.stringify(FavoriteList));
  } catch (err) {
    console.error("Failed to persist favorites:", err);
  }
}

function savePublishedData(): void {
  try {
    localStorage.setItem("custom_published_recipes", JSON.stringify(PublishedList));
  } catch (err) {
    console.error("Failed to persist custom published list:", err);
  }
}

function saveScheduleData(): void {
  try {
    localStorage.setItem("meal_calendar", JSON.stringify(ScheduledMeals));
  } catch (err) {
    console.error("Failed to persist calendar:", err);
  }
}

/**
 * Refresh badge counts on tabs
 */
function refreshBadges(): void {
  const pubCountB = document.getElementById("pub-count-badge");
  const favCountB = document.getElementById("fav-count-badge");

  if (pubCountB) pubCountB.textContent = String(PublishedList.length);
  if (favCountB) favCountB.textContent = String(FavoriteList.length);
}

/**
 * Tab Switching Handler
 */
function bindTabTriggers(): void {
  const btnPub = document.getElementById("btn-tab-published");
  const btnFav = document.getElementById("btn-tab-favorites");
  const btnCal = document.getElementById("btn-tab-calendar");

  const secPub = document.getElementById("content-tab-published");
  const secFav = document.getElementById("content-tab-favorites");
  const secCal = document.getElementById("content-tab-calendar");

  const tabsArray = [
    { btn: btnPub, sec: secPub, key: "published" as ActiveTab },
    { btn: btnFav, sec: secFav, key: "favorites" as ActiveTab },
    { btn: btnCal, sec: secCal, key: "calendar" as ActiveTab }
  ];

  const activeBtnClasses = "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-150 transform hover:scale-102 cursor-pointer select-none border border-slate-900 bg-slate-900 text-white dark:border-amber-400 dark:bg-amber-400 dark:text-slate-950 shadow-[2px_2px_0px_0px_#0f172a] dark:shadow-[2px_2px_0px_0px_#ecbc82] flex items-center gap-2 active:scale-95";
  const inactiveBtnClasses = "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-150 transform hover:scale-102 cursor-pointer select-none border border-slate-200 text-slate-500 hover:text-slate-850 bg-white dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-amber-100 flex items-center gap-2 active:scale-95";

  tabsArray.forEach((item) => {
    if (!item.btn) return;
    item.btn.addEventListener("click", () => {
      currentRecipesTab = item.key;

      // Unify tab buttons visual style
      tabsArray.forEach((tab) => {
        if (tab.btn) {
          tab.btn.className = (tab.key === currentRecipesTab) ? activeBtnClasses : inactiveBtnClasses;
        }
        if (tab.sec) {
          if (tab.key === currentRecipesTab) {
            tab.sec.classList.remove("hidden");
          } else {
            tab.sec.classList.add("hidden");
          }
        }
      });

      // Rerender selected tab content cleanly
      refreshTabContent();
    });
  });
}

/**
 * Distribute layout views based on active tab
 */
function refreshTabContent(): void {
  if (currentRecipesTab === "published") {
    renderPublishedGrid();
  } else if (currentRecipesTab === "favorites") {
    renderFavoritesGrid();
  } else if (currentRecipesTab === "calendar") {
    populateScheduleDropdown();
    renderCalendar();
  }
}

/**
 * Group Event bindings inside specific tabs
 */
function bindTabFeatureActions(): void {
  // Clear favorites trigger
  const clearBtn = document.getElementById("clear-favorites-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", handleClearAllFavorites);
  }

  // Calendar Segment Controls
  const scheduleForm = document.getElementById("schedule-form") as HTMLFormElement | null;
  if (scheduleForm) {
    scheduleForm.addEventListener("submit", handleScheduleSubmit);
  }

  // Scheduler Mode Sub-Tabs (Favorites Selection vs writing it custom)
  const tabFav = document.getElementById("tab-fav-recipes");
  const tabCustom = document.getElementById("tab-custom-recipe");
  const favoritesBox = document.getElementById("recipe-favorites-select-box");
  const customBox = document.getElementById("recipe-custom-inputs-box");

  if (tabFav && tabCustom && favoritesBox && customBox) {
    tabFav.addEventListener("click", () => {
      calendarSelectionMode = 'favorites';
      tabFav.className = "py-1.5 rounded-md text-center bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-3xs cursor-pointer font-bold select-none";
      tabCustom.className = "py-1.5 rounded-md text-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-amber-100 transition cursor-pointer font-medium select-none";
      favoritesBox.classList.remove("hidden");
      customBox.classList.add("hidden");
    });

    tabCustom.addEventListener("click", () => {
      calendarSelectionMode = 'custom';
      tabCustom.className = "py-1.5 rounded-md text-center bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-3xs cursor-pointer font-bold select-none";
      tabFav.className = "py-1.5 rounded-md text-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-amber-100 transition cursor-pointer font-medium select-none";
      customBox.classList.remove("hidden");
      favoritesBox.classList.add("hidden");
    });
  }

  // Calendar navigating controls
  const prevBtn = document.getElementById("cal-prev-month");
  const nextBtn = document.getElementById("cal-next-month");
  const todayBtn = document.getElementById("cal-today-btn");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      calendarDisplayDate.setMonth(calendarDisplayDate.getMonth() - 1);
      renderCalendar();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      calendarDisplayDate.setMonth(calendarDisplayDate.getMonth() + 1);
      renderCalendar();
    });
  }

  if (todayBtn) {
    todayBtn.addEventListener("click", () => {
      calendarDisplayDate = new Date();
      renderCalendar();
    });
  }

  // Agenda Close control
  const agendaCloseBtn = document.getElementById("agenda-close-btn");
  if (agendaCloseBtn) {
    agendaCloseBtn.addEventListener("click", () => {
      const card = document.getElementById("agenda-manager-card");
      if (card) card.classList.add("hidden");
    });
  }
}

/**
 * View 1: Render Grid of Custom published recipes
 */
function renderPublishedGrid(): void {
  const grid = document.getElementById("published-grid");
  const empty = document.getElementById("published-empty");

  if (!grid || !empty) return;

  grid.innerHTML = "";

  if (PublishedList.length === 0) {
    grid.classList.add("hidden");
    empty.classList.remove("hidden");
    return;
  }

  grid.classList.remove("hidden");
  empty.classList.add("hidden");

  PublishedList.forEach((recipe) => {
    const card = document.createElement("div");
    card.className = "ink-stamped-card bg-white dark:bg-slate-900 rounded-2xl border border-slate-205 dark:border-slate-800 overflow-hidden flex flex-col group h-full relative cursor-pointer hover:border-slate-950 dark:hover:border-amber-300 transition duration-150";

    const recipeIngredients = (recipe.extendedIngredients || []).map((ing: any) => ing.name || "");
    const subResult = runSubstitutionEngine(recipeIngredients, PantryList);

    let subTagHtml = "";
    if (subResult.hasSubstitutions) {
      subTagHtml = `
        <div class="absolute top-3 left-3 z-10 bg-amber-500 text-white text-[10px] px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1 font-bold tracking-wider uppercase pointer-events-none">
          ⚠️ Substitutions Ready
        </div>
      `;
    }

    // Default premium fallback image
    const finalImage = recipe.image || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80";

    card.innerHTML = `
      <!-- Thumbnail -->
      <div class="relative h-48 bg-slate-100 dark:bg-slate-950 shrink-0 overflow-hidden">
        ${subTagHtml}
        ${renderRecipeImageThumbnail(recipe)}
        <!-- Deletion action -->
        <button 
          class="delete-pub-raw-btn absolute top-3 right-3 p-2 bg-white/95 text-red-500 hover:text-red-700 hover:bg-white active:scale-95 transition rounded-full shadow-xs cursor-pointer z-10"
          aria-label="Delete recipe permanently"
          title="Delete published recipe"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <!-- Content text -->
      <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div class="space-y-2">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="inline-flex items-center text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-350 border border-emerald-100 dark:border-emerald-950 font-mono">
              🍳 Self Published
            </span>
            <span class="inline-flex items-center text-[9px] font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-350 border border-slate-200 dark:border-slate-800 font-mono">
              Ready in ${recipe.readyInMinutes || 30}m
            </span>
            ${renderCookingMethodBadges(recipe)}
          </div>

          <h3 class="font-display font-bold text-slate-850 dark:text-amber-100 line-clamp-2 leading-snug text-sm group-hover:text-slate-950 dark:group-hover:text-white transition">
            ${recipe.title}
          </h3>

          <p class="text-[11px] text-slate-400 dark:text-slate-450 line-clamp-2 leading-relaxed">
            ${recipe.summary ? recipe.summary.replace(/<[^>]*>/g, '') : 'Original self-authored masterpiece. Click anywhere to read instructions.'}
          </p>
        </div>

        <div class="pt-3 border-t border-slate-100 dark:border-slate-800/60 border-dashed flex items-center justify-between">
          <span class="text-[9px] text-slate-400 font-mono select-none">CODE: ${recipe.id}</span>
          <span class="text-[11px] font-black text-slate-800 dark:text-amber-200 group-hover:underline flex items-center gap-1">
            Read Instruction ➔
          </span>
        </div>
      </div>
    `;

    // Intercept deletion button
    card.querySelector(".delete-pub-raw-btn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      handleDeletePublishedRecipe(recipe.id, recipe.title);
    });

    // Tap cards to read full custom specs
    card.addEventListener("click", () => {
      openDetailsModal(recipe, subResult, true); // true indicates a self published recipe layout details
    });

    grid.appendChild(card);
  });
}

function handleDeletePublishedRecipe(id: number, title: string): void {
  if (confirm(`Are you sure you want to permanently delete your custom recipe "${title}"? This cannot be undone.`)) {
    PublishedList = PublishedList.filter(r => r.id !== id);
    savePublishedData();
    refreshBadges();
    renderPublishedGrid();

    // Clean up calendar scheduled meals matching this id
    const beforeCount = ScheduledMeals.length;
    ScheduledMeals = ScheduledMeals.filter(m => m.recipeId !== String(id));
    if (ScheduledMeals.length !== beforeCount) {
      saveScheduleData();
    }

    showToast(`Deleted published recipe "${title}".`, "warning");
  }
}

/**
 * View 2: Render Grid of Saved Favorites
 */
function renderFavoritesGrid(): void {
  const grid = document.getElementById("favorites-grid");
  const empty = document.getElementById("favorites-empty");
  const clearBtn = document.getElementById("clear-favorites-btn");

  if (!grid || !empty) return;

  grid.innerHTML = "";

  if (clearBtn) {
    if (FavoriteList.length > 0) {
      clearBtn.classList.remove("hidden");
    } else {
      clearBtn.classList.add("hidden");
    }
  }

  if (FavoriteList.length === 0) {
    grid.classList.add("hidden");
    empty.classList.remove("hidden");
    return;
  }

  grid.classList.remove("hidden");
  empty.classList.add("hidden");

  FavoriteList.forEach((recipe, idx) => {
    // Run substitution checks
    const recipeIngredients = (recipe.extendedIngredients || []).map((ing: any) => ing.name || "");
    const subResult = runSubstitutionEngine(recipeIngredients, PantryList);

    const card = document.createElement("div");
    card.className = "bg-white dark:bg-slate-900 rounded-2xl border border-slate-205 dark:border-slate-800 overflow-hidden flex flex-col group h-full relative cursor-pointer hover:border-slate-950 dark:hover:border-amber-300 transition duration-150";

    let subTagHtml = "";
    if (subResult.hasSubstitutions) {
      subTagHtml = `
        <div class="absolute top-3 left-3 z-10 bg-amber-500 text-white text-[10px] px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1 font-bold tracking-wider uppercase pointer-events-none">
          ⚠️ Substitutions Ready
        </div>
      `;
    }

    card.innerHTML = `
      <!-- Thumbnail -->
      <div class="relative h-48 bg-slate-100 dark:bg-slate-950 shrink-0 overflow-hidden">
        ${subTagHtml}
        ${renderRecipeImageThumbnail(recipe)}
        <!-- Heart Toggle -->
        <button 
          class="fav-toggle-btn absolute top-3 right-3 p-2 bg-white/95 text-red-500 hover:text-red-700 hover:bg-white active:scale-95 transition shadow-xs rounded-full cursor-pointer z-10"
          aria-label="Remove from favorites list"
        >
          <svg class="w-4 h-4 fill-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <!-- Content text -->
      <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div class="space-y-2">
          <div class="flex items-center gap-1.5 flex-wrap">
            ${getTimeCategoryBadgeHtml(recipe)}
            <span class="inline-flex items-center text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-slate-150 text-slate-600 dark:bg-slate-800 dark:text-slate-350 dark:border-slate-800 border border-slate-200 dark:border-slate-805 font-mono">
              Ready in ${recipe.readyInMinutes || 30}m
            </span>
            ${renderCookingMethodBadges(recipe)}
          </div>

          <h3 class="font-display font-bold text-slate-850 dark:text-amber-100 line-clamp-2 leading-snug text-sm group-hover:text-slate-950 dark:group-hover:text-white transition">
            ${recipe.title}
          </h3>

          <p class="text-xs text-slate-400 dark:text-slate-455 line-clamp-2 leading-relaxed">
            ${recipe.summary ? recipe.summary.replace(/<[^>]*>/g, '') : 'Ready to cook. Click anywhere to read recipe details.'}
          </p>
        </div>

        <div class="pt-3 border-t border-slate-205 dark:border-slate-800/60 border-dashed flex items-center justify-between">
          <span class="text-[10px] text-slate-400 font-mono tracking-wider">ID: ${recipe.id}</span>
          <span class="text-xs font-bold text-slate-800 dark:text-amber-150 group-hover:underline flex items-center gap-1">
            Read Details ➔
          </span>
        </div>
      </div>
    `;

    // Intercept favorites click toggle
    card.querySelector(".fav-toggle-btn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      removeFavorite(recipe.id, recipe.title);
    });

    // Single card click modal drawer
    card.addEventListener("click", () => {
      openDetailsModal(recipe, subResult, false);
    });

    grid.appendChild(card);
  });
}

/**
 * Remove an item from Favorites Array list
 */
function removeFavorite(id: string | number, title: string): void {
  FavoriteList = FavoriteList.filter(f => f.id !== id);
  saveFavoritesData();
  refreshBadges();
  renderFavoritesGrid();
  showToast(`Removed "${title}" from favorites collection.`, "warning", 2000);
}

/**
 * Empty Favorites list handler
 */
function handleClearAllFavorites(): void {
  if (confirm("Are you sure you want to completely delete all favorited recipes?")) {
    FavoriteList = [];
    saveFavoritesData();
    refreshBadges();
    renderFavoritesGrid();
    showToast("Favorites collection completely cleared.", "success");
  }
}

/**
 * View 3: Setup default target dates for Calendar Scheduler
 */
function initDefaultScheduleDate(): void {
  const dateInput = document.getElementById("schedule-date") as HTMLInputElement | null;
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${yyyy}-${mm}-${dd}`;
    selectedScheduleDateStr = dateInput.value;
  }
}

/**
 * Load recipes options inside scheduling dropdown
 */
function populateScheduleDropdown(): void {
  const select = document.getElementById("favorites-dropdown") as HTMLSelectElement | null;
  if (!select) return;

  select.innerHTML = `<option value="" disabled selected>-- Choose from recipes --</option>`;

  // 1. Group Published Recipes options (if any)
  if (PublishedList.length > 0) {
    const headerOpt = document.createElement("option");
    headerOpt.disabled = true;
    headerOpt.textContent = "🍳 YOUR PUBLISHED RECIPES:";
    select.appendChild(headerOpt);

    PublishedList.forEach((recipe) => {
      const opt = document.createElement("option");
      opt.value = `custom_${recipe.id}`;
      opt.textContent = `🍳 ${recipe.title}`;
      select.appendChild(opt);
    });
  }

  // Divider
  if (PublishedList.length > 0 && FavoriteList.length > 0) {
    const divOpt = document.createElement("option");
    divOpt.disabled = true;
    divOpt.textContent = "──────────────────────────";
    select.appendChild(divOpt);
  }

  // 2. Group Favorite Recipes options (if any)
  if (FavoriteList.length > 0) {
    const headerOpt = document.createElement("option");
    headerOpt.disabled = true;
    headerOpt.textContent = "⭐ SAVED BOOKMARKED FAVORITES:";
    select.appendChild(headerOpt);

    FavoriteList.forEach((recipe, idx) => {
      const opt = document.createElement("option");
      opt.value = `fav_${idx}`;
      opt.textContent = `⭐ ${recipe.title} (ID: ${recipe.id})`;
      select.appendChild(opt);
    });
  }

  if (PublishedList.length === 0 && FavoriteList.length === 0) {
    const opt = document.createElement("option");
    opt.disabled = true;
    opt.textContent = "No recipes authored or favorited yet.";
    select.appendChild(opt);
  }
}

/**
 * Render visual month element blocks
 */
function renderCalendar(): void {
  const grid = document.getElementById("calendar-grid-cells");
  const header = document.getElementById("calendar-month-year");

  if (!grid || !header) return;

  grid.innerHTML = "";

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const year = calendarDisplayDate.getFullYear();
  const monthIdx = calendarDisplayDate.getMonth();

  header.textContent = `${monthNames[monthIdx]} ${year}`;

  const firstDay = new Date(year, monthIdx, 1).getDay();
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, monthIdx, 0).getDate();

  const todayStr = getFormattedDateString(new Date());

  // Padding preceding cells
  for (let i = firstDay - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const paddingCell = createDayCellElement(dayNum, true, year, monthIdx - 1);
    grid.appendChild(paddingCell);
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const cell = createDayCellElement(d, false, year, monthIdx, dateStr === todayStr);
    grid.appendChild(cell);
  }

  // Padding succeeding cells
  const totalCellsWritten = firstDay + daysInMonth;
  const remainingCellsNeeded = totalCellsWritten % 7 === 0 ? 0 : 7 - (totalCellsWritten % 7);

  for (let n = 1; n <= remainingCellsNeeded; n++) {
    const paddingCell = createDayCellElement(n, true, year, monthIdx + 1);
    grid.appendChild(paddingCell);
  }
}

function getFormattedDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Day Grid Unit Element Generator
 */
function createDayCellElement(day: number, isPadding: boolean, year: number, monthIdx: number, isToday = false): HTMLElement {
  const cell = document.createElement("div");
  cell.className = "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl p-1.5 sm:p-2 min-h-[5.5rem] flex flex-col justify-between transition hover:shadow-3xs cursor-pointer select-none pb-2.5";

  if (isPadding) {
    cell.classList.add("opacity-40", "bg-slate-50/50", "dark:bg-slate-950/20");
  }

  const dateBadge = document.createElement("span");
  dateBadge.className = "text-xs font-bold font-mono h-6 w-6 inline-flex items-center justify-center rounded-lg leading-none select-none text-slate-800 dark:text-slate-200";
  dateBadge.textContent = String(day);

  if (isToday) {
    dateBadge.className = "text-xs font-black font-mono h-6 w-6 inline-flex items-center justify-center rounded-lg leading-none select-none bg-slate-950 dark:bg-amber-400 text-white dark:text-slate-950 shadow-xs";
    cell.classList.add("border-amber-400", "bg-amber-500/5", "dark:border-amber-400/20");
  }

  cell.appendChild(dateBadge);

  const cellDate = new Date(year, monthIdx, day);
  const cellDateStr = getFormattedDateString(cellDate);

  const dayMeals = ScheduledMeals.filter(m => m.date === cellDateStr);

  const tagsWrapper = document.createElement("div");
  tagsWrapper.className = "space-y-1 mt-2.5 flex-1 flex flex-col justify-end w-full";

  dayMeals.forEach(meal => {
    const tag = document.createElement("div");
    
    let colorClasses = "bg-amber-100/70 text-amber-950 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/40";
    let labelIcon = "🥞";
    
    if (meal.mealType === 'lunch') {
      colorClasses = "bg-sky-55 text-sky-850 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900/40";
      labelIcon = "🌯";
    } else if (meal.mealType === 'dinner') {
      colorClasses = "bg-indigo-55 text-indigo-850 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/40";
      labelIcon = "🍝";
    }

    tag.className = `text-[8px] sm:text-[9px] font-bold px-1 py-0.5 rounded border leading-tight truncate flex items-center gap-0.5 ${colorClasses}`;
    tag.textContent = `${labelIcon} ${meal.recipeTitle}`;
    tagsWrapper.appendChild(tag);
  });

  cell.appendChild(tagsWrapper);

  // Click on Day to trigger agenda
  cell.addEventListener("click", () => {
    openAgendaManager(cellDateStr);
  });

  return cell;
}

/**
 * Drawer detailing planner schedule meals for a date
 */
function openAgendaManager(dateStr: string): void {
  const card = document.getElementById("agenda-manager-card");
  const label = document.getElementById("agenda-selected-date-label");
  const list = document.getElementById("agenda-list");

  if (!card || !label || !list) return;

  selectedScheduleDateStr = dateStr;
  label.textContent = dateStr;

  list.innerHTML = "";

  const dayMeals = ScheduledMeals.filter(m => m.date === dateStr);

  if (dayMeals.length === 0) {
    list.innerHTML = `
      <div class="text-center py-6 text-slate-400 dark:text-slate-500 text-xs italic">
        🥞 No plans active for this date. Use the Scheduler widget on the left to add meals.
      </div>
    `;
  } else {
    dayMeals.forEach(meal => {
      const row = document.createElement("div");
      row.className = "flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-850 text-xs sm:text-sm";
      
      let mealIcon = "🥞";
      let typeLabel = "Breakfast";
      let badgeColor = "bg-amber-100 text-amber-950 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/40";
      
      if (meal.mealType === 'lunch') {
        mealIcon = "🌯";
        typeLabel = "Lunch";
        badgeColor = "bg-sky-100 text-sky-850 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900/40";
      } else if (meal.mealType === 'dinner') {
        mealIcon = "🍝";
        typeLabel = "Dinner";
        badgeColor = "bg-indigo-100 text-indigo-855 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/40";
      }

      row.innerHTML = `
        <div class="flex items-center gap-3">
          <span class="text-2xl">${mealIcon}</span>
          <div>
            <span class="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md ${badgeColor}">${typeLabel}</span>
            <h4 class="font-bold text-slate-800 dark:text-slate-200 mt-1">${meal.recipeTitle}</h4>
            <span class="font-mono text-[9px] text-slate-400 dark:text-slate-500">Scheduled ID: ${meal.recipeId || 'Manual'}</span>
          </div>
        </div>
        
        <button class="delete-agenda-item-btn p-2 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 rounded-lg text-slate-400 dark:text-slate-500 transition cursor-pointer select-none" data-id="${meal.id}">
          <svg class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      `;

      row.querySelector(".delete-agenda-item-btn")?.addEventListener("click", () => {
        deleteAgendaMeal(meal.id);
      });

      list.appendChild(row);
    });
  }

  // Auto-sync form inputs for convenience
  const dateInput = document.getElementById("schedule-date") as HTMLInputElement | null;
  if (dateInput) {
    dateInput.value = dateStr;
  }

  card.classList.remove("hidden");
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function deleteAgendaMeal(id: string): void {
  ScheduledMeals = ScheduledMeals.filter(m => m.id !== id);
  saveScheduleData();
  renderCalendar();
  openAgendaManager(selectedScheduleDateStr);
  showToast("Meal removed from schedule board.", "success");
}

/**
 * Handle form schedules submissions
 */
function handleScheduleSubmit(e: Event): void {
  e.preventDefault();

  const dateInput = document.getElementById("schedule-date") as HTMLInputElement | null;
  const mealTypeSelect = document.getElementById("schedule-meal-type") as HTMLSelectElement | null;

  if (!dateInput || !mealTypeSelect) return;

  const dateValue = dateInput.value;
  const mealTypeValue = mealTypeSelect.value as 'breakfast' | 'lunch' | 'dinner';

  if (!dateValue || !mealTypeValue) return;

  let recipeTitle = "";
  let recipeId = "";
  let recipeImage = "";

  if (calendarSelectionMode === "favorites") {
    const dropdown = document.getElementById("favorites-dropdown") as HTMLSelectElement | null;
    if (!dropdown || !dropdown.value) {
      showToast("Please select a recipe option first.", "warning");
      return;
    }

    if (dropdown.value.startsWith("custom_")) {
      // 1. User Published recipe mapping
      const targetIdStr = dropdown.value.replace("custom_", "");
      const match = PublishedList.find((r) => String(r.id) === targetIdStr);
      if (match) {
        recipeTitle = match.title;
        recipeId = String(match.id);
        recipeImage = match.image || "";
      } else {
        showToast("Selected custom recipe no longer template.", "error");
        return;
      }
    } else if (dropdown.value.startsWith("fav_")) {
      // 2. Favorite bookmark mapping
      const favIdx = Number(dropdown.value.replace("fav_", ""));
      const match = FavoriteList[favIdx];
      if (match) {
        recipeTitle = match.title;
        recipeId = String(match.id);
        recipeImage = match.image || "";
      } else {
        showToast("Selected favorited item is invalid.", "error");
        return;
      }
    } else {
      showToast("Selected reference is not structured.", "error");
      return;
    }
  } else {
    // Custom recipe mode
    const titleInput = document.getElementById("custom-recipe-title") as HTMLInputElement | null;
    const idInput = document.getElementById("custom-recipe-id") as HTMLInputElement | null;

    if (!titleInput || !titleInput.value.trim()) {
      showToast("Recipe Title text field is required.", "warning");
      return;
    }

    recipeTitle = titleInput.value.trim();
    recipeId = idInput && idInput.value.trim() ? idInput.value.trim() : `direct_${Date.now()}`;
    recipeImage = "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80";
  }

  // Merge check
  const duplicateIndex = ScheduledMeals.findIndex(m => m.date === dateValue && m.mealType === mealTypeValue);

  const newItem: MealScheduleItem = {
    id: `plan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    date: dateValue,
    mealType: mealTypeValue,
    recipeId,
    recipeTitle,
    recipeImage
  };

  if (duplicateIndex !== -1) {
    const backupTitle = ScheduledMeals[duplicateIndex].recipeTitle;
    ScheduledMeals[duplicateIndex] = newItem;
    showToast(`Existing ${mealTypeValue} schedule updated from "${backupTitle}" to "${recipeTitle}"!`, "success", 4000);
  } else {
    ScheduledMeals.push(newItem);
    showToast(`"${recipeTitle}" scheduled successfully!`, "success", 2500);
  }

  saveScheduleData();
  renderCalendar();

  // Refresh active manager if applicable
  const agendaCard = document.getElementById("agenda-manager-card");
  if (agendaCard && !agendaCard.classList.contains("hidden") && selectedScheduleDateStr === dateValue) {
    openAgendaManager(dateValue);
  }

  // Reset custom form inputs
  const customTitle = document.getElementById("custom-recipe-title") as HTMLInputElement | null;
  const customId = document.getElementById("custom-recipe-id") as HTMLInputElement | null;
  const drop = document.getElementById("favorites-dropdown") as HTMLSelectElement | null;

  if (customTitle) customTitle.value = "";
  if (customId) customId.value = "";
  if (drop) drop.selectedIndex = 0;
}

/**
 * Handle Modal popup drawing and detailing triggers
 */
function bindModalCloseTriggers(): void {
  const modal = document.getElementById("recipe-modal");
  const closeBtn = document.getElementById("modal-close-btn");

  if (modal && closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    });
  }
}

/**
 * Open Modal detail box
 */
function openDetailsModal(recipe: any, subResult: any, isSelfPublished: boolean = false): void {
  const modal = document.getElementById("recipe-modal");
  if (!modal) return;

  // Header Details
  const imgElement = document.getElementById("modal-img") as HTMLImageElement | null;
  if (imgElement) {
    imgElement.src = recipe.image || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80";
    imgElement.alt = recipe.title;
  }

  const titleElement = document.getElementById("modal-title");
  if (titleElement) titleElement.textContent = recipe.title;

  const prepElement = document.getElementById("modal-prep");
  if (prepElement) prepElement.textContent = `⏰ Ready in ${recipe.readyInMinutes || 30}m`;

  const servingsElement = document.getElementById("modal-servings");
  if (servingsElement) servingsElement.textContent = `🥣 ${recipe.servings || 4} Servings`;

  const descElement = document.getElementById("modal-desc");
  if (descElement) {
    descElement.innerHTML = recipe.summary || "Original authored recipe spec. Fresh ingredients scheduled locally.";
  }

  // Substitution indicator list
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
    const ingredientsArray = recipe.extendedIngredients || [];
    
    if (ingredientsArray.length === 0) {
      ingList.innerHTML = `<li class="italic text-slate-400">No ingredients specified yet.</li>`;
    } else {
      ingredientsArray.forEach((ing: any) => {
        const li = document.createElement("li");
        li.className = "flex justify-between items-center py-1.5 border-b border-dashed border-slate-100 dark:border-slate-800/80";
        const amtValue = ing.amount || "";
        const unitValue = ing.unit || "";
        const amountStr = `${amtValue} ${unitValue}`.trim() || "1 unit";
        
        li.innerHTML = `
          <span class="font-medium text-slate-800 dark:text-slate-205">${ing.originalName || ing.name}</span>
          <span class="font-mono text-[9px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-bold">${amountStr}</span>
        `;
        ingList.appendChild(li);
      });
    }
  }

  // Instruction steps lists
  const stepsList = document.getElementById("modal-steps-list");
  if (stepsList) {
    stepsList.innerHTML = "";
    
    let stepCount = 0;
    
    if (recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0) {
      recipe.analyzedInstructions.forEach((inst: any) => {
        (inst.steps || []).forEach((step: any) => {
          stepCount++;
          const li = document.createElement("li");
          li.className = "pl-2 leading-relaxed text-slate-700 dark:text-slate-300";
          li.textContent = step.step || "";
          stepsList.appendChild(li);
        });
      });
    }

    if (stepCount === 0) {
      const li = document.createElement("li");
      li.className = "list-none pr-4 italic text-slate-400 text-center py-4";
      li.textContent = "No specific instructions specified.";
      stepsList.appendChild(li);
    }
  }

  // Setup view-original website link
  const originalLink = document.getElementById("modal-view-original") as HTMLAnchorElement | null;
  if (originalLink) {
    const url = recipe.spoonacularSourceUrl || recipe.sourceUrl || "";
    const isMock = !url || url.includes("example.com") || url === "#";
    if (isSelfPublished || isMock) {
      originalLink.classList.add("hidden");
    } else {
      originalLink.classList.remove("hidden");
      originalLink.href = url;
    }
  }

  // Custom visual footer action buttons inside details drawer modal
  const favBtn = document.getElementById("modal-fav-btn");
  if (favBtn) {
    if (isSelfPublished) {
      // Don't show "Favorite removal" trigger inside custom published recipes detail modal
      favBtn.classList.add("hidden");
    } else {
      favBtn.classList.remove("hidden");
      favBtn.onclick = (e) => {
        e.preventDefault();
        removeFavorite(recipe.id, recipe.title);
        modal.classList.add("hidden");
      };
    }
  }

  modal.classList.remove("hidden");
}
