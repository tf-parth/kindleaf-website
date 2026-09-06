import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Supabase environment check
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// File-based fallback path
const MOCK_DB_PATH = path.join(process.cwd(), 'src/lib/mock_db.json');

// Helper to read local mock DB
function readMockDb() {
  try {
    if (!fs.existsSync(MOCK_DB_PATH)) {
      return { products: [], orders: [], customers: [], reviews: [], homepage_content: {}, settings: {}, media: [] };
    }
    const data = fs.readFileSync(MOCK_DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading mock database:', error);
    return { products: [], orders: [], customers: [], reviews: [], homepage_content: {}, settings: {}, media: [] };
  }
}

// Helper to write local mock DB
function writeMockDb(data: any) {
  try {
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing mock database:', error);
  }
}

// =========================================================
// DATA OPERATIONS (DYNAMIC BACKEND BRIDGE)
// =========================================================

// 1. PRODUCTS
export async function getProducts(includeDrafts = false) {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from('products').select('*');
    if (!includeDrafts) {
      query = query.eq('status', 'published');
    }
    query = query.order('display_order', { ascending: true }).order('created_at', { ascending: false });
    const { data, error } = await query;
    if (!error && data) return data;
    console.error('Supabase getProducts failed, falling back to mock:', error);
  }

  const list = readMockDb().products || [];
  const filtered = includeDrafts ? list : list.filter((p: any) => p.status === 'published');
  return [...filtered].sort((a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0));
}

export async function getProductBySlug(slug: string, includeDrafts = false) {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from('products').select('*').eq('slug', slug);
    if (!includeDrafts) {
      query = query.eq('status', 'published');
    }
    const { data, error } = await query.maybeSingle();
    if (!error && data) return data;
  }

  const list = readMockDb().products || [];
  const prod = list.find((p: any) => p.slug === slug);
  if (!prod) return null;
  if (!includeDrafts && prod.status !== 'published') return null;
  return prod;
}

export async function saveProduct(product: any) {
  const cleanProduct = {
    ...product,
    display_order: Number(product.display_order) || 0,
    amazon_button_enabled: Boolean(product.amazon_button_enabled),
    featured: Boolean(product.featured),
    status: product.status || 'published',
    updated_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    const isNew = !cleanProduct.id || String(cleanProduct.id).startsWith('mock-');
    const { id, ...prodData } = cleanProduct;
    
    let query;
    if (isNew) {
      query = supabase.from('products').insert([prodData]).select();
    } else {
      query = supabase.from('products').update(prodData).eq('id', id).select();
    }
    
    const { data, error } = await query;
    if (!error && data && data[0]) return data[0];
    throw new Error(error?.message || 'Supabase saveProduct failed');
  }

  // Mock DB operation
  const db = readMockDb();
  const index = db.products.findIndex((p: any) => p.id === cleanProduct.id);
  const updatedProduct = { ...cleanProduct };
  
  if (!updatedProduct.id || String(updatedProduct.id).startsWith('mock-')) {
    updatedProduct.id = 'mock-' + Math.random().toString(36).substr(2, 9);
    updatedProduct.created_at = new Date().toISOString();
    db.products.unshift(updatedProduct);
  } else {
    if (index !== -1) {
      db.products[index] = { ...db.products[index], ...updatedProduct };
    } else {
      db.products.unshift(updatedProduct);
    }
  }
  
  writeMockDb(db);
  return updatedProduct;
}

export async function deleteProduct(id: string) {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) return true;
    throw new Error(error.message);
  }

  const db = readMockDb();
  db.products = db.products.filter((p: any) => p.id !== id);
  writeMockDb(db);
  return true;
}

// 2. ORDERS
export async function getOrders() {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error && data) return data;
    console.error('Supabase getOrders failed, falling back to mock:', error);
  }
  return readMockDb().orders;
}

