import { setupLayout, showToast } from "./common";

export interface PantryItem {
  name: string;
  label: string;
  emoji: string;
  category: string;
}

export const PANTRY_ITEMS: PantryItem[] = [
  // 1. Vegetables
  { name: "garlic", label: "Garlic", emoji: "🧄", category: "Vegetables" },
  { name: "onions", label: "Onions", emoji: "🧅", category: "Vegetables" },
  { name: "potatoes", label: "Potatoes", emoji: "🥔", category: "Vegetables" },
  { name: "tomatoes", label: "Tomatoes", emoji: "🍅", category: "Vegetables" },
  { name: "carrots", label: "Carrots", emoji: "🥕", category: "Vegetables" },
  { name: "broccoli", label: "Broccoli", emoji: "🥦", category: "Vegetables" },
  { name: "bell peppers", label: "Bell Peppers", emoji: "🫑", category: "Vegetables" },
  { name: "spinach", label: "Spinach", emoji: "🥬", category: "Vegetables" },
  { name: "mushrooms", label: "Mushrooms", emoji: "🍄", category: "Vegetables" },
  { name: "zucchini", label: "Zucchini", emoji: "🥒", category: "Vegetables" },
  { name: "lettuce", label: "Lettuce", emoji: "🥗", category: "Vegetables" },

  // 2. Proteins & Meat
  { name: "chicken breast", label: "Chicken Breast", emoji: "🍗", category: "Proteins & Meats" },
  { name: "beef steak", label: "Beef Steak", emoji: "🥩", category: "Proteins & Meats" },
  { name: "pork chops", label: "Pork Chops", emoji: "🥓", category: "Proteins & Meats" },
  { name: "bacon", label: "Bacon", emoji: "🥓", category: "Proteins & Meats" },
  { name: "eggs", label: "Eggs", emoji: "🥚", category: "Proteins & Meats" },
  { name: "salmon", label: "Salmon Fillet", emoji: "🐟", category: "Proteins & Meats" },
  { name: "tuna", label: "Canned Tuna", emoji: "🐟", category: "Proteins & Meats" },
  { name: "shrimp", label: "Sized Shrimp", emoji: "🍤", category: "Proteins & Meats" },
  { name: "tofu", label: "Organic Tofu", emoji: "🥡", category: "Proteins & Meats" },

  // 3. Dairy & Alternatives
  { name: "butter", label: "Salted Butter", emoji: "🧈", category: "Dairy & Alternatives" },
  { name: "margarine", label: "Margarine spread", emoji: "🧈", category: "Dairy & Alternatives" },
  { name: "milk", label: "Whole Milk", emoji: "🥛", category: "Dairy & Alternatives" },
  { name: "soy milk", label: "Soy Milk", emoji: "🥛", category: "Dairy & Alternatives" },
  { name: "sour cream", label: "Sour Cream", emoji: "🥣", category: "Dairy & Alternatives" },
  { name: "Greek yogurt", label: "Greek Yogurt", emoji: "🍶", category: "Dairy & Alternatives" },
  { name: "cheddar cheese", label: "Cheddar Cheese", emoji: "🧀", category: "Dairy & Alternatives" },
  { name: "parmesan", label: "Grated Parmesan", emoji: "🧀", category: "Dairy & Alternatives" },
  { name: "mozzarella", label: "Mozzarella Balls", emoji: "🧀", category: "Dairy & Alternatives" },

  // 4. Pantry & Grains
  { name: "white sugar", label: "White Sugar", emoji: "🧂", category: "Pantry & Grains" },
  { name: "brown sugar", label: "Brown Sugar", emoji: "🟫", category: "Pantry & Grains" },
  { name: "flour", label: "Baking Flour", emoji: "🌾", category: "Pantry & Grains" },
  { name: "white rice", label: "Standard Rice", emoji: "🍚", category: "Pantry & Grains" },
  { name: "quinoa", label: "Organic Quinoa", emoji: "🌾", category: "Pantry & Grains" },
  { name: "oats", label: "Rolled Oats", emoji: "🥣", category: "Pantry & Grains" },
  { name: "pasta", label: "Wheat Pasta", emoji: "🍝", category: "Pantry & Grains" },
  { name: "bread", label: "Leavened Bread", emoji: "🍞", category: "Pantry & Grains" },

  // 5. Herbs, Spices & Oils
  { name: "olive oil", label: "Olive Oil", emoji: "🫒", category: "Herbs, Spices & Oils" },
  { name: "vegetable oil", label: "Vegetable Oil", emoji: "🧴", category: "Herbs, Spices & Oils" },
  { name: "soy sauce", label: "Soy Sauce", emoji: "🧪", category: "Herbs, Spices & Oils" },
  { name: "vinegar", label: "White Vinegar", emoji: "🍾", category: "Herbs, Spices & Oils" },
  { name: "garlic powder", label: "Garlic Powder", emoji: "🧂", category: "Herbs, Spices & Oils" },
  { name: "paprika", label: "Smoked Paprika", emoji: "🌶️", category: "Herbs, Spices & Oils" },
  { name: "black pepper", label: "Black Pepper", emoji: "🧂", category: "Herbs, Spices & Oils" },
  { name: "oregano", label: "Dried Oregano", emoji: "🌿", category: "Herbs, Spices & Oils" },
  { name: "thyme", label: "Fresh Thyme", emoji: "🌿", category: "Herbs, Spices & Oils" },
  { name: "salt", label: "Iodized Salt", emoji: "🧂", category: "Herbs, Spices & Oils" },

  // 6. Fruits & Nuts
  { name: "lemon", label: "Lemon", emoji: "🍋", category: "Fruits & Nuts" },
  { name: "lime", label: "Lime", emoji: "🍋", category: "Fruits & Nuts" },
  { name: "apples", label: "Apples", emoji: "🍎", category: "Fruits & Nuts" },
  { name: "bananas", label: "Bananas", emoji: "🍌", category: "Fruits & Nuts" },
  { name: "avocado", label: "Avocado", emoji: "🥑", category: "Fruits & Nuts" },
  { name: "almonds", label: "Shelled Almonds", emoji: "🥜", category: "Fruits & Nuts" },
  { name: "honey", label: "Organic Honey", emoji: "🍯", category: "Fruits & Nuts" }
];

