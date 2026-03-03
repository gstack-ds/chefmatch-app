/**
 * Seed script for populating the database with test chef profiles.
 *
 * Usage:
 *   npx ts-node scripts/seed-chefs.ts
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env (not the anon key).
 * Idempotent — skips chefs whose email already exists in auth.
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    'Missing env vars. Set EXPO_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env',
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TEST_PASSWORD = 'TestPassword123!';

interface SeedChef {
  email: string;
  displayName: string;
  tier: 'classically_trained' | 'home_chef';
  bio: string;
  cuisines: string[];
  serviceModels: ('full_service' | 'collaborative')[];
  priceMin: number;
  priceMax: number;
  menuItems: { name: string; description: string; price: number; allergens: string[] }[];
  availability: { dayOfWeek: number; startTime: string; endTime: string }[];
}

const SEED_CHEFS: SeedChef[] = [
  {
    email: 'chef1@chefmatch-test.com',
    displayName: 'Marco Bellini',
    tier: 'classically_trained',
    bio: 'Le Cordon Bleu graduate with 12 years in fine dining. Specializing in Northern Italian cuisine with a modern twist.',
    cuisines: ['Italian', 'Mediterranean', 'French'],
    serviceModels: ['full_service'],
    priceMin: 85,
    priceMax: 180,
    menuItems: [
      { name: 'Truffle Risotto', description: 'Carnaroli rice with black truffle and aged Parmigiano', price: 45, allergens: ['Milk'] },
      { name: 'Osso Buco', description: 'Braised veal shanks with gremolata and saffron risotto', price: 52, allergens: [] },
      { name: 'Tiramisu', description: 'Classic layered espresso and mascarpone dessert', price: 18, allergens: ['Milk', 'Eggs', 'Wheat'] },
      { name: 'Burrata Caprese', description: 'Fresh burrata with heirloom tomatoes and basil oil', price: 22, allergens: ['Milk'] },
    ],
    availability: [
      { dayOfWeek: 5, startTime: '17:00', endTime: '22:00' },
      { dayOfWeek: 6, startTime: '16:00', endTime: '23:00' },
      { dayOfWeek: 0, startTime: '11:00', endTime: '20:00' },
    ],
  },
  {
    email: 'chef2@chefmatch-test.com',
    displayName: 'Yuki Tanaka',
    tier: 'classically_trained',
    bio: 'Trained in Tokyo for 8 years under a Michelin-starred sushi master. Bringing authentic Japanese flavors to your home.',
    cuisines: ['Japanese', 'Seafood'],
    serviceModels: ['full_service'],
    priceMin: 100,
    priceMax: 200,
    menuItems: [
      { name: 'Omakase Sushi (12pc)', description: 'Chef\'s selection of premium nigiri and maki', price: 85, allergens: ['Fish', 'Shellfish', 'Soybeans', 'Sesame'] },
      { name: 'Wagyu Tataki', description: 'Seared A5 wagyu with ponzu and microgreens', price: 55, allergens: ['Soybeans'] },
      { name: 'Miso Black Cod', description: '48-hour marinated black cod, grilled to perfection', price: 42, allergens: ['Fish', 'Soybeans'] },
      { name: 'Matcha Panna Cotta', description: 'Creamy matcha dessert with azuki bean compote', price: 16, allergens: ['Milk'] },
      { name: 'Tempura Platter', description: 'Lightly battered seasonal vegetables and shrimp', price: 32, allergens: ['Shellfish', 'Wheat', 'Eggs'] },
    ],
    availability: [
      { dayOfWeek: 4, startTime: '18:00', endTime: '22:00' },
      { dayOfWeek: 5, startTime: '18:00', endTime: '22:00' },
      { dayOfWeek: 6, startTime: '17:00', endTime: '23:00' },
    ],
  },
  {
    email: 'chef3@chefmatch-test.com',
    displayName: 'Sofia Reyes',
    tier: 'classically_trained',
    bio: 'CIA graduate specializing in contemporary Mexican cuisine. I blend traditional techniques with modern plating and seasonal ingredients.',
    cuisines: ['Mexican', 'Latin American'],
    serviceModels: ['full_service', 'collaborative'],
    priceMin: 75,
    priceMax: 160,
    menuItems: [
      { name: 'Mole Negro', description: 'Complex 30-ingredient Oaxacan mole with free-range chicken', price: 38, allergens: ['Tree Nuts', 'Sesame'] },
      { name: 'Ceviche Trio', description: 'Shrimp, tuna, and scallop ceviches with plantain chips', price: 28, allergens: ['Fish', 'Shellfish'] },
      { name: 'Churros con Chocolate', description: 'Crispy churros with Mexican hot chocolate dipping sauce', price: 14, allergens: ['Wheat', 'Milk', 'Eggs'] },
      { name: 'Carnitas Tacos', description: 'Slow-roasted pork shoulder with pickled onion and salsa verde', price: 24, allergens: [] },
    ],
    availability: [
      { dayOfWeek: 5, startTime: '16:00', endTime: '22:00' },
      { dayOfWeek: 6, startTime: '14:00', endTime: '22:00' },
      { dayOfWeek: 0, startTime: '12:00', endTime: '19:00' },
      { dayOfWeek: 3, startTime: '17:00', endTime: '21:00' },
    ],
  },
  {
    email: 'chef4@chefmatch-test.com',
    displayName: 'Priya Sharma',
    tier: 'classically_trained',
    bio: 'Trained at the Institute of Hotel Management in Mumbai. Bringing the full spectrum of Indian regional cuisines to your dining table.',
    cuisines: ['Indian', 'Middle Eastern'],
    serviceModels: ['full_service'],
    priceMin: 80,
    priceMax: 170,
    menuItems: [
      { name: 'Butter Chicken', description: 'Tender tandoori chicken in rich tomato-cream gravy', price: 32, allergens: ['Milk', 'Tree Nuts'] },
      { name: 'Lamb Biryani', description: 'Hyderabadi-style layered rice with slow-cooked lamb', price: 38, allergens: ['Tree Nuts'] },
      { name: 'Paneer Tikka Platter', description: 'Grilled spiced paneer with mint chutney and naan', price: 24, allergens: ['Milk', 'Wheat'] },
      { name: 'Gulab Jamun', description: 'Golden milk dumplings in rose-cardamom syrup', price: 12, allergens: ['Milk', 'Wheat'] },
      { name: 'Dal Makhani', description: 'Slow-simmered black lentils with butter and cream', price: 20, allergens: ['Milk'] },
    ],
    availability: [
      { dayOfWeek: 5, startTime: '17:00', endTime: '22:00' },
      { dayOfWeek: 6, startTime: '16:00', endTime: '22:00' },
    ],
  },
  {
    email: 'chef5@chefmatch-test.com',
    displayName: 'Jean-Pierre Dubois',
    tier: 'classically_trained',
    bio: 'Former sous chef at a 2-star Michelin restaurant in Lyon. Classic French technique meets seasonal American ingredients.',
    cuisines: ['French', 'Farm-to-Table'],
    serviceModels: ['full_service'],
    priceMin: 120,
    priceMax: 200,
    menuItems: [
      { name: 'Duck Confit', description: 'Slow-cooked duck leg with lentils du Puy and cherry gastrique', price: 48, allergens: [] },
      { name: 'Bouillabaisse', description: 'Provençal seafood stew with rouille and gruyère croutons', price: 52, allergens: ['Fish', 'Shellfish', 'Milk', 'Wheat'] },
      { name: 'Crème Brûlée', description: 'Vanilla bean custard with caramelized sugar crust', price: 16, allergens: ['Milk', 'Eggs'] },
    ],
    availability: [
      { dayOfWeek: 5, startTime: '18:00', endTime: '23:00' },
      { dayOfWeek: 6, startTime: '18:00', endTime: '23:00' },
      { dayOfWeek: 0, startTime: '10:00', endTime: '15:00' },
    ],
  },
  {
    email: 'chef6@chefmatch-test.com',
    displayName: 'Mama June Williams',
    tier: 'home_chef',
    bio: 'Third-generation Southern cook. My grandma\'s recipes have been feeding families for decades — now let me bring them to yours.',
    cuisines: ['Southern / Soul Food', 'BBQ / Grilling', 'American'],
    serviceModels: ['full_service', 'collaborative'],
    priceMin: 30,
    priceMax: 55,
    menuItems: [
      { name: 'Smoked Brisket Plate', description: '14-hour smoked brisket with mac & cheese and collard greens', price: 28, allergens: ['Milk', 'Wheat'] },
      { name: 'Fried Chicken & Waffles', description: 'Buttermilk fried chicken with homemade waffles and honey butter', price: 22, allergens: ['Milk', 'Eggs', 'Wheat'] },
      { name: 'Peach Cobbler', description: 'Warm peach cobbler with vanilla bean ice cream', price: 12, allergens: ['Milk', 'Eggs', 'Wheat'] },
      { name: 'Shrimp & Grits', description: 'Cajun shrimp over creamy stone-ground grits', price: 24, allergens: ['Shellfish', 'Milk'] },
    ],
    availability: [
      { dayOfWeek: 5, startTime: '16:00', endTime: '21:00' },
      { dayOfWeek: 6, startTime: '12:00', endTime: '21:00' },
      { dayOfWeek: 0, startTime: '12:00', endTime: '18:00' },
    ],
  },
  {
    email: 'chef7@chefmatch-test.com',
    displayName: 'Somchai Pakdee',
    tier: 'home_chef',
    bio: 'Born and raised in Chiang Mai. I cook the real Thai food my family taught me — no shortcuts, all heart.',
    cuisines: ['Thai', 'Vietnamese'],
    serviceModels: ['collaborative'],
    priceMin: 25,
    priceMax: 45,
    menuItems: [
      { name: 'Pad Thai', description: 'Rice noodles with shrimp, tofu, peanuts, and tamarind sauce', price: 18, allergens: ['Peanuts', 'Shellfish', 'Soybeans', 'Eggs'] },
      { name: 'Green Curry', description: 'Coconut green curry with Thai basil, bamboo, and jasmine rice', price: 20, allergens: ['Fish'] },
      { name: 'Tom Yum Goong', description: 'Spicy and sour shrimp soup with lemongrass and galangal', price: 16, allergens: ['Shellfish', 'Fish'] },
      { name: 'Mango Sticky Rice', description: 'Sweet coconut sticky rice with fresh mango', price: 10, allergens: [] },
      { name: 'Spring Rolls', description: 'Fresh rice paper rolls with shrimp, herbs, and peanut sauce', price: 14, allergens: ['Shellfish', 'Peanuts'] },
    ],
    availability: [
      { dayOfWeek: 4, startTime: '17:00', endTime: '21:00' },
      { dayOfWeek: 5, startTime: '17:00', endTime: '21:00' },
      { dayOfWeek: 6, startTime: '15:00', endTime: '21:00' },
      { dayOfWeek: 0, startTime: '15:00', endTime: '20:00' },
    ],
  },
  {
    email: 'chef8@chefmatch-test.com',
    displayName: 'Mike "Pitmaster" Johnson',
    tier: 'home_chef',
    bio: 'Competition BBQ winner for 5 years running. Low and slow is the only way I know. Let me smoke up something special for your next event.',
    cuisines: ['BBQ / Grilling', 'American', 'Cajun / Creole'],
    serviceModels: ['full_service'],
    priceMin: 35,
    priceMax: 60,
    menuItems: [
      { name: 'Full Rack of Ribs', description: 'St. Louis-style spare ribs with house dry rub and smoky glaze', price: 35, allergens: [] },
      { name: 'Pulled Pork Sliders', description: 'Hickory-smoked pork shoulder on brioche buns with slaw', price: 20, allergens: ['Wheat', 'Eggs'] },
      { name: 'Smoked Wings', description: 'Applewood smoked chicken wings with Alabama white sauce', price: 16, allergens: ['Eggs'] },
      { name: 'Cornbread', description: 'Cast-iron skillet cornbread with honey butter', price: 8, allergens: ['Milk', 'Eggs', 'Wheat'] },
    ],
    availability: [
      { dayOfWeek: 6, startTime: '12:00', endTime: '21:00' },
      { dayOfWeek: 0, startTime: '12:00', endTime: '20:00' },
    ],
  },
  {
    email: 'chef9@chefmatch-test.com',
    displayName: 'Min-ji Park',
    tier: 'home_chef',
    bio: 'Korean home cook sharing the flavors I grew up with. From kimchi jjigae to Korean BBQ, I make everything from scratch.',
    cuisines: ['Korean', 'Japanese'],
    serviceModels: ['full_service', 'collaborative'],
    priceMin: 28,
    priceMax: 50,
    menuItems: [
      { name: 'Korean BBQ Spread', description: 'Bulgogi, galbi, and samgyeopsal with banchan and ssamjang', price: 35, allergens: ['Soybeans', 'Sesame', 'Wheat'] },
      { name: 'Kimchi Jjigae', description: 'Fermented kimchi stew with pork belly and tofu', price: 18, allergens: ['Soybeans', 'Fish', 'Shellfish'] },
      { name: 'Japchae', description: 'Sweet potato glass noodles with vegetables and beef', price: 16, allergens: ['Soybeans', 'Sesame', 'Wheat'] },
      { name: 'Tteokbokki', description: 'Spicy rice cakes in gochujang sauce with fish cakes', price: 14, allergens: ['Wheat', 'Fish'] },
      { name: 'Hotteok', description: 'Sweet Korean pancakes filled with brown sugar, cinnamon, and nuts', price: 10, allergens: ['Wheat', 'Tree Nuts'] },
    ],
    availability: [
      { dayOfWeek: 5, startTime: '17:00', endTime: '22:00' },
      { dayOfWeek: 6, startTime: '16:00', endTime: '22:00' },
      { dayOfWeek: 0, startTime: '16:00', endTime: '21:00' },
    ],
  },
  {
    email: 'chef10@chefmatch-test.com',
    displayName: 'Elena Papadopoulos',
    tier: 'home_chef',
    bio: 'Greek-American home cook passionate about Mediterranean flavors. Fresh ingredients, olive oil, and love in every dish.',
    cuisines: ['Mediterranean', 'Greek', 'Italian'],
    serviceModels: ['full_service', 'collaborative'],
    priceMin: 30,
    priceMax: 55,
    menuItems: [
      { name: 'Moussaka', description: 'Layers of eggplant, spiced lamb, and creamy béchamel', price: 26, allergens: ['Milk', 'Wheat', 'Eggs'] },
      { name: 'Grilled Lamb Chops', description: 'Herb-marinated lamb chops with tzatziki and roasted vegetables', price: 32, allergens: ['Milk'] },
      { name: 'Spanakopita', description: 'Flaky phyllo pastry with spinach and feta filling', price: 14, allergens: ['Wheat', 'Milk', 'Eggs'] },
      { name: 'Baklava', description: 'Layers of phyllo, walnuts, and pistachio with honey syrup', price: 12, allergens: ['Wheat', 'Tree Nuts'] },
    ],
    availability: [
      { dayOfWeek: 4, startTime: '17:00', endTime: '21:00' },
      { dayOfWeek: 5, startTime: '17:00', endTime: '22:00' },
      { dayOfWeek: 6, startTime: '14:00', endTime: '22:00' },
    ],
  },
];

async function seedChefs() {
  console.log('Starting chef seed...\n');

  for (const chef of SEED_CHEFS) {
    // Check if user already exists by listing users and checking email
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users.find((u) => u.email === chef.email);

    if (existingUser) {
      console.log(`  [SKIP] ${chef.displayName} (${chef.email}) — already exists`);
      continue;
    }

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: chef.email,
      password: TEST_PASSWORD,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      console.error(`  [FAIL] ${chef.displayName} — auth create failed:`, authError?.message);
      continue;
    }

    const userId = authData.user.id;

    // 2. Insert into users table
    const { error: userError } = await supabase.from('users').insert({
      id: userId,
      email: chef.email,
      display_name: chef.displayName,
      role: 'chef',
    });

    if (userError) {
      console.error(`  [FAIL] ${chef.displayName} — users insert failed:`, userError.message);
      continue;
    }

    // 3. Insert chef profile
    const { data: profileData, error: profileError } = await supabase
      .from('chef_profiles')
      .insert({
        user_id: userId,
        tier: chef.tier,
        bio: chef.bio,
        cuisine_specialties: chef.cuisines,
        service_models: chef.serviceModels,
        price_range_min: chef.priceMin,
        price_range_max: chef.priceMax,
        is_live: true,
        background_check_status: 'passed',
        training_completed: true,
        photos: [],
        allergens_cant_accommodate: [],
        service_radius: 25,
      })
      .select('id')
      .single();

    if (profileError || !profileData) {
      console.error(`  [FAIL] ${chef.displayName} — chef_profiles insert failed:`, profileError?.message);
      continue;
    }

    const chefId = profileData.id;

    // 4. Insert menu items
    const menuRows = chef.menuItems.map((item, i) => ({
      chef_id: chefId,
      name: item.name,
      description: item.description,
      price: item.price,
      allergens: item.allergens,
      is_available: true,
      sort_order: i,
    }));

    const { error: menuError } = await supabase.from('menu_items').insert(menuRows);

    if (menuError) {
      console.error(`  [WARN] ${chef.displayName} — menu_items insert failed:`, menuError.message);
    }

    // 5. Insert availability
    const availRows = chef.availability.map((slot) => ({
      chef_id: chefId,
      day_of_week: slot.dayOfWeek,
      start_time: slot.startTime,
      end_time: slot.endTime,
    }));

    const { error: availError } = await supabase.from('chef_availability').insert(availRows);

    if (availError) {
      console.error(`  [WARN] ${chef.displayName} — availability insert failed:`, availError.message);
    }

    console.log(`  [OK] ${chef.displayName} (${chef.tier}) — ${chef.menuItems.length} menu items, ${chef.availability.length} availability slots`);
  }

  console.log('\nSeed complete.');
}

seedChefs().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