export async function saveOrder(order: any) {
  if (isSupabaseConfigured && supabase) {
    const { id, ...orderData } = order;
    const { data, error } = await supabase.from('orders').insert([orderData]).select();
    if (!error && data && data[0]) {
      // Also register or update customer record in Supabase
      const phone = order.customer_phone;
      if (phone) {
        const { data: custData } = await supabase.from('customers').select('*').eq('phone', phone);
        if (custData && custData.length > 0) {
          const updatedHistory = [...(custData[0].order_history || []), { orderId: data[0].id, date: new Date().toISOString(), total: order.total_price }];
          await supabase.from('customers').update({ order_history: updatedHistory }).eq('id', custData[0].id);
        } else {
          await supabase.from('customers').insert([{
            name: order.customer_name,
            email: order.customer_email || '',
            phone: phone,
            order_history: [{ orderId: data[0].id, date: new Date().toISOString(), total: order.total_price }]
          }]);
        }
      }
      return data[0];
    }
    throw new Error(error?.message || 'Supabase saveOrder failed');
  }

  const db = readMockDb();
  const newOrder = {
    id: 'ord-' + Math.random().toString(36).substr(2, 9),
    ...order,
    created_at: new Date().toISOString()
  };
  
  db.orders.unshift(newOrder);

  // Sync to Customers in Mock DB
  const phone = order.customer_phone;
  if (phone) {
    const custIndex = db.customers.findIndex((c: any) => c.phone === phone);
    const orderRef = { orderId: newOrder.id, date: newOrder.created_at, total: newOrder.total_price };
    if (custIndex !== -1) {
      db.customers[custIndex].order_history = [...(db.customers[custIndex].order_history || []), orderRef];
    } else {
      db.customers.push({
        id: 'cust-' + Math.random().toString(36).substr(2, 9),
        name: order.customer_name,
        email: order.customer_email || '',
        phone: phone,
        order_history: [orderRef],
        created_at: new Date().toISOString()
      });
    }
  }

  writeMockDb(db);
  return newOrder;
}

export async function updateOrderStatus(id: string, status: string) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select();
    if (!error && data && data[0]) return data[0];
    throw new Error(error?.message || 'Supabase updateOrderStatus failed');
  }

  const db = readMockDb();
  const index = db.orders.findIndex((o: any) => o.id === id);
  if (index !== -1) {
    db.orders[index].status = status;
    writeMockDb(db);
    return db.orders[index];
  }
  throw new Error('Order not found');
}

// 3. CUSTOMERS
export async function getCustomers() {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
    if (!error && data) return data;
    console.error('Supabase getCustomers failed, falling back to mock:', error);
  }
  return readMockDb().customers;
}

export async function registerCustomer(customer: any) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('customers').insert([{
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      order_history: []
    }]).select();
    if (!error && data && data[0]) return data[0];
    throw new Error(error?.message || 'Supabase customer profile creation failed');
  }

  const db = readMockDb();
  const existing = db.customers.find((c: any) => c.email?.toLowerCase() === customer.email?.toLowerCase());
  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  const newCustomer = {
    id: 'cust-' + Math.random().toString(36).substr(2, 9),
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    password: customer.password,
    order_history: [],
    created_at: new Date().toISOString()
  };

  db.customers.push(newCustomer);
  writeMockDb(db);

  const { password, ...safeCustomer } = newCustomer;
  return safeCustomer;
}

export async function authenticateCustomer(email: string, passwordInput: string) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('customers').select('*').eq('email', email).single();
    if (!error && data) return data;
    return { name: email.split('@')[0], email, phone: '' };
  }

  const db = readMockDb();
  const customer = db.customers.find(
    (c: any) => c.email?.toLowerCase() === email.toLowerCase() && c.password === passwordInput
  );
  if (!customer) {
    throw new Error('Invalid email or password.');
  }

  const { password, ...safeCustomer } = customer;
  return safeCustomer;
}


// 4. REVIEWS
export async function getReviews() {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (!error && data) return data;
    console.error('Supabase getReviews failed, falling back to mock:', error);
  }
  return readMockDb().reviews;
}