let PantryList: string[] = [];
let CurrentFilterKeyword = "";
let CurrentFilterMode: 'all' | 'stocked' = "all";

/**
 * Bootstrap Pantry Ingredients Page
 */
document.addEventListener("DOMContentLoaded", () => {
  // Setup standard navigation frame
  setupLayout("ingredients");
  loadPantryData();
  renderPantryGrid();

  // Search filter typing handler
  const searchInput = document.getElementById("search-pantry") as HTMLInputElement | null;
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      CurrentFilterKeyword = (e.target as HTMLInputElement).value.trim().toLowerCase();
      renderPantryGrid();
    });
  }

  // Categories Toggle Actions
  const btnAll = document.getElementById("btn-filt-all");
  const btnStocked = document.getElementById("btn-filt-stocked");

  if (btnAll && btnStocked) {
    btnAll.addEventListener("click", () => {
      CurrentFilterMode = "all";
      btnAll.className = "px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-amber-400 dark:text-slate-950 text-white transition whitespace-nowrap cursor-pointer";
      btnStocked.className = "px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-900 font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition whitespace-nowrap cursor-pointer flex items-center gap-1";
      renderPantryGrid();
    });

    btnStocked.addEventListener("click", () => {
      CurrentFilterMode = "stocked";
      btnAll.className = "px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-900 font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition whitespace-nowrap cursor-pointer";
      btnStocked.className = "px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-amber-400 dark:text-slate-950 text-white transition whitespace-nowrap cursor-pointer flex items-center gap-1";
      renderPantryGrid();
    });
  }

  // Clear Pantry button registration
  const clearBtn = document.getElementById("clear-pantry-btn") as HTMLButtonElement | null;
  if (clearBtn) {
    clearBtn.addEventListener("click", handleClearPantry);
  }
});

