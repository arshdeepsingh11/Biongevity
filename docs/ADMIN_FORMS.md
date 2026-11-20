# Contact form + /admin

The contact form saves every enquiry to a database. The team reads them at **biongevity.com/admin**:
sign in with a **username, password and a 6-digit Google Authenticator code**, then view the list or
**download it as Excel**. The page is view only: nothing can be edited or deleted from it.

```
Visitor → Contact form ─POST /contact──────────► Forms Worker ──► D1 database
Team    → /admin ──username + password + code──► Forms Worker ──► 8-hour session ──► list + Excel
```

| Part | Where |
|---|---|
| Forms Worker (Cloudflare) | `deploy/forms/forms-worker.js`, config `deploy/forms/wrangler.toml` |
| Database tables | `deploy/forms/schema.sql` |
| Sign-in checks (password hash, 6-digit codes, sessions) | `deploy/forms/auth.mjs` |
| One-time admin setup | `npm run admin:setup` (`scripts/admin-setup.mjs`) |
| `/admin` page | `src/app/admin/page.tsx`, `src/components/admin/AdminPanel.tsx` |
| Excel file | `src/lib/xlsx.ts` (no library) |

## 1. Deploy the Worker (once)

Needs someone signed in to the Cloudflare account. From `deploy/forms/`:

```bash
npx wrangler login                                   # opens the browser to sign in
npx wrangler d1 create biongevity-forms              # copy the database_id it prints…
#   …into wrangler.toml → [[d1_databases]] database_id
npx wrangler d1 execute biongevity-forms --remote --file=schema.sql
npx wrangler deploy                                  # prints the Worker URL
```

## 2. Create the admin login (once)

From the project root:

```bash
npm run admin:setup -- --apply
```

It asks for a username and password, then shows a **setup key**:

1. Open **Google Authenticator** → **+** → **Enter a setup key**.
2. Account name: `Biongevity Admin`, key: the one shown, type: **Time based**.
3. Type the 6-digit code from the app back into the script to confirm.

`--apply` saves four secrets to the Worker: `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `ADMIN_TOTP_SECRET`,
`SESSION_SECRET`. Without `--apply` it prints them so you can run `npx wrangler secret put <NAME>` yourself.
The password is never stored, only a salted hash. Keep the setup key private: whoever has it can make codes.

**More than one person?** Add the same setup key to each person's Google Authenticator. They share the
one username and password.

**Lost phone or new password?** Run `npm run admin:setup -- --apply` again. The old key and password stop working.

## 3. DNS (lead)

The site's `/admin` page needs no DNS: it is part of the website. Only the Worker needs an address.

- **biongevity.com DNS is on Cloudflare:** Workers & Pages → `biongevity-forms` → Settings → Domains & Routes →
  **Add → Custom domain** → `forms.biongevity.com`. Cloudflare creates the DNS record and certificate.
- **DNS is somewhere else:** a CNAME to `workers.dev` does not work. Either move the zone to Cloudflare,
  or skip the custom domain and use the Worker's own `https://biongevity-forms.<account>.workers.dev` URL.

## 4. Connect the website

Set in the production environment, then rebuild and deploy the site:

```
NEXT_PUBLIC_FORMS_URL=https://forms.biongevity.com      # or the workers.dev URL
```

The contact form then posts to `<that URL>/contact`. If the site is served from any other address
(a preview or staging domain), add it to `ALLOWED_ORIGINS` in `deploy/forms/wrangler.toml` and redeploy.

## Protection

- Only `ALLOWED_ORIGINS` can use the Worker.
- Rate limits: 5 contact messages and 5 sign-in attempts per visitor per minute.
- Size limits on every field.
- Each 6-digit code works once.
- Sessions are signed and expire after 8 hours. They are kept only in the browser tab (gone when it closes).
- `/admin` is `noindex` and blocked in `robots.txt`.

Free-tier D1 holds 5 GB, far more than years of enquiries.