export async function saveReview(review: any) {
  if (isSupabaseConfigured && supabase) {
    const { id, ...reviewData } = review;
    const isNew = !id || id.startsWith('mock-');
    let query;
    if (isNew) {
      query = supabase.from('reviews').insert([reviewData]).select();
    } else {
      query = supabase.from('reviews').update(reviewData).eq('id', id).select();
    }
    const { data, error } = await query;
    if (!error && data && data[0]) return data[0];
    throw new Error(error?.message || 'Supabase saveReview failed');
  }

  const db = readMockDb();
  const newReview = { ...review };
  if (!newReview.id || newReview.id.startsWith('mock-')) {
    newReview.id = 'rev-' + Math.random().toString(36).substr(2, 9);
    newReview.created_at = new Date().toISOString();
    db.reviews.unshift(newReview);
  } else {
    const index = db.reviews.findIndex((r: any) => r.id === review.id);
    if (index !== -1) {
      db.reviews[index] = { ...db.reviews[index], ...newReview };
    } else {
      db.reviews.unshift(newReview);
    }
  }
  writeMockDb(db);
  return newReview;
}

export async function updateReviewStatus(id: string, field: 'approved' | 'featured', value: boolean) {
  if (isSupabaseConfigured && supabase) {
    const updatePayload = { [field]: value };
    const { data, error } = await supabase.from('reviews').update(updatePayload).eq('id', id).select();
    if (!error && data && data[0]) return data[0];
    throw new Error(error?.message || 'Supabase updateReviewStatus failed');
  }

  const db = readMockDb();
  const index = db.reviews.findIndex((r: any) => r.id === id);
  if (index !== -1) {
    db.reviews[index][field] = value;
    writeMockDb(db);
    return db.reviews[index];
  }
  throw new Error('Review not found');
}

export async function deleteReview(id: string) {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (!error) return true;
    throw new Error(error.message);
  }

  const db = readMockDb();
  db.reviews = db.reviews.filter((r: any) => r.id !== id);
  writeMockDb(db);
  return true;
}

// 5. HOMEPAGE CONTENT
export async function getHomepageContent() {
  const fallback = readMockDb().homepage_content || {};
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('homepage_content').select('*');
    if (!error && data && data.length > 0) {
      const contentMap: any = { ...fallback };
      data.forEach((row: any) => {
        contentMap[row.key] = row.content;
      });
      if (contentMap.homepage_content) {
        return { ...fallback, ...contentMap, ...contentMap.homepage_content };
      }
      return contentMap;
    }
    console.error('Supabase getHomepageContent failed, falling back to mock:', error);
  }
  return fallback;
}

export async function saveHomepageContent(sectionKey: string, content: any) {
  if (isSupabaseConfigured && supabase) {
    const { data: existing } = await supabase.from('homepage_content').select('id').eq('key', sectionKey);
    let query;
    if (existing && existing.length > 0) {
      query = supabase.from('homepage_content').update({ content, updated_at: new Date().toISOString() }).eq('key', sectionKey).select();
    } else {
      query = supabase.from('homepage_content').insert([{ key: sectionKey, content }]).select();
    }
    const { data, error } = await query;
    if (!error && data && data[0]) {
      const db = readMockDb();
      if (!db.homepage_content) db.homepage_content = {};
      db.homepage_content[sectionKey] = { ...db.homepage_content[sectionKey], ...content };
      writeMockDb(db);
      return data[0].content;
    }
    throw new Error(error?.message || 'Supabase saveHomepageContent failed');
  }

  const db = readMockDb();
  if (!db.homepage_content) db.homepage_content = {};
  db.homepage_content[sectionKey] = { ...db.homepage_content[sectionKey], ...content };
  writeMockDb(db);
  return db.homepage_content[sectionKey];
}

// 6. GLOBAL SETTINGS
export async function getSettings() {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('settings').select('*');
    if (!error && data) {
      const settingsMap: any = {};
      data.forEach((row: any) => {
        settingsMap[row.key] = row.value;
      });
      // if empty, return fallback mock
      if (Object.keys(settingsMap).length > 0) {
        return settingsMap;
      }
    }
    console.error('Supabase getSettings failed, falling back to mock:', error);
  }
  return readMockDb().settings;
}

export async function saveSettings(key: string, value: any) {
  if (isSupabaseConfigured && supabase) {
    const { data: existing } = await supabase.from('settings').select('id').eq('key', key);
    let query;
    if (existing && existing.length > 0) {
      query = supabase.from('settings').update({ value, updated_at: new Date().toISOString() }).eq('key', key).select();
    } else {
      query = supabase.from('settings').insert([{ key, value }]).select();
    }
    const { data, error } = await query;
    if (!error && data && data[0]) return data[0].value;
    throw new Error(error?.message || 'Supabase saveSettings failed');
  }

  const db = readMockDb();
  db.settings[key] = { ...db.settings[key], ...value };
  writeMockDb(db);
  return db.settings[key];
}

