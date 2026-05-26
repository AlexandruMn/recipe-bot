export const FALLBACK_RECIPES_PART2 = [
  {
    id: 900021,
    title: "Vibrant Vegetable Stir Fry",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 15,
    servings: 2,
    summary: "Crispy sautéed broccoli, carrots, bell peppers, and zucchini drizzled with savory soy sauce.",
    extendedIngredients: [
      { id: 201, name: "broccoli", originalName: "Broccoli Florets", amount: 1, unit: "cup" },
      { id: 202, name: "carrots", originalName: "Carrots, sliced", amount: 1, unit: "whole" },
      { id: 203, name: "bell peppers", originalName: "Bell Pepper, sliced", amount: 1, unit: "whole" },
      { id: 204, name: "zucchini", originalName: "Zucchini, sliced", amount: 1, unit: "whole" },
      { id: 205, name: "soy sauce", originalName: "Soy Sauce", amount: 2, unit: "tbsp" },
      { id: 206, name: "olive oil", originalName: "Olive Oil", amount: 1, unit: "tbsp" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Heat olive oil in a skillet or wok over medium-high heat.", equipment: [{ name: "skillet" }] },
          { number: 2, step: "Toss in sliced carrots and broccoli, and sauté for 5 minutes until tender-crisp.", equipment: [] },
          { number: 3, step: "Add sweet bell peppers, zucchini, and splash soy sauce; sauté for another 3 minutes, then serve.", equipment: [] }
        ]
      }
    ]
  },
  {
    id: 900022,
    title: "Chicken and Bacon Club Wrap",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 12,
    servings: 1,
    summary: "Warm pan-cooked chicken breasts, crunchy bacon, and lettuce wrapped in flat toasted bread.",
    extendedIngredients: [
      { id: 211, name: "chicken breast", originalName: "Chicken Breast, cooked", amount: 1, unit: "cup" },
      { id: 212, name: "bacon", originalName: "Crisp Bacon Strips", amount: 2, unit: "strips" },
      { id: 213, name: "lettuce", originalName: "Lettuce leaves", amount: 3, unit: "leaves" },
      { id: 214, name: "bread", originalName: "Bread Slices or wraps", amount: 2, unit: "slices" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Cook bacon in a hot pan until crisp, cook chicken strips until fully browned.", equipment: [{ name: "pan" }] },
          { number: 2, step: "Lay lettuce leaves, chicken pieces, and crisp bacon onto bread slices.", equipment: [] },
          { number: 3, step: "Fold together and serve warm.", equipment: [] }
        ]
      }
    ]
  },
  {
    id: 900023,
    title: "Easy Egg White Rice Bowl",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 10,
    servings: 1,
    summary: "Steamed white rice wok tossed with scrambled farm eggs, soy sauce, and aromatic garlic.",
    extendedIngredients: [
      { id: 221, name: "white rice", originalName: "White Rice, cooked", amount: 1.5, unit: "cups" },
      { id: 222, name: "eggs", originalName: "Farm Eggs", amount: 2, unit: "whole" },
      { id: 223, name: "soy sauce", originalName: "Soy Sauce", amount: 1, unit: "tbsp" },
      { id: 224, name: "garlic", originalName: "Garlic, minced", amount: 1, unit: "clove" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Heat oil in a wok; fry garlic and add cooked cold white rice.", equipment: [{ name: "pan" }] },
          { number: 2, step: "Push rice to one side of the skillet and crack eggs into empty space; scramble until set.", equipment: [{ name: "skillet" }] },
          { number: 3, step: "Combine together with soy sauce, cooking for 1 minute.", equipment: [] }
        ]
      }
    ]
  },
  {
    id: 900024,
    title: "Garlic Bread Deluxe",
    image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 10,
    servings: 2,
    summary: "Toasted slices of buttered bread with garlic, oregano, and melted parmesan cheese.",
    extendedIngredients: [
      { id: 231, name: "bread", originalName: "Bread slices", amount: 4, unit: "portions" },
      { id: 232, name: "butter", originalName: "Butter, softened", amount: 2, unit: "tbsp" },
      { id: 233, name: "garlic", originalName: "Garlic Cloves, minced", amount: 3, unit: "cloves" },
      { id: 234, name: "parmesan", originalName: "Parmesan, grated", amount: 0.25, unit: "cup" },
      { id: 235, name: "oregano", originalName: "Dried Oregano", amount: 0.5, unit: "tsp" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Mix butter, garlic, oregano, and grated parmesan cheese together.", equipment: [] },
          { number: 2, step: "Spread evenly on sourdough slices.", equipment: [] },
          { number: 3, step: "Bake or skillet grill over medium-high heat until toasted and golden brown.", equipment: [{ name: "skillet" }] }
        ]
      }
    ]
  },
  {
    id: 900025,
    title: "Apple Almond Crunch Salad",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 10,
    servings: 2,
    summary: "Crisp greens topped with sweet apple matchsticks, almonds, and home lemon olive dressing.",
    extendedIngredients: [
      { id: 241, name: "apples", originalName: "Fresh Apples, sliced", amount: 1, unit: "whole" },
      { id: 242, name: "almonds", originalName: "Shelled Almonds, slivered", amount: 0.25, unit: "cup" },
      { id: 243, name: "lettuce", originalName: "Crisp Lettuce", amount: 4, unit: "cups" },
      { id: 244, name: "olive oil", originalName: "Olive Oil", amount: 1.5, unit: "tbsp" },
      { id: 245, name: "lemon", originalName: "Lemon (juiced)", amount: 0.5, unit: "whole" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Toss crisp sliced lettuce together with sweet apple matchsticks and crunchy almonds in a big bowl.", equipment: [{ name: "bowl" }] },
          { number: 2, step: "Whisk lemon juice and olive oil with a pinch of salt.", equipment: [] },
          { number: 3, step: "Pour dressing over visual elements, toss, and serve.", equipment: [] }
        ]
      }
    ]
  },
  {
    id: 900026,
    title: "Zucchini Parmesan Fritters",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 20,
    servings: 2,
    summary: "Tasty pan-fried shredded zucchini combined with flour, egg, and parmesan cheese.",
    extendedIngredients: [
      { id: 251, name: "zucchini", originalName: "Zucchini, shredded", amount: 2, unit: "whole" },
      { id: 252, name: "flour", originalName: "Baking Flour", amount: 0.25, unit: "cup" },
      { id: 253, name: "eggs", originalName: "Farm Eggs", amount: 1, unit: "whole" },
      { id: 254, name: "parmesan", originalName: "Parmesan, grated", amount: 0.25, unit: "cup" },
      { id: 255, name: "olive oil", originalName: "Olive Oil", amount: 2, unit: "tbsp" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Squeeze moisture out of shredded zucchini with a clean dishtowel.", equipment: [] },
          { number: 2, step: "Mix zucchini, flour, eggs, and grated parmesan cheese in a bowl.", equipment: [{ name: "bowl" }] },
          { number: 3, step: "Drop scoops of the mixture into hot olive oil in a skillet; press flat and fry 3 minutes per side until gold.", equipment: [{ name: "skillet" }] }
        ]
      }
    ]
  },
  {
    id: 900027,
    title: "Creamy Spinach Dip",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 15,
    servings: 4,
    summary: "Hot and melty cream dip with fresh baby spinach, sour cream, and mozzarella.",
    extendedIngredients: [
      { id: 261, name: "spinach", originalName: "Fresh Spinach", amount: 3, unit: "cups" },
      { id: 262, name: "sour cream", originalName: "Sour cream", amount: 1, unit: "cup" },
      { id: 263, name: "garlic", originalName: "Garlic, minced", amount: 2, unit: "cloves" },
      { id: 264, name: "mozzarella", originalName: "Mozzarella Cheese, grated", amount: 1, unit: "cup" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Sauté baby spinach in a pan with garlic until wilted; drain liquid.", equipment: [{ name: "pan" }] },
          { number: 2, step: "Mix spinach with sour cream and half of the mozzarella.", equipment: [] },
          { number: 3, step: "Spread into a ramekin, top with mozzarella, and microwave or bake until melted.", equipment: [] }
        ]
      }
    ]
  },
  {
    id: 900028,
    title: "Garlic Roasted French Fries",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 25,
    servings: 2,
    summary: "Crispy freshly-cut potato spears tossed in vegetable oil and savory garlic powder.",
    extendedIngredients: [
      { id: 271, name: "potatoes", originalName: "Potatoes", amount: 3, unit: "medium" },
      { id: 272, name: "vegetable oil", originalName: "Vegetable Oil", amount: 2, unit: "tbsp" },
      { id: 273, name: "garlic powder", originalName: "Garlic Powder", amount: 1, unit: "tbsp" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Cut clean potatoes into uniform french fry batons.", equipment: [{ name: "knife" }] },
          { number: 2, step: "Toss with vegetable oil, garlic powder, and salt.", equipment: [{ name: "bowl" }] },
          { number: 3, step: "Pan-fry or oven-bake for twenty minutes until perfectly brown.", equipment: [] }
        ]
      }
    ]
  },
  {
    id: 900029,
    title: "Tomato Soup with Sourdough Bread",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 20,
    servings: 2,
    summary: "Classic rich tomato pot soup matched with buttery cheddar sourdough bread.",
    extendedIngredients: [
      { id: 281, name: "tomatoes", originalName: "Sweet Tomatoes", amount: 4, unit: "medium" },
      { id: 282, name: "butter", originalName: "Butter", amount: 2, unit: "tbsp" },
      { id: 283, name: "milk", originalName: "Milk", amount: 0.5, unit: "cup" },
      { id: 284, name: "bread", originalName: "Bread Slices", amount: 2, unit: "slices" },
      { id: 285, name: "cheddar cheese", originalName: "Cheddar Cheese", amount: 0.5, unit: "cup" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Simmer tomatoes with butter and milk in a pot; blend until smooth.", equipment: [{ name: "pot" }] },
          { number: 2, step: "Toast bread with cheddar cheese in a pan until melted.", equipment: [{ name: "pan" }] },
          { number: 3, step: "Serve hot soup alongside cheddar cheese toast.", equipment: [] }
        ]
      }
    ]
  },
  {
    id: 900030,
    title: "Lemon Sautéed Broccoli",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 10,
    servings: 2,
    summary: "Zesty, nutritious broccoli florets pan-seared with olive oil, garlic, and fresh lemon.",
    extendedIngredients: [
      { id: 291, name: "broccoli", originalName: "Broccoli florets", amount: 3, unit: "cups" },
      { id: 292, name: "garlic", originalName: "Garlic, minced", amount: 2, unit: "cloves" },
      { id: 293, name: "olive oil", originalName: "Olive Oil", amount: 1.5, unit: "tbsp" },
      { id: 294, name: "lemon", originalName: "Lemon (juiced)", amount: 0.5, unit: "whole" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Sauté minced garlic in extra olive oil in a skillet.", equipment: [{ name: "skillet" }] },
          { number: 2, step: "Add broccoli florets, stir-cook for 7 minutes until tender-crisp.", equipment: [] },
          { number: 3, step: "Squeeze lemon juice on top, toss, and serve.", equipment: [] }
        ]
      }
    ]
  },
  {
    id: 900031,
    title: "Bacon Broccoli Egg Scramble",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 12,
    servings: 2,
    summary: "Comfort breakfast skillet of scrambled eggs with bacon bits, broccoli, and cheddar cheese.",
    extendedIngredients: [
      { id: 301, name: "bacon", originalName: "Bacon strips", amount: 3, unit: "strips" },
      { id: 302, name: "broccoli", originalName: "Broccoli florets", amount: 1, unit: "cup" },
      { id: 303, name: "eggs", originalName: "Farm Eggs", amount: 3, unit: "whole" },
      { id: 304, name: "cheddar cheese", originalName: "Cheddar Cheese, grated", amount: 0.5, unit: "cup" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "In a pan, cook bacon until crisp. Remove and sauté broccoli in the bacon grease.", equipment: [{ name: "pan" }] },
          { number: 2, step: "Whisk eggs, pour on top of broccoli, crumble in bacon, and scramble.", equipment: [] },
          { number: 3, step: "Garnish with cheddar cheese until melted.", equipment: [] }
        ]
      }
    ]
  },
  {
    id: 900032,
    title: "Mouthwatering Honey Roasted Carrots",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 22,
    servings: 3,
    summary: "Pencil Carrots glazed beautifully with honey and olive oil, finished with thyme.",
    extendedIngredients: [
      { id: 311, name: "carrots", originalName: "Sweet Carrots", amount: 1, unit: "bunch" },
      { id: 312, name: "honey", originalName: "Organic Honey", amount: 2, unit: "tbsp" },
      { id: 313, name: "olive oil", originalName: "Olive Oil", amount: 1, unit: "tbsp" },
      { id: 314, name: "thyme", originalName: "Dried Thyme", amount: 0.5, unit: "tsp" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Toss carrots with olive oil, organic honey, and thyme.", equipment: [{ name: "bowl" }] },
          { number: 2, step: "Cook in a frying pan on medium-low under cover until cooked through (around 15 mins).", equipment: [{ name: "pan" }] },
          { number: 3, step: "Increase heat for 3 minutes to caramelize the honey.", equipment: [] }
        ]
      }
    ]
  },
  {
    id: 900033,
    title: "Steak and Crusted Mushrooms",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 20,
    servings: 2,
    summary: "Seared beef steak served with button mushrooms cooked in buttery whole milk.",
    extendedIngredients: [
      { id: 321, name: "beef steak", originalName: "Beef Steak", amount: 2, unit: "pieces" },
      { id: 322, name: "mushrooms", originalName: "Sliced Mushrooms", amount: 1.5, unit: "cups" },
      { id: 323, name: "garlic", originalName: "Garlic, minced", amount: 2, unit: "cloves" },
      { id: 324, name: "butter", originalName: "Butter", amount: 2, unit: "tbsp" },
      { id: 325, name: "milk", originalName: "Whole Milk", amount: 0.5, unit: "cup" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Sear seasoned beef steak in a skillet until cooked to preference; remove.", equipment: [{ name: "skillet" }] },
          { number: 2, step: "In the same pan, melt butter and sauté garlic and mushrooms.", equipment: [{ name: "pan" }] },
          { number: 3, step: "Pour in whole milk and simmer for 3 minutes. Top steak with mushroom cream.", equipment: [] }
        ]
      }
    ]
  },
  {
    id: 900034,
    title: "Creamy Garlic Zucchini Pasta",
    image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 15,
    servings: 2,
    summary: "Pasta combined with sliced zucchini, heavy garlic, whole milk, and grated parmesan.",
    extendedIngredients: [
      { id: 331, name: "zucchini", originalName: "Zucchini, sliced thin", amount: 1, unit: "whole" },
      { id: 332, name: "pasta", originalName: "Pasta", amount: 8, unit: "oz" },
      { id: 333, name: "parmesan", originalName: "Parmesan, grated", amount: 0.5, unit: "cup" },
      { id: 334, name: "garlic", originalName: "Garlic cloves, sliced", amount: 3, unit: "cloves" },
      { id: 335, name: "milk", originalName: "Whole Milk", amount: 1, unit: "cup" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Cook pasta in salted water; drain.", equipment: [{ name: "pot" }] },
          { number: 2, step: "Sauté garlic and zucchini slices in olive oil in a skillet.", equipment: [{ name: "skillet" }] },
          { number: 3, step: "Add milk and cooked pasta; cook until hot. Stir in parmesan and serve.", equipment: [] }
        ]
      }
    ]
  },
  {
    id: 900035,
    title: "Egg Cream Salad Sandwich",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 10,
    servings: 1,
    summary: "Scrambled-like boiled eggs whipped with sour cream, layered with salad lettuce on bread.",
    extendedIngredients: [
      { id: 341, name: "eggs", originalName: "Farm Eggs, boiled", amount: 2, unit: "whole" },
      { id: 342, name: "sour cream", originalName: "Sour Cream", amount: 2, unit: "tbsp" },
      { id: 343, name: "bread", originalName: "Bread slices", amount: 2, unit: "slices" },
      { id: 344, name: "lettuce", originalName: "Lettuce wrap", amount: 1, unit: "portion" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Mash boiled eggs in a small bowl; stir in sour cream, salt, and black pepper.", equipment: [{ name: "bowl" }] },
          { number: 2, step: "Lay crisp lettuce onto a slice of bread; spread egg mixture on top.", equipment: [] },
          { number: 3, step: "Top with remaining bread slice and cut diagonally.", equipment: [{ name: "knife" }] }
        ]
      }
    ]
  },
  {
    id: 900036,
    title: "Almonds, Bananas & Greek Yogurt Breakfast Bowl",
    image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 5,
    servings: 1,
    summary: "Instant breakfast bowl filled with Greek yogurt, honey, banana rounds, and almonds.",
    extendedIngredients: [
      { id: 351, name: "almonds", originalName: "Slivered Almonds", amount: 0.25, unit: "cup" },
      { id: 352, name: "bananas", originalName: "Sweet Banana", amount: 1, unit: "whole" },
      { id: 353, name: "Greek yogurt", originalName: "Greek Yogurt", amount: 1, unit: "cup" },
      { id: 354, name: "honey", originalName: "Organic Honey", amount: 1, unit: "tbsp" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Scoop Greek yogurt into your breakfast bowl.", equipment: [{ name: "bowl" }] },
          { number: 2, step: "Arrange sliced sweet banana rounds and slivered almonds on top.", equipment: [] },
          { number: 3, step: "Garnish with a drizzle of honey and serve cold.", equipment: [] }
        ]
      }
    ]
  },
  {
    id: 900037,
    title: "Bacon & Potato Skillet Crunch",
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 22,
    servings: 2,
    summary: "Comfort breakfast skillet of pan-seared cubed potatoes, crisp bacon bits, and sweet onions.",
    extendedIngredients: [
      { id: 361, name: "bacon", originalName: "Bacon strips", amount: 4, unit: "strips" },
      { id: 362, name: "potatoes", originalName: "Potatoes, cubed", amount: 2, unit: "medium" },
      { id: 363, name: "onions", originalName: "Yellow Onion, chopped", amount: 1, unit: "whole" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "In a pan, fry bacon until crispy; drain and crumble.", equipment: [{ name: "pan" }] },
          { number: 2, step: "In bacon grease, sauté cubed potatoes and chopped onions for 15 mins until crispy.", equipment: [{ name: "pan" }] },
          { number: 3, step: "Stir bacon crumbles back in and toss on high for 1 minute.", equipment: [] }
        ]
      }
    ]
  },
  {
    id: 900038,
    title: "Soy Garlic Fried Tofu Sauté",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 15,
    servings: 2,
    summary: "Seared organic tofu cubes glazed in extra virgin olive oil, soy sauce, and garlic.",
    extendedIngredients: [
      { id: 371, name: "tofu", originalName: "Organic Tofu, cubed", amount: 1, unit: "lb" },
      { id: 372, name: "garlic", originalName: "Garlic, minced", amount: 3, unit: "cloves" },
      { id: 373, name: "olive oil", originalName: "Olive Oil", amount: 1.5, unit: "tbsp" },
      { id: 374, name: "soy sauce", originalName: "Soy Sauce", amount: 2, unit: "tbsp" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Press organic tofu with a paper towel to remove water, cut into cubes.", equipment: [] },
          { number: 2, step: "Sauté tofu in hot oil inside a pan for 8 mins until all sides are crunchy.", equipment: [{ name: "pan" }] },
          { number: 3, step: "Add minced garlic and soy sauce; toss quick and cook 2 minutes.", equipment: [] }
        ]
      }
    ]
  },
  {
    id: 900039,
    title: "Garlic Butter Shrimp Pasta",
    image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 18,
    servings: 2,
    summary: "Seared shrimp tossed with pasta in lemon garlic butter sauce.",
    extendedIngredients: [
      { id: 381, name: "shrimp", originalName: "Clean Shrimp", amount: 1, unit: "cup" },
      { id: 382, name: "pasta", originalName: "Pasta", amount: 8, unit: "oz" },
      { id: 383, name: "garlic", originalName: "Garlic, minced", amount: 3, unit: "cloves" },
      { id: 384, name: "butter", originalName: "Butter", amount: 2, unit: "tbsp" },
      { id: 385, name: "lemon", originalName: "Lemon (juiced)", amount: 0.5, unit: "whole" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Cook pasta in boiling salted water; drain.", equipment: [{ name: "pot" }] },
          { number: 2, step: "Melt butter in a pan, sauté garlic, sear shrimp for 4 mins until pink.", equipment: [{ name: "pan" }] },
          { number: 3, step: "Add pasta, lemon juice, salt, and pepper; toss on low for 1 minute.", equipment: [] }
        ]
      }
    ]
  },
  {
    id: 900040,
    title: "Chicken Broccoli Rice Bake",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 25,
    servings: 3,
    summary: "Comfort baking pan filled with white rice, chicken breast cubes, broccoli florets, and cheddar.",
    extendedIngredients: [
      { id: 391, name: "chicken breast", originalName: "Chicken Breast, cooked & cubed", amount: 1.5, unit: "cups" },
      { id: 392, name: "broccoli", originalName: "Broccoli florets, steamed", amount: 1.5, unit: "cups" },
      { id: 393, name: "white rice", originalName: "White Rice, cooked", amount: 2, unit: "cups" },
      { id: 394, name: "cheddar cheese", originalName: "Cheddar Cheese, shredded", amount: 1, unit: "cup" },
      { id: 395, name: "milk", originalName: "Milk", amount: 0.5, unit: "cup" }
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "In a baking dish or deep skillet, combine cooked white rice, chicken pieces, steamed broccoli, and milk.", equipment: [] },
          { number: 2, step: "Top with grated cheddar cheese.", equipment: [] },
          { number: 3, step: "Bake or cook on very low covered for 10 minutes until cheese melted and bubbling.", equipment: [{ name: "skillet" }] }
        ]
      }
    ]
  }
];
