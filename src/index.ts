import { setupLayout, showToast } from "./common";

// Global presets representing Tier 1 and Tier 2 + basic essentials
const POPULAR_PRESETS = [
  "butter",
  "margarine",
  "milk",
  "soy milk",
  "white sugar",
  "brown sugar",
  "sour cream",
  "Greek yogurt",
  "chicken breast",
  "eggs",
  "garlic",
  "onions",
  "olive oil"
];

let PantryList: string[] = [];

/**
 * Initialize page elements and listen to state events
 */
document.addEventListener("DOMContentLoaded", () => {
  setupLayout("pantry");
  loadPantry();
  renderPantry();
  updateLiveGreetings();
});

/**
 * Load items from localStorage
 */
function loadPantry(): void {
  try {
    const rawData = localStorage.getItem("pantry_list");
    if (rawData) {
      PantryList = JSON.parse(rawData);
      // Fallback clean list
      PantryList = PantryList.filter(item => typeof item === "string" && item.trim().length > 0);
    } else {
      PantryList = [];
    }
  } catch (err) {
    console.error("Failed to load pantry_list from localStorage:", err);
    PantryList = [];
  }
}

/**
 * Write to localStorage
 */
function savePantry(): void {
  try {
    // Unique items and tidy casing
    PantryList = Array.from(new Set(PantryList.map(item => item.trim()))).filter(item => item.length > 0);
    localStorage.setItem("pantry_list", JSON.stringify(PantryList));
  } catch (err) {
    console.error("Failed to save pantry_list:", err);
    showToast("Issue persisting pantry data.", "error");
  }
}

/**
 * Render items status overview and clear action on Home Page
 */
function renderPantry(): void {
  const container = document.getElementById("pantry-status-container");
  if (!container) return;

  if (PantryList.length === 0) {
    container.innerHTML = `
      <div id="pantry-empty" class="text-center py-8 px-6 bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center animate-fade-in">
        <span class="block text-3xl mb-2">🧺</span>
        <h3 class="font-extrabold text-sm text-slate-850 dark:text-slate-100">Your pantry is currently empty</h3>
        <p class="text-xs text-slate-750 max-w-sm mt-1 mb-4 leading-relaxed dark:text-slate-305">
          You haven't added any stocked ingredients yet. Open the ingredients pantry to select ingredients or use the presets below.
        </p>
        <a 
          href="ingredients.html" 
          class="ink-stamped-btn bg-slate-800 hover:bg-slate-900 text-white dark:bg-amber-400 dark:hover:bg-amber-500 dark:text-slate-900 text-xs font-bold px-4.5 py-2.5 cursor-pointer"
        >
          🥦 Go to Ingredients Pantry
        </a>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="p-6 bg-slate-100/40 dark:bg-amber-950/10 border border-slate-300 dark:border-amber-700/60 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
        <div class="flex items-center gap-3 text-center sm:text-left">
          <div class="w-11 h-11 rounded-xl bg-slate-850 dark:bg-amber-400 text-white dark:text-slate-900 flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_var(--card-border)] shrink-0 select-none border border-slate-950/10">
            ✅
          </div>
          <div>
            <h3 class="font-display font-black text-base text-slate-900 dark:text-amber-100">Your kitchen is stocked!</h3>
            <p class="text-xs text-slate-850 dark:text-slate-200 mt-0.5 font-medium">
              You currently have <span class="font-black text-slate-900 dark:text-amber-300 font-mono text-xs bg-slate-200/50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-slate-350">${PantryList.length}</span> ingredients ready to cook.
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2.5">
          <button 
            id="clear-pantry-btn" 
            class="ink-stamped-btn px-3.5 py-2 text-xs font-bold text-red-600 dark:text-red-400 dark:hover:text-red-350 bg-red-50/70 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/30 cursor-pointer border-red-200/50 dark:border-red-900/20"
          >
            Clear Pantry
          </button>
          <a 
            href="ingredients.html" 
            class="ink-stamped-btn px-3.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 cursor-pointer"
          >
            Manage Stock
          </a>
        </div>
      </div>
    `;

    // Dynamic bind and wiring of clear button
    const clearBtn = document.getElementById("clear-pantry-btn");
    if (clearBtn) {
      clearBtn.addEventListener("click", handleClearPantry);
    }
  }

  // Re-render presets highlight based on pantry additions
  renderPresets();
  updateLiveGreetings();
}

