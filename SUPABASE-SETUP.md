# Butter Supabase setup

## 1. Create the database and storage rules

1. Open Supabase Dashboard → **SQL Editor**.
2. Run every statement from `supabase-schema.sql`.
3. Open **Authentication → Users → Add user**.
4. Create the admin email and password used by `admin.html`.
5. Re-run the full `supabase-schema.sql` after pulling the QRIS proof update. It creates the public `payment-proofs` bucket used to generate proof image URLs.

## 2. Connect the static site

Open `supabase-config.js` and replace the two placeholders with:

- **Project URL:** Supabase Dashboard → Project Settings → API → Project URL
- **Anon key:** Supabase Dashboard → Project Settings → API → Publishable/anon key

The browser config may contain the anon key. It must never contain `service_role`.

## 3. Test

1. Open `admin.html`.
2. Login with the Supabase admin user.
3. Upload one product.
4. Open the catalog on another phone.

The product and image now come from Supabase, not from browser `localStorage`.
