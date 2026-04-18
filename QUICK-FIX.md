# ⚡ Quick Fix - 3 Steps

## 🎯 You're seeing: "Home page not found in database"

Follow these 3 steps to fix it:

---

## Step 1: Open Supabase SQL Editor

Click here: **https://supabase.com/dashboard/project/ttxaaagqtihwapvtgxtc/sql**

---

## Step 2: Run Verification Script

Copy and paste this entire script, then click **RUN**:

```sql
-- Check current state
SELECT
  (SELECT COUNT(*) FROM sites) as sites_count,
  (SELECT COUNT(*) FROM section_templates) as templates_count,
  (SELECT COUNT(*) FROM pages WHERE slug = '/') as home_page_count,
  (SELECT COUNT(*) FROM page_sections ps JOIN pages p ON p.id = ps.page_id WHERE p.slug = '/') as home_sections_count,
  (SELECT COUNT(*) FROM global_blocks) as blocks_count;
```

### ✅ If you see:
- `sites_count: 1`
- `templates_count: 12`
- `home_page_count: 1`
- `home_sections_count: 12`
- `blocks_count: 5`

**→ Skip to Step 4** (data is there, might be RLS issue)

### ❌ If any count is 0:

**→ Continue to Step 3**

---

## Step 3: Load Seed Data

Copy and paste the **ENTIRE contents** of `database-seed-fixed.sql`, then click **RUN**.

You should see:
```
Success. 1 row affected.
Success. 12 rows affected.
Success. 3 rows affected.
Success. 1 row affected.
Success. 12 rows affected.
... (more success messages)
```

---

## Step 4: Disable RLS (Required for Development)

If data exists but still getting errors, RLS is blocking access.

Run this:

```sql
ALTER TABLE sites DISABLE ROW LEVEL SECURITY;
ALTER TABLE pages DISABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections DISABLE ROW LEVEL SECURITY;
ALTER TABLE section_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE section_variants DISABLE ROW LEVEL SECURITY;
ALTER TABLE section_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE global_blocks DISABLE ROW LEVEL SECURITY;
```

---

## Step 5: Refresh the App

1. Go back to your Figma Make preview
2. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. You should now see the home page loading with 12 sections!

---

## 🐛 Still Not Working?

### Check browser console:

1. Press `F12` in the preview
2. Go to **Console** tab
3. Look for any red errors
4. Share those errors for further help

### Or run full diagnostics:

Copy and paste the contents of `database-verify.sql` in Supabase SQL Editor to see detailed diagnostics.

---

## ✅ Expected Result

After successful setup, you should see:

- ✅ Header with navigation
- ✅ Hero section with title and CTAs
- ✅ Stats cards (94%, 2.5x, 500+)
- ✅ Feature showcase sections (Analytics Dashboard, Wellness Routine)
- ✅ Icon features grid
- ✅ Logo marquee
- ✅ Single feature promo
- ✅ Featured article
- ✅ Testimonials
- ✅ FAQ accordion
- ✅ Closing CTA
- ✅ Newsletter capture
- ✅ Footer
- ✅ Floating support button