/**
 * Render real-time customized greetings and culinary substitutions advice
 */
function updateLiveGreetings(): void {
  const container = document.getElementById("live-kitchen-greetings");
  if (!container) return;

  const hrs = new Date().getHours();
  let timeStr = "evening 🌙";
  let greetStr = "Good evening!";
  if (hrs < 12) {
    timeStr = "morning 🌅";
    greetStr = "Good morning!";
  } else if (hrs < 17) {
    timeStr = "afternoon ☀️";
    greetStr = "Good afternoon!";
  }

  // Find a specific tip based on active stocked ingredients
  let tipStr = "";
  const hasGreekYogurt = PantryList.some(item => item.toLowerCase() === "greek yogurt");
  const hasSoyMilk = PantryList.some(item => item.toLowerCase() === "soy milk");
  const hasBrownSugar = PantryList.some(item => item.toLowerCase() === "brown sugar");
  const hasMargarine = PantryList.some(item => item.toLowerCase() === "margarine");

  if (PantryList.length === 0) {
    tipStr = "❖ Stocking Tip: Add some core essentials like Garlic, Onions, and Olive Oil to instantly match standard recipes!";
  } else if (hasGreekYogurt && !PantryList.some(item => item.toLowerCase() === "sour cream")) {
    tipStr = "❖ Chef Suggestion: We noticed you have Greek Yogurt stocked! You can use it as a creamy, high-protein alternative if any recipe calls for sour cream today. ✨";
  } else if (hasSoyMilk && !PantryList.some(item => item.toLowerCase() === "milk")) {
    tipStr = "❖ Chef Suggestion: Soy Milk is stocked! Perfect as a rich plant-based alternative to dairy milk for all baking and pan recipes.";
  } else if (hasBrownSugar && !PantryList.some(item => item.toLowerCase() === "white sugar")) {
    tipStr = "❖ Sweet tip: Hand-picked brown sugar is stocked! Use it as a direct substitute for granulated sugar to add deeper caramel undertones to your meals.";
  } else if (hasMargarine && !PantryList.some(item => item.toLowerCase() === "butter")) {
    tipStr = "❖ Alternate Prep: You have Margarine stocked. A handy dairy-free swap for dynamic skillet or baking requests!";
  } else if (PantryList.length < 5) {
    tipStr = "❖ Ledger advice: Expand your canvas! Stock up on base proteins like eggs, chicken, or salmon to instantly match main-course dishes.";
  } else {
    tipStr = "❖ Daily Pot Stamp: Beautifully stocked pantry! You have a highly versatile array of ingredients ready to lock into matched recipes.";
  }

  container.innerHTML = `
    <div class="flex flex-col gap-1 sm:gap-1.5 leading-relaxed bg-slate-100/40 dark:bg-slate-900/40 border border-slate-250 dark:border-slate-800 p-4 rounded-xl light-greetings-box">
      <div class="flex items-center gap-2 mb-0.5">
        <span class="text-[9px] font-extrabold text-slate-800 dark:text-amber-390 font-mono tracking-wider shrink-0 select-none">◆ LEDGER ACTIVE</span>
        <span class="w-1.5 h-1.5 rounded-full bg-slate-850 dark:bg-amber-400 animate-ping"></span>
      </div>
      <p class="text-xs font-display font-bold text-slate-900 dark:text-slate-200 light-greetings-title">
        ${greetStr} <span class="font-normal text-slate-650 dark:text-slate-400 font-sans italic light-greetings-sub">Ready for some Daily Pot inspiration this ${timeStr}?</span>
      </p>
      <p class="text-[11px] sm:text-xs text-slate-700 dark:text-slate-400 font-sans leading-relaxed mt-1 light-greetings-tip">
        ${tipStr}
      </p>
    </div>
  `;
}

