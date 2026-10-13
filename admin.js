const client = window.myClothSupabase;
const form = document.querySelector('#product-form');
const loginForm = document.querySelector('#login-form');
const fileInput = document.querySelector('#product-image');
const list = document.querySelector('#admin-list');
const count = document.querySelector('#admin-count');
const feedback = document.querySelector('#admin-feedback');
const loginFeedback = document.querySelector('#login-feedback');

function setLoggedIn(loggedIn) {
  loginForm.hidden = loggedIn;
  form.hidden = !loggedIn;
}

function render(products) {
  count.textContent = `${products.length} produk`;
  list.innerHTML = products.length ? products.map(product => `<article class="admin-product"><img src="${product.image}" alt="${product.name}" /><div><h3>${product.name}</h3><p>${product.type} · ${product.price} · Stok ${product.stock}</p><small>${product.description}</small></div><button class="delete-product" type="button" data-delete="${product.id}" aria-label="Hapus ${product.name}">Hapus</button></article>`).join('') : '<p class="admin-empty">Belum ada produk. Tambahkan produk pertama dari form.</p>';
}

async function loadProducts() {
  const { data, error } = await client.from('products').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  render(data);
}

function readImage(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) return reject(new Error('Pilih file gambar.'));
    if (file.size > 2 * 1024 * 1024) return reject(new Error('Ukuran gambar maksimal 2 MB.'));
    resolve(file);
  });
}

loginForm.addEventListener('submit', async event => {
  event.preventDefault();
  loginFeedback.textContent = '';
  if (!client) return loginFeedback.textContent = 'Isi URL dan anon key Supabase di supabase-config.js.';
  const data = new FormData(loginForm);
  const { error } = await client.auth.signInWithPassword({ email: data.get('email'), password: data.get('password') });
  if (error) return loginFeedback.textContent = error.message;
  setLoggedIn(true);
  await loadProducts();
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  feedback.textContent = '';
  try {
    const data = new FormData(form);
    const image = await readImage(fileInput.files[0]);
    const id = `product-${crypto.randomUUID()}`;
    const path = `${id}-${image.name.replace(/[^a-z0-9._-]/gi, '-')}`;
    const upload = await client.storage.from('product-images').upload(path, image, { contentType: image.type, upsert: false });
    if (upload.error) throw upload.error;
    const imageUrl = client.storage.from('product-images').getPublicUrl(path).data.publicUrl;
    const product = { id, name: String(data.get('name')).trim(), type: data.get('type'), price: String(data.get('price')).trim(), stock: Number(data.get('stock')), description: String(data.get('description')).trim(), image: imageUrl };
    const result = await client.from('products').insert(product);
    if (result.error) throw result.error;
    form.reset();
    feedback.textContent = 'Produk berhasil diterbitkan ke semua perangkat.';
    await loadProducts();
  } catch (error) {
    feedback.textContent = error.message;
  }
});

document.querySelector('#logout-button').addEventListener('click', async () => {
  await client.auth.signOut();
  setLoggedIn(false);
  list.innerHTML = '<p class="admin-empty">Login untuk melihat produk.</p>';
});

list.addEventListener('click', async event => {
  const button = event.target.closest('[data-delete]');
  if (!button) return;
  const { error } = await client.from('products').delete().eq('id', button.dataset.delete);
  feedback.textContent = error ? error.message : 'Produk dihapus dari katalog.';
  if (!error) await loadProducts();
});

(async () => {
  if (!client) return loginFeedback.textContent = 'Isi URL dan anon key Supabase di supabase-config.js.';
  const { data } = await client.auth.getSession();
  setLoggedIn(Boolean(data.session));
  if (data.session) await loadProducts();
})();
