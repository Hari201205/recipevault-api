// Mock seed data – used on first load if localStorage is empty.
// Demonstrates a realistic data shape matching the RecipeVault API schema.

export const MOCK_RECIPES = [
  {
    id: 1,
    title: 'Spaghetti Carbonara',
    description:
      'A classic Roman pasta dish made with eggs, hard cheese, cured pork, and black pepper. Rich, creamy, and absolutely no cream needed.',
    category: 'Italian',
    prep_time: 10,
    cook_time: 20,
    servings: 2,
    created_at: '2025-11-10T08:30:00Z',
    ingredients: [
      { id: 1, name: 'Spaghetti',        quantity: 200,  unit: 'g',    notes: 'or rigatoni' },
      { id: 2, name: 'Pancetta',         quantity: 100,  unit: 'g',    notes: 'guanciale if available' },
      { id: 3, name: 'Egg yolks',        quantity: 3,    unit: '',     notes: 'room temperature' },
      { id: 4, name: 'Pecorino Romano',  quantity: 50,   unit: 'g',    notes: 'finely grated' },
      { id: 5, name: 'Black pepper',     quantity: 1,    unit: 'tsp',  notes: 'freshly cracked' },
    ],
  },
  {
    id: 2,
    title: 'Chicken Tikka Masala',
    description:
      'Tender chicken marinated in yoghurt and spices, grilled then simmered in a fragrant tomato-cream sauce. A crowd favourite for good reason.',
    category: 'Indian',
    prep_time: 30,
    cook_time: 45,
    servings: 4,
    created_at: '2025-11-15T12:00:00Z',
    ingredients: [
      { id: 6,  name: 'Chicken breast',   quantity: 600,  unit: 'g',    notes: 'cut into chunks' },
      { id: 7,  name: 'Plain yoghurt',    quantity: 150,  unit: 'ml',   notes: 'for marinade' },
      { id: 8,  name: 'Garam masala',     quantity: 2,    unit: 'tsp',  notes: '' },
      { id: 9,  name: 'Crushed tomatoes', quantity: 400,  unit: 'g',    notes: '1 can' },
      { id: 10, name: 'Heavy cream',      quantity: 100,  unit: 'ml',   notes: '' },
      { id: 11, name: 'Garlic cloves',    quantity: 4,    unit: '',     notes: 'minced' },
      { id: 12, name: 'Fresh ginger',     quantity: 1,    unit: 'tbsp', notes: 'grated' },
    ],
  },
  {
    id: 3,
    title: 'Classic Caesar Salad',
    description:
      'Crisp romaine lettuce with a punchy anchovy-based dressing, house-made croutons, and a generous shower of Parmesan. Simple perfection.',
    category: 'American',
    prep_time: 20,
    cook_time: 0,
    servings: 3,
    created_at: '2025-11-22T09:15:00Z',
    ingredients: [
      { id: 13, name: 'Romaine lettuce',  quantity: 1,    unit: 'head', notes: 'torn into pieces' },
      { id: 14, name: 'Parmesan',         quantity: 40,   unit: 'g',    notes: 'shaved' },
      { id: 15, name: 'Sourdough bread',  quantity: 2,    unit: 'slices', notes: 'for croutons' },
      { id: 16, name: 'Anchovy fillets',  quantity: 4,    unit: '',     notes: 'finely chopped' },
      { id: 17, name: 'Lemon juice',      quantity: 2,    unit: 'tbsp', notes: 'freshly squeezed' },
      { id: 18, name: 'Dijon mustard',    quantity: 1,    unit: 'tsp',  notes: '' },
    ],
  },
  {
    id: 4,
    title: 'Chocolate Lava Cake',
    description:
      'Individual molten chocolate cakes with a warm, gooey centre. Takes only 12 minutes to bake — the ultimate quick dessert that looks fancy.',
    category: 'Dessert',
    prep_time: 15,
    cook_time: 12,
    servings: 4,
    created_at: '2025-12-01T18:00:00Z',
    ingredients: [
      { id: 19, name: 'Dark chocolate',   quantity: 150,  unit: 'g',    notes: '70% cocoa' },
      { id: 20, name: 'Unsalted butter',  quantity: 100,  unit: 'g',    notes: 'plus extra for ramekins' },
      { id: 21, name: 'Eggs',             quantity: 2,    unit: '',     notes: '' },
      { id: 22, name: 'Egg yolks',        quantity: 2,    unit: '',     notes: '' },
      { id: 23, name: 'Caster sugar',     quantity: 60,   unit: 'g',    notes: '' },
      { id: 24, name: 'Plain flour',      quantity: 30,   unit: 'g',    notes: 'sifted' },
    ],
  },
  {
    id: 5,
    title: 'Pad Thai',
    description:
      'Street-food style stir-fried rice noodles with tofu or shrimp, egg, bean sprouts, and a tamarind-based sauce topped with crushed peanuts.',
    category: 'Asian',
    prep_time: 25,
    cook_time: 15,
    servings: 2,
    created_at: '2025-12-05T11:30:00Z',
    ingredients: [
      { id: 25, name: 'Rice noodles',     quantity: 200,  unit: 'g',    notes: 'soaked 30 min' },
      { id: 26, name: 'Firm tofu',        quantity: 150,  unit: 'g',    notes: 'or shrimp' },
      { id: 27, name: 'Tamarind paste',   quantity: 3,    unit: 'tbsp', notes: '' },
      { id: 28, name: 'Fish sauce',       quantity: 2,    unit: 'tbsp', notes: '' },
      { id: 29, name: 'Crushed peanuts',  quantity: 3,    unit: 'tbsp', notes: 'to garnish' },
      { id: 30, name: 'Bean sprouts',     quantity: 100,  unit: 'g',    notes: '' },
      { id: 31, name: 'Eggs',             quantity: 2,    unit: '',     notes: '' },
    ],
  },
]

export const CATEGORIES = [
  'Italian', 'Indian', 'American', 'Asian', 'Mexican',
  'Mediterranean', 'Dessert', 'Other',
]

// Map each category to an accent colour for card top bars
export const CATEGORY_COLORS = {
  Italian:       '#e07b39',
  Indian:        '#f0a500',
  American:      '#3b6fd4',
  Asian:         '#2da674',
  Mexican:       '#d45c3b',
  Mediterranean: '#3b8ecf',
  Dessert:       '#a855c8',
  Other:         '#7a8899',
}