/**
 * Render preset quick tools
 */
function renderPresets(): void {
  const container = document.getElementById("presets-container");
  if (!container) return;

  container.innerHTML = "";

  POPULAR_PRESETS.forEach(preset => {
    const isAdded = PantryList.some(item => item.toLowerCase() === preset.toLowerCase());
    const btn = document.createElement("button");
    btn.type = "button";
    
    if (isAdded) {
      btn.className = "px-3 py-1.5 text-xs font-bold rounded-lg border bg-slate-850 text-white dark:bg-amber-400 dark:text-slate-950 border-slate-950 dark:border-amber-300 cursor-pointer shadow-[2px_2px_0px_0px_var(--card-border)] organic-preset-tag transition duration-200 active:translate-y-0.5 active:shadow-none hover:bg-slate-950 dark:hover:bg-amber-500";
    } else {
      btn.className = "px-3 py-1.5 text-xs font-bold rounded-lg border bg-white dark:bg-slate-900 border-slate-250 dark:border-slate-800 text-slate-755 dark:text-slate-350 cursor-pointer shadow-[2px_2px_0px_0px_var(--card-border)]/15 dark:shadow-[2px_2px_0px_0px_var(--card-border)]/30 hover:border-slate-950 dark:hover:border-slate-600 hover:shadow-[2px_2px_0px_0px_var(--card-border)] organic-preset-tag transition duration-200 active:translate-y-0.5 active:shadow-none";
    }

    // Capitalize
    const displayLabel = preset.charAt(0).toUpperCase() + preset.slice(1);
    btn.innerHTML = `
      <span class="flex items-center gap-1">
        ${isAdded ? "✓ " : "+ "}${displayLabel}
      </span>
    `;

    btn.addEventListener("click", () => {
      if (isAdded) {
        removeIngredient(preset);
      } else {
        addIngredient(preset);
      }
    });

    container.appendChild(btn);
  });
}

/**
 * Add a separate ingredient to the list
 */
function addIngredient(name: string): void {
  const sanitized = name.trim().toLowerCase();
  
  if (!sanitized) return;

  // Prevent duplicate additions
  const alreadyExists = PantryList.some(item => item.toLowerCase() === sanitized);
  if (alreadyExists) {
    showToast(`"${name}" is already stocked in your pantry!`, "warning");
    return;
  }

  PantryList.push(sanitized);
  savePantry();
  renderPantry();
  showToast(`Added "${name}" to pantry!`, "success", 2000);
}

/**
 * Delete a separate ingredient from load state
 */
function removeIngredient(name: string): void {
  const beforeLength = PantryList.length;
  PantryList = PantryList.filter(item => item.toLowerCase() !== name.toLowerCase());
  
  if (PantryList.length < beforeLength) {
    savePantry();
    renderPantry();
  }
}



let confirmTimeout: any = null;
let isConfirmState = false;

/**
 * Clear pantry helper with stateful confirmation (iframe-friendly)
 */
function handleClearPantry(e: Event): void {
  const btn = e.currentTarget as HTMLButtonElement;
  if (!btn) return;

  if (!isConfirmState) {
    isConfirmState = true;
    btn.innerHTML = `⚠️ Confirm Clear?`;
    btn.className = "text-xs font-bold text-red-650 bg-red-100 dark:bg-red-950/40 dark:text-red-300 px-3 py-1.5 rounded-lg border border-red-500/50 transition cursor-pointer";
    
    if (confirmTimeout) clearTimeout(confirmTimeout);
    confirmTimeout = setTimeout(() => {
      resetClearButton(btn);
    }, 4500);
  } else {
    if (confirmTimeout) clearTimeout(confirmTimeout);
    isConfirmState = false;

    PantryList = [];
    savePantry();
    renderPantry();
    showToast("Pantry completely cleared.", "success");
    resetClearButton(btn);
  }
}

function resetClearButton(btn: HTMLButtonElement): void {
  isConfirmState = false;
  btn.textContent = "Clear Pantry";
  btn.className = "text-xs font-bold text-red-500 hover:text-red-700 transition cursor-pointer";
}