let confirmTimeout: any = null;
let isConfirmState = false;

function handleClearPantry(e: Event): void {
  const btn = e.currentTarget as HTMLButtonElement;
  if (!btn) return;

  if (!isConfirmState) {
    isConfirmState = true;
    btn.innerHTML = `⚠️ Confirm Clear?`;
    btn.className = "px-4 py-2 bg-red-100 text-red-650 rounded-xl font-bold text-xs transition cursor-pointer border border-red-500/50 shadow-xs";
    
    if (confirmTimeout) clearTimeout(confirmTimeout);
    confirmTimeout = setTimeout(() => {
      resetClearButton(btn);
    }, 4500);
  } else {
    if (confirmTimeout) clearTimeout(confirmTimeout);
    isConfirmState = false;

    PantryList = [];
    savePantryData();
    renderPantryGrid();
    showToast("Pantry completely cleared.", "success");
    resetClearButton(btn);
  }
}

function resetClearButton(btn: HTMLButtonElement): void {
  isConfirmState = false;
  btn.textContent = "Clear Pantry";
  btn.className = "px-4 py-2 bg-red-50 hover:bg-red-100 text-red-650 rounded-xl font-bold text-xs transition cursor-pointer";
}

/**
 * Load stocked goods
 */
function loadPantryData(): void {
  try {
    const raw = localStorage.getItem("pantry_list");
    PantryList = raw ? JSON.parse(raw) : [];
  } catch {
    PantryList = [];
  }
  updateGlobalBadge();
}

/**
 * Persist stocked changes
 */
function savePantryData(): void {
  try {
    localStorage.setItem("pantry_list", JSON.stringify(PantryList));
  } catch (err) {
    console.error("Failed to persist pantry details:", err);
  }
  updateGlobalBadge();
}

/**
 * Synchronize counters at the top
 */
function updateGlobalBadge(): void {
  const badge = document.getElementById("pantry-count-badge");
  if (badge) {
    badge.textContent = String(PantryList.length);
  }

  const clearBtn = document.getElementById("clear-pantry-btn");
  if (clearBtn) {
    if (PantryList.length > 0) {
      clearBtn.classList.remove("hidden");
    } else {
      clearBtn.classList.add("hidden");
    }
  }
}

/**
 * Render pantry grids based on Category headers
 */
