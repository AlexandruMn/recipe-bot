import { setupLayout, showToast } from "./common";
import { PANTRY_ITEMS, PantryItem } from "./ingredients";

// UI Types
interface ExtendedIngredient {
  id: number;
  name: string;
  originalName: string;
  amount: number;
  unit: string;
}

interface InstructionStep {
  number: number;
  step: string;
  equipment?: { name: string }[];
}

// In-Memory States
let addedIngredients: ExtendedIngredient[] = [];
let addedSteps: InstructionStep[] = [];

// Pantry selection state variables
let currentCategory = "all";
let currentSearchQuery = "";
let selectedPantryItem: PantryItem | null = null;

document.addEventListener("DOMContentLoaded", () => {
  // Setup standard layout
  setupLayout("publish");

  // Main Form Link
  const form = document.getElementById("publish-recipe-form") as HTMLFormElement | null;
  
  // Pantry Selection Elements
  const pubSearchInput = document.getElementById("pub-ing-search") as HTMLInputElement | null;
  const pubPantryGrid = document.getElementById("pub-ing-pantry-grid");
  const pubCatFilters = document.querySelectorAll(".pub-cat-filter");
  const pubConfigContainer = document.getElementById("pub-ing-config-container");
  const pubSelectedBadge = document.getElementById("pub-selected-badge");
  const pubAmountInput = document.getElementById("pub-ing-amount") as HTMLInputElement | null;
  const pubUnitInput = document.getElementById("pub-ing-unit") as HTMLInputElement | null;
  const pubCancelBtn = document.getElementById("pub-ing-cancel-btn");
  const pubConfirmBtn = document.getElementById("pub-ing-confirm-btn");

  const ingredientsListContainer = document.getElementById("added-ingredients-list");
  const ingredientsCountBadge = document.getElementById("ingredients-count");

  // Steps Elements
  const addStepBtn = document.getElementById("add-step-btn");
  const stepTextInput = document.getElementById("input-step-text") as HTMLTextAreaElement | null;
  const stepsListContainer = document.getElementById("added-steps-list");
  const stepsCountBadge = document.getElementById("steps-count");

  // 1. Initial Render of publish ingredients selection list
  renderPublishPantry();

  // Search filter handler for publish ingredients pantry
  if (pubSearchInput) {
    pubSearchInput.addEventListener("input", (e) => {
      currentSearchQuery = (e.target as HTMLInputElement).value.trim().toLowerCase();
      renderPublishPantry();
    });
  }

  // Category buttons handler
  pubCatFilters.forEach((button) => {
    button.addEventListener("click", () => {
      // Toggle styles
      pubCatFilters.forEach((btn) => {
        btn.className = "pub-cat-filter px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-350 dark:hover:bg-slate-700 whitespace-nowrap cursor-pointer select-none";
      });
      button.className = "pub-cat-filter px-2.5 py-1 rounded-lg bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 font-bold tracking-tight whitespace-nowrap cursor-pointer select-none";

      const catValue = button.getAttribute("data-cat") || "all";
      currentCategory = catValue;
      renderPublishPantry();
    });
  });

  // Render function for publish ingredients pantry
  function renderPublishPantry() {
    if (!pubPantryGrid) return;
    pubPantryGrid.innerHTML = "";

    let items = PANTRY_ITEMS;

    // Filter by category
    if (currentCategory !== "all") {
      items = items.filter((item) => item.category === currentCategory);
    }

    // Filter by search query
    if (currentSearchQuery) {
      items = items.filter(
        (item) =>
          item.label.toLowerCase().includes(currentSearchQuery) ||
          item.name.toLowerCase().includes(currentSearchQuery)
      );
    }

    if (items.length === 0) {
      pubPantryGrid.innerHTML = `
        <div class="col-span-full py-6 text-center text-xs text-slate-400 italic">
          No matching ingredients found.
        </div>
      `;
      return;
    }

    items.forEach((item) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:border-slate-400 dark:border-slate-800 dark:hover:border-amber-400 bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200 transition-all select-none text-xs text-left cursor-pointer truncate font-medium active:scale-95";
      btn.innerHTML = `
        <span class="text-base leading-none shrink-0">${item.emoji}</span>
        <span class="truncate block">${item.label}</span>
      `;

      btn.addEventListener("click", () => {
        // Highlighting ingredient selection and opening configuration drawer
        selectedPantryItem = item;
        if (pubConfigContainer && pubSelectedBadge && pubAmountInput && pubUnitInput) {
          pubSelectedBadge.innerHTML = `<span class="mr-1">${item.emoji}</span> ${item.label}`;
          
          // Match standard units based on ingredient category / names
          pubAmountInput.value = "1";
          if (item.category === "Vegetables") {
            pubUnitInput.value = "piece";
          } else if (item.category === "Proteins & Meats") {
            pubUnitInput.value = "g";
            pubAmountInput.value = "200";
          } else if (item.category === "Dairy & Alternatives") {
            pubUnitInput.value = item.name.includes("milk") ? "ml" : "g";
            pubAmountInput.value = item.name.includes("milk") ? "250" : "150";
          } else if (item.category === "Pantry & Grains") {
            pubUnitInput.value = item.name.includes("bread") ? "slice" : "cup";
          } else if (item.category === "Herbs, Spices & Oils") {
            pubUnitInput.value = item.name.includes("oil") || item.name.includes("sauce") ? "tbsp" : "tsp";
          } else {
            pubUnitInput.value = "piece";
          }

          pubConfigContainer.classList.remove("hidden");
          pubAmountInput.focus();
          
          // Smooth scroll to the config drawer
          pubConfigContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      });

      pubPantryGrid.appendChild(btn);
    });
  }

  // Cancel Configuration Tray
  if (pubCancelBtn && pubConfigContainer) {
    pubCancelBtn.addEventListener("click", () => {
      pubConfigContainer.classList.add("hidden");
      selectedPantryItem = null;
    });
  }

  // Confirm Required Ingredient in tray
  if (pubConfirmBtn && pubAmountInput && pubUnitInput && pubConfigContainer) {
    pubConfirmBtn.addEventListener("click", () => {
      if (!selectedPantryItem) {
        showToast("Error: No pantry item has been selected.", "error");
        return;
      }

      const rawAmount = parseFloat(pubAmountInput.value);
      const amount = isNaN(rawAmount) || rawAmount <= 0 ? 1 : rawAmount;
      const unit = pubUnitInput.value.trim().toLowerCase() || "unit";

      // Prevent exact duplication nicely by merging or alerting
      const existing = addedIngredients.find((ing) => ing.name === selectedPantryItem!.name);
      if (existing) {
        showToast(`"${selectedPantryItem.label}" is already included. Quantity updated.`, "success");
        existing.amount += amount;
        existing.originalName = `${existing.amount} ${existing.unit} ${selectedPantryItem.label}`.trim();
      } else {
        const item: ExtendedIngredient = {
          id: Date.now() + Math.floor(Math.random() * 100),
          name: selectedPantryItem.name, // lower case key matched cleanly to pantry database
          originalName: `${amount} ${unit} ${selectedPantryItem.label}`.trim(),
          amount: amount,
          unit: unit
        };
        addedIngredients.push(item);
        showToast(`Added ${selectedPantryItem.emoji} ${selectedPantryItem.label} to specifications.`, "success", 1500);
      }

      // Hide drawer & Redraw list
      pubConfigContainer.classList.add("hidden");
      selectedPantryItem = null;
      renderIngredientsList();
    });
  }

  // Draw Dynamic Ingredients Added List markup
  function renderIngredientsList(): void {
    if (!ingredientsListContainer) return;

    ingredientsListContainer.innerHTML = "";

    if (addedIngredients.length === 0) {
      const placeholder = document.createElement("li");
      placeholder.id = "ing-empty-placeholder";
      placeholder.className = "py-4 text-center text-xs text-slate-400 italic";
      placeholder.textContent = "No ingredients added yet. Complete pantry selection above to specify.";
      ingredientsListContainer.appendChild(placeholder);
      if (ingredientsCountBadge) ingredientsCountBadge.textContent = "0 Added";
      return;
    }

    addedIngredients.forEach((ing) => {
      // Find matching emoji
      const originalCatItem = PANTRY_ITEMS.find((c) => c.name === ing.name);
      const emoji = originalCatItem ? originalCatItem.emoji : "🥕";
      const label = originalCatItem ? originalCatItem.label : ing.name;

      const li = document.createElement("li");
      li.className = "flex justify-between items-center py-2.5 border-b border-dashed border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 animate-fade-in";
      li.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="text-base shrink-0 select-none">${emoji}</span>
          <span class="font-bold text-slate-800 dark:text-slate-200">${label}</span>
          <span class="font-mono text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-sm">
            ${ing.amount} ${ing.unit || ""}
          </span>
        </div>
        <button 
          type="button" 
          class="delete-ing-btn text-xs text-red-500 hover:text-red-700 hover:underline transition font-bold px-2 py-1 cursor-pointer select-none"
          data-id="${ing.id}"
          title="Remove ingredient"
        >
          ✕ Remove
        </button>
      `;

      // Wire Up deletion
      li.querySelector(".delete-ing-btn")?.addEventListener("click", () => {
        addedIngredients = addedIngredients.filter((item) => item.id !== ing.id);
        renderIngredientsList();
        showToast(`Removed "${label}".`, "warning", 1500);
      });

      ingredientsListContainer.appendChild(li);
    });

    if (ingredientsCountBadge) {
      ingredientsCountBadge.textContent = `${addedIngredients.length} Added`;
    }
  }

  // Add Preparation Step Logic
  if (addStepBtn && stepTextInput && stepsListContainer) {
    addStepBtn.addEventListener("click", () => {
      const text = stepTextInput.value.trim();
      if (!text) {
        showToast("Please describe the instruction step first.", "warning");
        stepTextInput.focus();
        return;
      }

      const nextNumber = addedSteps.length + 1;
      const newStep: InstructionStep = {
        number: nextNumber,
        step: text,
        equipment: []
      };

      addedSteps.push(newStep);
      renderStepsList();

      // Clear Inputs
      stepTextInput.value = "";
      stepTextInput.focus();

      showToast(`Added Step ${nextNumber} to instructions.`, "success", 1500);
    });
  }

  // Draw Preparation Steps List Markup
  function renderStepsList(): void {
    if (!stepsListContainer) return;

    stepsListContainer.innerHTML = "";

    if (addedSteps.length === 0) {
      const placeholder = document.createElement("li");
      placeholder.id = "step-empty-placeholder";
      placeholder.className = "py-4 text-center text-xs text-slate-400 italic mb-1";
      placeholder.textContent = "No instructions steps specified yet. Add steps starting from Step 1 above.";
      stepsListContainer.appendChild(placeholder);
      if (stepsCountBadge) stepsCountBadge.textContent = "0 Added";
      return;
    }

    addedSteps.forEach((step, index) => {
      // Re-align indexes sequentially
      step.number = index + 1;

      const li = document.createElement("li");
      li.className = "flex items-start justify-between py-3 border-b border-dashed border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-850 dark:text-slate-250 animate-fade-in gap-4";
      li.innerHTML = `
        <div class="flex items-start gap-3">
          <span class="flex items-center justify-center font-mono font-bold text-xs bg-slate-900 text-amber-300 w-5 h-5 rounded-full shrink-0 select-none mt-0.5">
            ${step.number}
          </span>
          <p class="leading-relaxed text-slate-850 dark:text-slate-200 text-left">${step.step}</p>
        </div>
        <button 
          type="button" 
          class="delete-step-btn text-xs text-red-500 hover:text-red-700 hover:underline transition font-bold px-2 py-1 shrink-0 cursor-pointer select-none"
          data-num="${step.number}"
          title="Remove this step"
        >
          ✕ Remove
        </button>
      `;

      // Wire Up deletion
      li.querySelector(".delete-step-btn")?.addEventListener("click", () => {
        addedSteps.splice(index, 1);
        renderStepsList();
        showToast("Removed preparation instruction step.", "warning", 1500);
      });

      stepsListContainer.appendChild(li);
    });

    if (stepsCountBadge) {
      stepsCountBadge.textContent = `${addedSteps.length} Steps`;
    }
  }

  // Full Form Submission Handler
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Read Input values
      const titleVal = (document.getElementById("recipe-title") as HTMLInputElement).value.trim();
      const readyTimeVal = (document.getElementById("recipe-ready-time") as HTMLInputElement).value.trim();
      const servingsVal = (document.getElementById("recipe-servings") as HTMLInputElement).value.trim();
      const imageUrlVal = (document.getElementById("recipe-image-url") as HTMLInputElement).value.trim();
      const summaryVal = (document.getElementById("recipe-summary") as HTMLTextAreaElement).value.trim();

      // Strict List Validation
      if (addedIngredients.length === 0) {
        showToast("Validation Error: Please select at least 1 required ingredient from the pantry to publish.", "error", 4000);
        return;
      }

      if (addedSteps.length === 0) {
        showToast("Validation Error: Please specify at least 1 instruction step to guide the preparation.", "error", 4000);
        return;
      }

      // Check for checked cooking methods
      const selectedMethods: string[] = [];
      if ((document.getElementById("method-airfryer") as HTMLInputElement)?.checked) selectedMethods.push("Air Fryer");
      if ((document.getElementById("method-oven") as HTMLInputElement)?.checked) selectedMethods.push("Oven");
      if ((document.getElementById("method-stovetop") as HTMLInputElement)?.checked) selectedMethods.push("Stovetop");
      if ((document.getElementById("method-slowcooker") as HTMLInputElement)?.checked) selectedMethods.push("Slow Cooker");

      // Choose premium placeholder images by title patterns to make them look gorgeous
      let finalImg = imageUrlVal;
      if (!finalImg) {
        const t = titleVal.toLowerCase();
        if (t.includes("cake") || t.includes("dessert") || t.includes("sweet") || t.includes("sugar")) {
          finalImg = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"; // Cake
        } else if (t.includes("salad") || t.includes("vegan") || t.includes("green")) {
          finalImg = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80"; // Salad
        } else if (t.includes("soup") || t.includes("stew") || t.includes("chili")) {
          finalImg = "https://images.unsplash.com/photo-1547592165-e1d17fed6005?auto=format&fit=crop&w=800&q=80"; // Soup
        } else if (t.includes("drink") || t.includes("cocktail") || t.includes("juice") || t.includes("tea")) {
          finalImg = "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80"; // Drink
        } else {
          // Standard gorgeous fallback
          finalImg = "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80";
        }
      }

      // Build Spoonacular/Fallback Format compliant Recipe Object
      const newRecipeId = Date.now() + Math.floor(Math.random() * 100);
      const readyMinutes = parseInt(readyTimeVal) || 30;
      const servings = parseInt(servingsVal) || 4;

      const newRecipe = {
        id: newRecipeId,
        title: titleVal,
        image: finalImg,
        readyInMinutes: readyMinutes,
        servings: servings,
        summary: summaryVal,
        sourceUrl: "publish.html",
        spoonacularSourceUrl: "publish.html",
        extendedIngredients: addedIngredients,
        analyzedInstructions: [
          {
            name: "",
            steps: addedSteps
          }
        ],
        cookingMethods: selectedMethods
      };

      // Push and commit to localStorage
      try {
        const rawCurrent = localStorage.getItem("custom_published_recipes");
        const currentRecipes = rawCurrent ? JSON.parse(rawCurrent) : [];
        currentRecipes.push(newRecipe);
        localStorage.setItem("custom_published_recipes", JSON.stringify(currentRecipes));

        showToast(`🎉 Success! Your recipe "${titleVal}" has been published to the pantry database.`, "success", 5000);

        // Reset All Form Fields & Lists cleanly
        form.reset();
        addedIngredients = [];
        addedSteps = [];
        renderIngredientsList();
        renderStepsList();

        // Direct user to search matching page gracefully after short delay
        setTimeout(() => {
          window.location.href = "search.html";
        }, 1200);

      } catch (err) {
        console.error("Failed to persist new custom recipe:", err);
        showToast("Failed to publish recipe. Please verify browser memory permissions.", "error");
      }
    });
  }
});
