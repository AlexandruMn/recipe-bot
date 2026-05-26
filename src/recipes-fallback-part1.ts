export const FALLBACK_RECIPES_PART1 = [
  {
    id: 900001,
    title: "Garlic Butter Lemon Salmon",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 20,
    servings: 2,
    summary: "Seared salmon fillet in a rich garlic butter and fresh lemon juice base.",
    extendedIngredients: [
      { id: 1, name: "salmon", originalName: "Salmon Fillets", amount: 2, unit: "pieces" },
      { id: 2, name: "butter", originalName: "Butter", amount: 2, unit: "tbsp" },
      { id: 3, name: "garlic", originalName: "Garlic cloves, minced", amount: 3, unit: "cloves" },
      { id: 4, name: "lemon", originalName: "Lemon (juiced)", amount: 1, unit: "whole" },
      { id: 5, name: "olive oil", originalName: "Extra Virgin Olive Oil", amount: 1, unit: "tbsp" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Season salmon fillets on both sides with salt and pepper.", equipment: [] },
          { number: 2, step: "Heat oil and half the butter over medium heat. Sear salmon for 4 mins skin-side down, then flip for 3 mins.", equipment: [{ name: "skillet" }] },
          { number: 3, step: "Add minced garlic, remaining butter, and lemon juice. Spoon the melted mixture over salmon for 1 minute.", equipment: [{ name: "skillet" }] }
        ]
      }
    ]
  },
  {
    id: 900002,
    title: "Classic Scrambled Eggs with Avocado",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 10,
    servings: 1,
    summary: "Slow-cooked scrambled eggs side-by-side with fresh ripe avocado slices.",
    extendedIngredients: [
      { id: 10, name: "eggs", originalName: "Farm Eggs", amount: 3, unit: "whole" },
      { id: 11, name: "butter", originalName: "Butter", amount: 1, unit: "tbsp" },
      { id: 12, name: "avocado", originalName: "Ripe Avocado", amount: 1, unit: "whole" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Whisk eggs with salt in a bowl.", equipment: [{ name: "bowl" }] },
          { number: 2, step: "Melt butter in a skillet on low. Pour in eggs, stir softly until soft curds form.", equipment: [{ name: "pan" }] },
          { number: 3, step: "Serve next to sliced avocado seasoned with pepper.", equipment: [] }
        ]
      }
    ]
  },
  {
    id: 900003,
    title: "Creamy Garlic Chicken Breast",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 25,
    servings: 3,
    summary: "Pan-seared tender chicken breasts basted in a rich garlic cream sauce.",
    extendedIngredients: [
      { id: 20, name: "chicken breast", originalName: "Boneless Chicken Breasts", amount: 3, unit: "pieces" },
      { id: 21, name: "garlic", originalName: "Garlic cloves, minced", amount: 4, unit: "cloves" },
      { id: 22, name: "butter", originalName: "Butter", amount: 2, unit: "tbsp" },
      { id: 23, name: "milk", originalName: "Whole Milk", amount: 1, unit: "cup" },
      { id: 24, name: "olive oil", originalName: "Olive oil", amount: 1, unit: "tbsp" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Sear chicken breasts in a hot skillet with oil for 5 mins each side until fully done; remove.", equipment: [{ name: "skillet" }] },
          { number: 2, step: "Melt butter on medium, sauté garlic, pour in whole milk, and let simmer until thick.", equipment: [{ name: "skillet" }] },
          { number: 3, step: "Return chicken to pan and spoon the cream sauce over.", equipment: [] }
        ]
      }
    ]
  },
  {
    id: 900004,
    title: "Rustic Potato & Mushroom Hash",
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 25,
    servings: 2,
    summary: "Seared crispy potatoes matched side-by-side with mushrooms and sweet onions.",
    extendedIngredients: [
      { id: 30, name: "potatoes", originalName: "Potatoes, cubed", amount: 3, unit: "medium" },
      { id: 31, name: "mushrooms", originalName: "Fresh Mushrooms", amount: 1.5, unit: "cups" },
      { id: 32, name: "onions", originalName: "Onion, chopped", amount: 1, unit: "whole" },
      { id: 33, name: "garlic", originalName: "Garlic cloves", amount: 3, unit: "cloves" },
      { id: 34, name: "olive oil", originalName: "Olive oil", amount: 2, unit: "tbsp" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Boil potatoes for 5 minutes, then drain and cut.", equipment: [{ name: "pot" }] },
          { number: 2, step: "Sauté potatoes in olive oil for 10 mins in a skillet until crispy.", equipment: [{ name: "skillet" }] },
          { number: 3, step: "Add chopped mushrooms, onions, and garlic, cooking 6 more minutes until golden.", equipment: [{ name: "skillet" }] }
        ]
      }
    ]
  },
  {
    id: 900005,
    title: "Gourmet Pesto Pasta with Bell Peppers",
    image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 15,
    servings: 4,
    summary: "Al-dente pasta mixed with extra virgin olive oil, sweet bell peppers, and garlic.",
    extendedIngredients: [
      { id: 40, name: "pasta", originalName: "Penne Pasta", amount: 12, unit: "oz" },
      { id: 41, name: "bell peppers", originalName: "Bell Peppers", amount: 2, unit: "whole" },
      { id: 42, name: "garlic", originalName: "Garlic cloves", amount: 3, unit: "cloves" },
      { id: 43, name: "olive oil", originalName: "Olive Oil", amount: 3, unit: "tbsp" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Cook pasta in a pot of boiling salted water until al dente.", equipment: [{ name: "pot" }] },
          { number: 2, step: "Sauté sliced bell peppers and garlic in a skillet with olive oil until softened.", equipment: [{ name: "skillet" }] },
          { number: 3, step: "Drain pasta and toss into the skillet with sweet sautéed peppers.", equipment: [] }
        ]
      }
    ]
  },
  {
    id: 900006,
    title: "Apple Cinnamon Oatmeal",
    image: "https://images.unsplash.com/photo-1517881917430-e70dfb3610aa?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 12,
    servings: 2,
    summary: "Creamy oatmeal slow-simmered in whole milk, topped with chopped sweet gala apples.",
    extendedIngredients: [
      { id: 50, name: "oats", originalName: "Rolled Oats", amount: 1, unit: "cup" },
      { id: 51, name: "apples", originalName: "Apple, chopped", amount: 1, unit: "whole" },
      { id: 52, name: "milk", originalName: "Milk", amount: 2, unit: "cups" },
      { id: 53, name: "brown sugar", originalName: "Brown Sugar", amount: 1.5, unit: "tbsp" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Sauté chopped apples in a saucepan with oats and a splash of milk.", equipment: [{ name: "saucepan" }] },
          { number: 2, step: "Pour in rest of milk, stir in brown sugar, and cook on low for 6 minutes.", equipment: [] }
        ]
      }
    ]
  },
  {
    id: 900007,
    title: "Skillet Zucchini & Tomato Sauté",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 15,
    servings: 2,
    summary: "Fresh rounds of zucchini pan-seared with sweet tomatoes and aromatic garlic.",
    extendedIngredients: [
      { id: 60, name: "zucchini", originalName: "Zucchini rounds", amount: 2, unit: "whole" },
      { id: 61, name: "tomatoes", originalName: "Sweet Tomatoes", amount: 2, unit: "medium" },
      { id: 62, name: "onions", originalName: "Onion", amount: 0.5, unit: "whole" },
      { id: 63, name: "garlic", originalName: "Garlic cloves", amount: 3, unit: "cloves" },
      { id: 64, name: "olive oil", originalName: "Olive Oil", amount: 1.5, unit: "tbsp" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Sauté onion and garlic in olive oil in a pan.", equipment: [{ name: "pan" }] },
          { number: 2, step: "Add sliced zucchini, cooking for 5 minutes until browned.", equipment: [] },
          { number: 3, step: "Stir in tomatoes and simmer 3 minutes until tender.", equipment: [] }
        ]
      }
    ]
  },
  {
    id: 900008,
    title: "Crispy Bacon & Egg Toast",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 12,
    servings: 1,
    summary: "Crunchy toasted bread under crisp, fried bacon and a fresh sunny-side-up egg.",
    extendedIngredients: [
      { id: 70, name: "bread", originalName: "Bread slices", amount: 2, unit: "slices" },
      { id: 71, name: "eggs", originalName: "Egg", amount: 1, unit: "whole" },
      { id: 72, name: "bacon", originalName: "Bacon strips", amount: 3, unit: "strips" },
      { id: 73, name: "butter", originalName: "Butter", amount: 1, unit: "tbsp" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Fry bacon strips until crispy, then remove.", equipment: [{ name: "pan" }] },
          { number: 2, step: "Toast bread in butter. Fry egg in same pan to desired doneness.", equipment: [{ name: "pan" }] },
          { number: 3, step: "Stack buttered toast with crispy bacon and fried egg.", equipment: [] }
        ]
      }
    ]
  },
  {
    id: 900009,
    title: "Garlic Cheddar Grilled Cheese",
    image: "https://images.unsplash.com/photo-1476887334197-56adcd254e1a?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 10,
    servings: 1,
    summary: "Buttered bread rubbed with fresh garlic and melted sharp cheddar cheese.",
    extendedIngredients: [
      { id: 80, name: "bread", originalName: "Bread", amount: 2, unit: "slices" },
      { id: 81, name: "cheddar cheese", originalName: "Cheddar Cheese", amount: 1, unit: "cup" },
      { id: 82, name: "butter", originalName: "Butter", amount: 1.5, unit: "tbsp" },
      { id: 83, name: "garlic", originalName: "Garlic clove", amount: 1, unit: "clove" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Mix minced garlic with softened butter, then spread on bread slices.", equipment: [] },
          { number: 2, step: "Place buttered bread down in skillet, fill with cheddar cheese.", equipment: [{ name: "skillet" }] },
          { number: 3, step: "Cook over medium-low heat until crunchy golden on both sides and cheese is melted.", equipment: [{ name: "skillet" }] }
        ]
      }
    ]
  },
  {
    id: 900010,
    title: "Avocado Tomato Salad",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 8,
    servings: 2,
    summary: "Fresh cubed avocado and sweet tomatoes tossed in extra virgin olive oil and lemon.",
    extendedIngredients: [
      { id: 91, name: "avocado", originalName: "Avocado, cubed", amount: 2, unit: "whole" },
      { id: 92, name: "tomatoes", originalName: "Sweet Tomatoes, diced", amount: 2, unit: "medium" },
      { id: 93, name: "onions", originalName: "Onion, diced", amount: 0.25, unit: "whole" },
      { id: 94, name: "olive oil", originalName: "Olive oil", amount: 1, unit: "tbsp" },
      { id: 95, name: "lemon", originalName: "Lemon (juiced)", amount: 0.5, unit: "whole" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Combine avocado, sweet tomatoes, and onions gently in a salad bowl.", equipment: [{ name: "bowl" }] },
          { number: 2, step: "Drizzle with olive oil and lemon juice, and toss lightly.", equipment: [] }
        ]
      }
    ]
  },
  {
    id: 900011,
    title: "Garlic Butter Shrimp Sensation",
    image: "https://images.unsplash.com/photo-1559742811-824289511f48?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 15,
    servings: 2,
    summary: "Quick-seared savory shrimp basted in garlic lemon butter.",
    extendedIngredients: [
      { id: 101, name: "shrimp", originalName: "Fresh Shrimp", amount: 1, unit: "lb" },
      { id: 102, name: "butter", originalName: "Salted Butter", amount: 3, unit: "tbsp" },
      { id: 103, name: "garlic", originalName: "Garlic cloves, minced", amount: 4, unit: "cloves" },
      { id: 104, name: "lemon", originalName: "Lemon (juiced)", amount: 0.5, unit: "whole" },
      { id: 105, name: "black pepper", originalName: "Black Pepper", amount: 1, unit: "pinch" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Melt butter in a skillet over medium heat.", equipment: [{ name: "skillet" }] },
          { number: 2, step: "Add minced garlic and sauté for 1 minute until fragrant.", equipment: [] },
          { number: 3, step: "Add shrimp, cook until pink (about 4 minutes). Pour lemon juice and serve.", equipment: [] }
        ]
      }
    ]
  },
  {
    id: 900012,
    title: "Honey Soy Glazed Salmon",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 20,
    servings: 2,
    summary: "Perfect salmon fillets caramelized in a sweet honey and savory soy glaze.",
    extendedIngredients: [
      { id: 111, name: "salmon", originalName: "Salmon Fillet", amount: 2, unit: "pieces" },
      { id: 112, name: "honey", originalName: "Organic Honey", amount: 2, unit: "tbsp" },
      { id: 113, name: "soy sauce", originalName: "Soy Sauce", amount: 1.5, unit: "tbsp" },
      { id: 114, name: "garlic", originalName: "Garlic Cloves, minced", amount: 2, unit: "cloves" },
      { id: 115, name: "olive oil", originalName: "Olive Oil", amount: 1, unit: "tbsp" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Whisk honey, soy sauce, and minced garlic in a small bowl.", equipment: [{ name: "bowl" }] },
          { number: 2, step: "Sear salmon in a hot skillet with olive oil for 4 minutes skin-side down; flip.", equipment: [{ name: "skillet" }] },
          { number: 3, step: "Pour glaze over salmon, simmer on low until caramelized and sticky.", equipment: [] }
        ]
      }
    ]
  },
  {
    id: 900013,
    title: "Creamy Broccoli Cheddar Pot",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 25,
    servings: 4,
    summary: "Smooth, velvety thick broccoli cream soup rich in sharp cheddar cheese flavor.",
    extendedIngredients: [
      { id: 121, name: "broccoli", originalName: "Broccoli florets", amount: 3, unit: "cups" },
      { id: 122, name: "cheddar cheese", originalName: "Cheddar Cheese, grated", amount: 1.5, unit: "cups" },
      { id: 123, name: "milk", originalName: "Whole Milk", amount: 2, unit: "cups" },
      { id: 124, name: "flour", originalName: "Flour", amount: 2, unit: "tbsp" },
      { id: 125, name: "butter", originalName: "Butter", amount: 2, unit: "tbsp" },
      { id: 126, name: "onions", originalName: "Onion, chopped", amount: 1, unit: "whole" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Melt butter in a pot; sauté onions until tender. Stir in flour for 1 minute.", equipment: [{ name: "pot" }] },
          { number: 2, step: "Slowly whisk in whole milk, bringing to a gentle simmer. Add broccoli.", equipment: [] },
          { number: 3, step: "Simmer until broccoli is soft. Garnish with cheddar cheese off heat until completely melted.", equipment: [] }
        ]
      }
    ]
  },
  {
    id: 900014,
    title: "Pan Honey Teriyaki Chicken",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 22,
    servings: 3,
    summary: "Glazed pan chicken wok glazed with soy sauce, garlic, and sweet honey over steamed white rice.",
    extendedIngredients: [
      { id: 131, name: "chicken breast", originalName: "Chicken breast, cubed", amount: 3, unit: "breasts" },
      { id: 132, name: "white rice", originalName: "White Rice", amount: 1, unit: "cup" },
      { id: 133, name: "soy sauce", originalName: "Soy Sauce", amount: 3, unit: "tbsp" },
      { id: 134, name: "honey", originalName: "Honey", amount: 2, unit: "tbsp" },
      { id: 135, name: "garlic", originalName: "Garlic, minced", amount: 2, unit: "cloves" },
      { id: 136, name: "vegetable oil", originalName: "Vegetable Oil", amount: 1, unit: "tbsp" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Cook white rice in a pot with 2 cups of water.", equipment: [{ name: "pot" }] },
          { number: 2, step: "Wok sauté cubed chicken breast in oil until golden brown.", equipment: [{ name: "skillet" }] },
          { number: 3, step: "Pour in a mixture of soy sauce, honey, and minced garlic; cook until chicken is glazed, then serve with rice.", equipment: [] }
        ]
      }
    ]
  },
  {
    id: 900015,
    title: "Spinach Egg Scramble",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 8,
    servings: 1,
    summary: "Wholesome scrambled eggs whipped with wilted baby spinach and seasoned with butter.",
    extendedIngredients: [
      { id: 141, name: "eggs", originalName: "Eggs", amount: 2, unit: "whole" },
      { id: 142, name: "spinach", originalName: "Fresh Spinach", amount: 1.5, unit: "cups" },
      { id: 143, name: "butter", originalName: "Butter", amount: 1, unit: "tbsp" },
      { id: 144, name: "black pepper", originalName: "Salt and Pepper", amount: 1, unit: "pinch" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Melt butter in a pan over medium heat; wilt the fresh spinach leaves.", equipment: [{ name: "pan" }] },
          { number: 2, step: "Whisk eggs with salt and pour on top of spinach.", equipment: [] },
          { number: 3, step: "Stir gently for 2 minutes until fully scrambled and set.", equipment: [] }
        ]
      }
    ]
  },
  {
    id: 900016,
    title: "Crispy Garlic Baked Potatoes",
    image: "https://images.unsplash.com/photo-1518013006335-ee1d4456eae7?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 30,
    servings: 3,
    summary: "Oven roasted rustic potatoes tossed in olive oil and garlic powder.",
    extendedIngredients: [
      { id: 151, name: "potatoes", originalName: "Potatoes, sliced", amount: 4, unit: "medium" },
      { id: 152, name: "olive oil", originalName: "Olive Oil", amount: 2, unit: "tbsp" },
      { id: 153, name: "garlic powder", originalName: "Garlic Powder", amount: 1, unit: "tbsp" },
      { id: 154, name: "salt", originalName: "Salt & pepper", amount: 1, unit: "pinch" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Toss potato slices in a large bowl with olive oil, garlic powder, and salt.", equipment: [{ name: "bowl" }] },
          { number: 2, step: "Spread onto a nonstick baking tray.", equipment: [{ name: "baking sheet" }] },
          { number: 3, step: "Bake at 400°F (or pan-cook covered) for 25 minutes until crispy and golden.", equipment: [] }
        ]
      }
    ]
  },
  {
    id: 900017,
    title: "Gourmet Beef Steak with Onions",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 20,
    servings: 2,
    summary: "Seared premium beef steak topped with sweet, buttery caramelized onions.",
    extendedIngredients: [
      { id: 161, name: "beef steak", originalName: "Beef Steak", amount: 2, unit: "portions" },
      { id: 162, name: "onions", originalName: "Sweet Onion, sliced", amount: 2, unit: "whole" },
      { id: 163, name: "butter", originalName: "Butter", amount: 2, unit: "tbsp" },
      { id: 164, name: "olive oil", originalName: "Olive Oil", amount: 1, unit: "tbsp" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Slowly sauté sweet onions in butter until browned and caramelized.", equipment: [{ name: "pan" }] },
          { number: 2, step: "Season steak. Heat olive oil in a hot pan; sear steak for 3-4 minutes each side.", equipment: [{ name: "pan" }] },
          { number: 3, step: "Top hot steak with sweet caramelized onions and serve immediately.", equipment: [] }
        ]
      }
    ]
  },
  {
    id: 900018,
    title: "Premium Egg Avocado Toast",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 8,
    servings: 1,
    summary: "Toasted bread loaded with savory mashed avocado and a fried egg.",
    extendedIngredients: [
      { id: 171, name: "bread", originalName: "Bread Slices", amount: 1, unit: "portion" },
      { id: 172, name: "avocado", originalName: "Fresh Avocado", amount: 0.5, unit: "whole" },
      { id: 173, name: "eggs", originalName: "Fresh Egg", amount: 1, unit: "whole" },
      { id: 174, name: "butter", originalName: "Butter", amount: 0.5, unit: "tbsp" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Toast bread in butter. Slice or mash avocado onto toasted bread.", equipment: [] },
          { number: 2, step: "Fry egg in a small skillet to your preference.", equipment: [{ name: "skillet" }] },
          { number: 3, step: "Top the avocado layer with egg and garnish with black pepper.", equipment: [] }
        ]
      }
    ]
  },
  {
    id: 900019,
    title: "Buttery Parmesan Mushroom Pasta",
    image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 18,
    servings: 2,
    summary: "Pasta combined with sautéed mushrooms, whole milk, butter, and parmesan.",
    extendedIngredients: [
      { id: 181, name: "pasta", originalName: "Pasta", amount: 8, unit: "oz" },
      { id: 182, name: "mushrooms", originalName: "Sliced Mushrooms", amount: 1.5, unit: "cups" },
      { id: 183, name: "milk", originalName: "Whole Milk", amount: 1, unit: "cup" },
      { id: 184, name: "parmesan", originalName: "Grated Parmesan", amount: 0.5, unit: "cup" },
      { id: 185, name: "butter", originalName: "Butter", amount: 2, unit: "tbsp" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Cook pasta in a pot. Drain and set aside.", equipment: [{ name: "pot" }] },
          { number: 2, step: "Sauté mushrooms in melted butter until browned in a pan.", equipment: [{ name: "pan" }] },
          { number: 3, step: "Reduce heat. Stir in milk, parmesan, and cooked pasta.", equipment: [] }
        ]
      }
    ]
  },
  {
    id: 900020,
    title: "Aromatic Banana Honey Oatmeal",
    image: "https://images.unsplash.com/photo-1517881917430-e70dfb3610aa?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 10,
    servings: 1,
    summary: "Cozy rolled oats sweet-simmered in soy milk with bananas and real honey.",
    extendedIngredients: [
      { id: 191, name: "oats", originalName: "Oats", amount: 0.5, unit: "cup" },
      { id: 192, name: "soy milk", originalName: "Soy Milk", amount: 1, unit: "cup" },
      { id: 193, name: "bananas", originalName: "Sliced Banana", amount: 1, unit: "whole" },
      { id: 194, name: "honey", originalName: "Organic Honey", amount: 1, unit: "tbsp" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Simmer oats in soy milk in a saucepan for 5 minutes.", equipment: [{ name: "saucepan" }] },
          { number: 2, step: "Stir in organic honey, cool slightly.", equipment: [] },
          { number: 3, step: "Top with sliced sweet bananas and enjoy.", equipment: [] }
        ]
      }
    ]
  }
];