// 7. MEDIA LIBRARY
export async function getMedia() {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('media').select('*').order('created_at', { ascending: false });
    if (!error && data) return data;
    console.error('Supabase getMedia failed, falling back to mock:', error);
  }
  return readMockDb().media;
}

export async function addMedia(mediaItem: any) {
  if (isSupabaseConfigured && supabase) {
    const { id, ...mediaData } = mediaItem;
    const { data, error } = await supabase.from('media').insert([mediaData]).select();
    if (!error && data && data[0]) return data[0];
    throw new Error(error?.message || 'Supabase addMedia failed');
  }

  const db = readMockDb();
  const newItem = {
    id: 'media-' + Math.random().toString(36).substr(2, 9),
    ...mediaItem,
    created_at: new Date().toISOString()
  };
  db.media.unshift(newItem);
  writeMockDb(db);
  return newItem;
}

export async function deleteMedia(id: string) {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('media').delete().eq('id', id);
    if (!error) return true;
    throw new Error(error.message);
  }

  const db = readMockDb();
  db.media = db.media.filter((m: any) => m.id !== id);
  writeMockDb(db);
  return true;
}

// =========================================================
// 8. JOURNAL / BLOG ARTICLES
// =========================================================
function normalizeArticle(article: any) {
  if (!article) return null;
  const img = article.cover_image || article.coverImage || article.image || '/assets/hero_tea_cup.png';
  const readTime = article.read_time || article.readTime || '4 min read';
  return {
    ...article,
    cover_image: img,
    coverImage: img,
    image: img,
    read_time: readTime,
    readTime: readTime,
    status: article.status || 'published'
  };
}

export async function getJournalArticles(includeDrafts = false) {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from('journal_articles').select('*').order('created_at', { ascending: false });
    if (!includeDrafts) {
      query = query.eq('status', 'published');
    }
    const { data, error } = await query;
    if (!error && data) return data.map(normalizeArticle);
    console.error('Supabase getJournalArticles failed, falling back to mock:', error);
  }
  const db = readMockDb();
  const articles = db.journal_articles || [];
  const filtered = includeDrafts ? articles : articles.filter((a: any) => a.status === 'published');
  return filtered.map(normalizeArticle);
}

export async function getJournalArticleBySlug(slug: string, includeDrafts = false) {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from('journal_articles').select('*').eq('slug', slug);
    if (!includeDrafts) {
      query = query.eq('status', 'published');
    }
    const { data, error } = await query.maybeSingle();
    if (!error && data) return normalizeArticle(data);
  }
  const db = readMockDb();
  const found = (db.journal_articles || []).find((a: any) => a.slug === slug);
  if (!found) return null;
  if (!includeDrafts && found.status !== 'published') return null;
  return normalizeArticle(found);
}

export async function saveJournalArticle(article: any) {
  const cleanArticle = {
    ...article,
    cover_image: article.cover_image || article.coverImage || article.image || '/assets/hero_tea_cup.png',
    status: article.status || 'published',
    updated_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    const isNew = !cleanArticle.id || String(cleanArticle.id).startsWith('art-');
    const { id, coverImage, image, readTime, ...artData } = cleanArticle;
    let query;
    if (isNew) {
      query = supabase.from('journal_articles').insert([artData]).select();
    } else {
      query = supabase.from('journal_articles').update(artData).eq('id', id).select();
    }
    const { data, error } = await query;
    if (!error && data && data[0]) return normalizeArticle(data[0]);
    console.error('Supabase saveJournalArticle error:', error);
  }

  const db = readMockDb();
  if (!db.journal_articles) db.journal_articles = [];
  const idx = db.journal_articles.findIndex((a: any) => a.id === article.id);
  if (idx >= 0) {
    db.journal_articles[idx] = { ...db.journal_articles[idx], ...article, updated_at: new Date().toISOString() };
    writeMockDb(db);
    return db.journal_articles[idx];
  } else {
    const newArticle = {
      ...article,
      id: article.id || 'art-' + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    db.journal_articles.unshift(newArticle);
    writeMockDb(db);
    return newArticle;
  }
}

export async function deleteJournalArticle(id: string) {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('journal_articles').delete().eq('id', id);
    if (!error) return true;
  }
  const db = readMockDb();
  db.journal_articles = (db.journal_articles || []).filter((a: any) => a.id !== id);
  writeMockDb(db);
  return true;
}

