import { createClient } from '@supabase/supabase-js';
import { mockProducts } from './src/data/mockProducts.js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Seeding database with mock products...");
  
  // Prepare data (remove id so supabase can auto-generate it if needed, or keep it. 
  // Let's remove the id so we don't conflict with the one the user just created, 
  // or we can just insert them and let Postgres handle it).
  // Actually, if the user created a product, it probably has id=1.
  // It's safer to delete 'id' from mockProducts before inserting, so Postgres serial handles it.
  const productsToInsert = mockProducts.map(p => {
    const { id, originalPrice, ...rest } = p;
    return {
      ...rest,
      originalprice: originalPrice
    };
  });

  const { data, error } = await supabase
    .from('products')
    .insert(productsToInsert);

  if (error) {
    console.error("Error inserting products:", error);
  } else {
    console.log("Successfully seeded", productsToInsert.length, "products!");
  }
}

seed();