function renderPantryGrid(): void {
  const gridContainer = document.getElementById("pantry-grid");
  if (!gridContainer) return;

  gridContainer.innerHTML = "";

  // Distinct groups in order
  const categories = ["Vegetables", "Proteins & Meats", "Dairy & Alternatives", "Pantry & Grains", "Herbs, Spices & Oils", "Fruits & Nuts"];

  let displayedTotalCount = 0;

  categories.forEach(catName => {
    // Collect constituents matches
    let items = PANTRY_ITEMS.filter(it => it.category === catName);

    // Apply keywords filter
    if (CurrentFilterKeyword) {
      items = items.filter(it => 
        it.label.toLowerCase().includes(CurrentFilterKeyword) || 
        it.name.toLowerCase().includes(CurrentFilterKeyword)
      );
    }

    // Apply Stock filter
    if (CurrentFilterMode === "stocked") {
      items = items.filter(it => 
        PantryList.some(p => p.toLowerCase() === it.name.toLowerCase())
      );
    }

    // Skip drawing the category block if empty
    if (items.length === 0) return;

    displayedTotalCount += items.length;

    // Draw Section Block
    const section = document.createElement("div");
    section.className = "ink-stamped-card bg-white p-6 sm:p-8";

    section.innerHTML = `
      <h2 class="font-display font-black text-base text-slate-850 dark:text-slate-100 tracking-tight flex items-center gap-2 mb-6 border-b border-dashed border-slate-250 dark:border-slate-805 pb-4 select-none">
        <span class="text-slate-600 dark:text-amber-400 font-bold uppercase tracking-widest text-[11px] font-mono select-none">●</span>
        ${catName}
        <span class="bg-slate-50 dark:bg-slate-905 text-slate-500 dark:text-slate-405 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">${items.length} options</span>
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" id="cat-group-${catName.replace(/[^a-zA-Z]/g, '')}">
        <!-- Items drawn below -->
      </div>
    `;

    const groupGrid = section.querySelector(`#cat-group-${catName.replace(/[^a-zA-Z]/g, '')}`);
    if (groupGrid) {
      items.forEach(item => {
        const isAdded = PantryList.some(p => p.toLowerCase() === item.name.toLowerCase());
        const card = document.createElement("button");
        card.type = "button";
        
        // Premium tactile stamps and tactile press feedback instead of mathematically perfect layouts
        if (isAdded) {
          card.className = "relative flex flex-col items-center justify-center p-5 rounded-2xl border text-center transition-all bg-slate-100 dark:bg-amber-950/15 border-slate-950 dark:border-amber-350 select-none cursor-pointer w-full group scale-[0.98] shadow-[2px_2px_0px_0px_var(--card-border)] dark:shadow-[2px_2px_0px_0px_#ecbc82]";
        } else {
          card.className = "relative flex flex-col items-center justify-center p-5 rounded-2xl border text-center transition-all bg-white dark:bg-slate-900 border-slate-250 dark:border-slate-800 hover:border-slate-950 dark:hover:border-amber-400 hover:bg-slate-50/20 select-none cursor-pointer w-full group hover:-translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(40,40,40,0.05)] hover:shadow-[3.5px_3.5px_0px_0px_var(--card-border)]";
        }

        const stockedStatus = isAdded
          ? `<span class="absolute top-2.5 right-2.5 text-[9px] font-black text-slate-800 dark:text-amber-100 bg-slate-200 dark:bg-amber-950/40 border border-slate-350 dark:border-amber-400/60 px-1.5 py-0.5 rounded-lg flex items-center gap-0.5 shadow-3xs font-mono uppercase">✓ In Pantry</span>`
          : `<span class="absolute top-2.5 right-2.5 text-[9px] font-bold text-slate-400 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap">+ Add Stock</span>`;

        card.innerHTML = `
          ${stockedStatus}
          <div class="text-3xl mb-3 mt-1 select-none transform group-hover:scale-110 transition duration-300">${item.emoji}</div>
          <span class="font-display font-medium text-xs text-slate-850 dark:text-slate-205 tracking-tight group-hover:text-slate-950 dark:group-hover:text-amber-100 transition">
            ${item.label}
          </span>
        `;

        // Toggle Event
        card.addEventListener("click", () => {
          if (isAdded) {
            // Remove
            PantryList = PantryList.filter(p => p.toLowerCase() !== item.name.toLowerCase());
            savePantryData();
            showToast(`Removed "${item.label}" from pantry setup.`, "warning", 2000);
          } else {
            // Add
            PantryList.push(item.name.toLowerCase());
            savePantryData();
            showToast(`Added "${item.label}" to pantry stock!`, "success", 2000);
          }
          // Dynamic redraw
          renderPantryGrid();
        });

        groupGrid.appendChild(card);
      });
    }

    gridContainer.appendChild(section);
  });

  // Empty state if nothing matches search
  if (displayedTotalCount === 0) {
    gridContainer.innerHTML = `
      <div class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
        <span class="text-4xl mb-4">🔍</span>
        <h3 class="font-display font-black text-lg text-slate-800">No ingredients match your query</h3>
        <p class="text-xs text-slate-400 max-w-xs text-center mt-1">Try searching for other general pantry items such as flour, beef, eggs, cheese, or garlic!</p>
      </div>
    `;
  }
}