// =========================================================
// 9. BOTANICAL INGREDIENTS
// =========================================================
export async function getIngredients(includeDrafts = false) {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from('ingredients').select('*').order('display_order', { ascending: true });
    if (!includeDrafts) {
      query = query.eq('status', 'published');
    }
    const { data, error } = await query;
    if (!error && data) return data;
  }
  const db = readMockDb();
  const list = db.ingredients || [];
  if (includeDrafts) return list;
  return list.filter((i: any) => i.status === 'published');
}

export async function saveIngredient(ingredient: any) {
  if (isSupabaseConfigured && supabase) {
    const isNew = !ingredient.id || ingredient.id.startsWith('ing-');
    const { id, ...ingData } = ingredient;
    let query;
    if (isNew) {
      query = supabase.from('ingredients').insert([ingData]).select();
    } else {
      query = supabase.from('ingredients').update(ingData).eq('id', id).select();
    }
    const { data, error } = await query;
    if (!error && data && data[0]) return data[0];
  }
  const db = readMockDb();
  if (!db.ingredients) db.ingredients = [];
  const idx = db.ingredients.findIndex((i: any) => i.id === ingredient.id);
  if (idx >= 0) {
    db.ingredients[idx] = { ...db.ingredients[idx], ...ingredient };
    writeMockDb(db);
    return db.ingredients[idx];
  } else {
    const newIng = {
      ...ingredient,
      id: ingredient.id || 'ing-' + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };
    db.ingredients.push(newIng);
    writeMockDb(db);
    return newIng;
  }
}

export async function deleteIngredient(id: string) {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('ingredients').delete().eq('id', id);
    if (!error) return true;
  }
  const db = readMockDb();
  db.ingredients = (db.ingredients || []).filter((i: any) => i.id !== id);
  writeMockDb(db);
  return true;
}

// =========================================================
// 10. FAQS
// =========================================================
export async function getFaqs(includeDrafts = false) {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from('faqs').select('*').order('display_order', { ascending: true });
    if (!includeDrafts) {
      query = query.eq('status', 'published');
    }
    const { data, error } = await query;
    if (!error && data) return data;
  }
  const db = readMockDb();
  const list = db.faqs || [];
  if (includeDrafts) return list;
  return list.filter((f: any) => f.status === 'published');
}

export async function saveFaq(faq: any) {
  if (isSupabaseConfigured && supabase) {
    const isNew = !faq.id || faq.id.startsWith('faq-');
    const { id, ...faqData } = faq;
    let query;
    if (isNew) {
      query = supabase.from('faqs').insert([faqData]).select();
    } else {
      query = supabase.from('faqs').update(faqData).eq('id', id).select();
    }
    const { data, error } = await query;
    if (!error && data && data[0]) return data[0];
  }
  const db = readMockDb();
  if (!db.faqs) db.faqs = [];
  const idx = db.faqs.findIndex((f: any) => f.id === faq.id);
  if (idx >= 0) {
    db.faqs[idx] = { ...db.faqs[idx], ...faq };
    writeMockDb(db);
    return db.faqs[idx];
  } else {
    const newFaq = {
      ...faq,
      id: faq.id || 'faq-' + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };
    db.faqs.push(newFaq);
    writeMockDb(db);
    return newFaq;
  }
}

export async function deleteFaq(id: string) {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('faqs').delete().eq('id', id);
    if (!error) return true;
  }
  const db = readMockDb();
  db.faqs = (db.faqs || []).filter((f: any) => f.id !== id);
  writeMockDb(db);
  return true;
}

// =========================================================
// 11. OFFERS & BANNERS
// =========================================================
export async function getOffers(includeAll = false) {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from('offers').select('*').order('priority', { ascending: true });
    if (!includeAll) {
      query = query.eq('active', true).eq('status', 'published');
    }
    const { data, error } = await query;
    if (!error && data) return data;
  }
  const db = readMockDb();
  const list = db.offers || [];
  if (includeAll) return list;
  return list.filter((o: any) => o.active && o.status === 'published');
}

export async function saveOffer(offer: any) {
  if (isSupabaseConfigured && supabase) {
    const isNew = !offer.id || offer.id.startsWith('off-');
    const { id, ...offData } = offer;
    let query;
    if (isNew) {
      query = supabase.from('offers').insert([offData]).select();
    } else {
      query = supabase.from('offers').update(offData).eq('id', id).select();
    }
    const { data, error } = await query;
    if (!error && data && data[0]) return data[0];
  }
  const db = readMockDb();
  if (!db.offers) db.offers = [];
  const idx = db.offers.findIndex((o: any) => o.id === offer.id);
  if (idx >= 0) {
    db.offers[idx] = { ...db.offers[idx], ...offer };
    writeMockDb(db);
    return db.offers[idx];
  } else {
    const newOffer = {
      ...offer,
      id: offer.id || 'off-' + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };
    db.offers.unshift(newOffer);
    writeMockDb(db);
    return newOffer;
  }
}

export async function deleteOffer(id: string) {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('offers').delete().eq('id', id);
    if (!error) return true;
  }
  const db = readMockDb();
  db.offers = (db.offers || []).filter((o: any) => o.id !== id);
  writeMockDb(db);
  return true;
}

// =========================================================
// SECTION SETTINGS HELPER (SUPABASE + MOCK FALLBACK)
// =========================================================
async function getSectionSetting(key: string, fallbackKey: string) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('settings').select('value').eq('key', key).maybeSingle();
    if (!error && data?.value && Object.keys(data.value).length > 0) {
      return data.value;
    }
  }
  const db = readMockDb();
  return db[fallbackKey] || {};
}

async function saveSectionSetting(key: string, fallbackKey: string, value: any) {
  if (isSupabaseConfigured && supabase) {
    const { data: existing } = await supabase.from('settings').select('id').eq('key', key);
    let query;
    if (existing && existing.length > 0) {
      query = supabase.from('settings').update({ value, updated_at: new Date().toISOString() }).eq('key', key).select();
    } else {
      query = supabase.from('settings').insert([{ key, value }]).select();
    }
    const { data, error } = await query;
    if (!error && data && data[0]) {
      const db = readMockDb();
      db[fallbackKey] = { ...db[fallbackKey], ...value };
      writeMockDb(db);
      return data[0].value;
    }
  }

  const db = readMockDb();
  db[fallbackKey] = { ...db[fallbackKey], ...value };
  writeMockDb(db);
  return db[fallbackKey];
}

// 12. BREWING GUIDE CONTENT
export async function getBrewingContent() {
  return getSectionSetting('brewing_guide', 'brewing_guide');
}

export async function saveBrewingContent(content: any) {
  return saveSectionSetting('brewing_guide', 'brewing_guide', content);
}

// 13. OUR STORY CONTENT
export async function getOurStoryContent() {
  return getSectionSetting('our_story', 'our_story');
}

export async function saveOurStoryContent(content: any) {
  return saveSectionSetting('our_story', 'our_story', content);
}

// 14. LEGAL CONTENT
export async function getLegalContent() {
  return getSectionSetting('legal_content', 'legal_content');
}

export async function saveLegalContent(content: any) {
  return saveSectionSetting('legal_content', 'legal_content', content);
}

// 15. SEO SETTINGS
export async function getSeoSettings() {
  return getSectionSetting('seo_settings', 'seo_settings');
}

export async function saveSeoSettings(seo: any) {
  return saveSectionSetting('seo_settings', 'seo_settings', seo);
}

// 16. APP SETTINGS
export async function getAppSettings() {
  return getSectionSetting('app_settings', 'app_settings');
}

export async function saveAppSettings(appSettings: any) {
  return saveSectionSetting('app_settings', 'app_settings', appSettings);
}

// 17. SOCIAL LINKS
export async function getSocialLinks() {
  return getSectionSetting('social_links', 'social_links');
}

export async function saveSocialLinks(links: any) {
  return saveSectionSetting('social_links', 'social_links', links);
}

