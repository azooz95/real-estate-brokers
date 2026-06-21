# Handoff: Jiwar Aloula — Property Reservation Platform

Bilingual (EN/AR, RTL-aware) real-estate reservation platform for **Jiwar Aloula** (جوار الأولى).
**Two separate websites**, each on its own domain with its own independent language setting:

1. **Client site (mobile web)** — e.g. `app.jiwaraloula.com`. A broker shares a tracking link with
   a client, who browses projects → units → unit detail → reserves a unit (deposit + payment) → success.
2. **Admin / Marketer console (desktop web)** — e.g. `admin.jiwaraloula.com`. Login, central
   dashboard, inventory master directory, marketer (broker) management + tracking-link generation,
   transaction audit ledger, and system settings.

They share one codebase but build & deploy as two independent sites — see **Two separate sites**
below.

The core business rule: **Admin onboards a Broker and generates a dynamic tracking link →
the Broker shares it with their Client → the Client reserves a unit → the Reservation records
BOTH the client and the attributed broker.** Reserved units are visibly flagged everywhere, and
admins can see, per reservation, who the client is and which broker is attributed.

---

## About the design files

This bundle contains **two things**:

| Folder | What it is | How to treat it |
|--------|-----------|-----------------|
| `react-app/` | A **runnable React (Vite) frontend** implementing all 13 screens with mock data. | This is the frontend to build on. Wire it to your real backend (see API section). |
| `reference/` | The original **HTML design prototype** (single file) that all screens were derived from. | Visual source of truth. Open in a browser to see exact look + interactions. |

The React app is a faithful conversion of the prototype — same layout, tokens, copy and flows —
structured as a real codebase (router, i18n provider, typed API layer, mock fixtures). It is a
**reference implementation**: recreate/adapt it inside your target environment and conventions if
you have an existing codebase, or run it as-is if you don't.

## Fidelity

**High-fidelity.** Final colors, typography, spacing, copy (EN + AR), and interactions are all
specified and implemented. Match it closely. Inconsistencies present in the Figma (mixed corner
radii, ad-hoc frame widths) were cleaned up into the token system in `src/theme/tokens.js`.

---

## Two separate sites — one codebase

Admin and Client are **two independent products with their own domains and their own language
state** — not one app. They share this single codebase (theme, i18n, API layer, components) but
build and deploy as two sites:

| Site | Dev URL | Production domain (example) | HTML entry | App root |
|------|---------|------------------------------|------------|----------|
| **Client** (broker/client reservation flow, mobile) | `http://localhost:5173/` | `app.jiwaraloula.com` | `index.html` | `src/apps/ClientApp.jsx` |
| **Admin** (marketer/admin console, desktop) | `http://localhost:5173/admin.html` | `admin.jiwaraloula.com` | `admin.html` | `src/apps/AdminApp.jsx` |

Each site mounts its **own** `I18nProvider` with a separate storage key
(`jiwar.client.lang` / `jiwar.admin.lang`), so switching language on one site does not affect the
other. Routes live at each domain's **root** (the admin no longer has an `/admin` prefix — the
prefix *was* the separate domain). Set default language per site in `src/entries/*.jsx`.

**Deploy:** build once (`npm run build`) → `dist/` contains both `index.html` and `admin.html`.
Serve `index.html` at the client domain root and `admin.html` at the admin domain root, each with
SPA history-fallback to its own HTML. `.env.example` lists the cross-site base URLs
(`VITE_CLIENT_BASE_URL` / `VITE_ADMIN_BASE_URL`) for when one site links to the other (e.g. an
admin "preview client link" action).

## Running the frontend

```bash
cd react-app
npm install
cp .env.example .env   # optional: set API target + cross-site URLs
npm run dev            # client → http://localhost:5173/   admin → http://localhost:5173/admin.html
```

It runs standalone against mock data (`src/data/fixtures.js`). No backend needed to preview.

**Routes** (each relative to its own domain root)

_Client site_

| Path | Screen |
|------|--------|
| `/` | Home |
| `/projects` | All Projects Directory |
| `/projects/:projectId/units` | Project Inventory (unit list + filters) |
| `/units/:unitId` | Unit Detail |
| `/units/:unitId/reserve?ref=ID-xxxx` | Reservation form (deposit + payment). `ref` = broker tracking id |
| `/reservation/:id/success` | Reservation Success |

_Admin site_

| Path | Screen |
|------|--------|
| `/login` | Terminal Login |
| `/forgot` | Forgot Password |
| `/dashboard` | Central Command dashboard |
| `/inventory` | Inventory Master Directory (+ unit override modal) |
| `/marketers` | Marketer Management + onboard broker |
| `/transactions` | Transaction Audit Ledger (+ receipt panel) |
| `/settings` | System Settings |

A floating EN / العربية toggle (bottom corner) flips the **current site** between English (LTR)
and Arabic (RTL). Direction is driven by `<html dir>` in `src/i18n/I18nContext.jsx`; all layout
uses logical CSS properties (`insetInlineStart`, `marginInlineEnd`, `textAlign:'start'`) so it
mirrors automatically.

---

## >>> Backend work (Claude Code) <<<

All data access goes through **`src/api/client.js`**. Every method currently returns mock data
because `USE_MOCK = true`. To connect a real backend:

1. Implement the REST routes listed below (or adapt the fetch calls to your conventions / GraphQL).
2. Set `USE_MOCK = false`.
3. `vite.config.js` already proxies `/api` → `http://localhost:8000`.

### Domain model

```
Project (community)
  id, name, location, status, image
  └─* Unit
        id, code, title, price, priceNote, rooms, baths, area,
        status ∈ {available, hold, reserved}, image, + detail fields
Broker  (a.k.a. Marketer)
  id (e.g. ID-98210), name, mobile, trackingUrl, clicks, unitsReserved, revenue
Reservation
  id, unit (Unit), client {name, phone}, broker (Broker, attributed via tracking ref),
  deposit, paymentMethod ∈ {mada, stc, apple, card}, status, createdAt, receiptUrl
Settings
  reservationDeposit, vatRate, holdWindowMinutes, currency, integrations{...}
```

### Endpoints

| Method | Route | Body / Query | Returns |
|--------|-------|--------------|---------|
| POST | `/api/auth/login` | `{ email, password }` | `{ token, user }` |
| POST | `/api/auth/forgot` | `{ email }` | `204` |
| GET | `/api/projects` | — | `Project[]` |
| GET | `/api/projects/:id/units` | `?type=` | `Unit[]` |
| GET | `/api/units/:id` | — | `Unit` (full detail incl. specs, amenities, gallery, map) |
| POST | `/api/reservations` | `{ unitId, brokerRef, client:{name,phone}, paymentMethod }` | `Reservation` |
| GET | `/api/brokers` | — | `Broker[]` |
| POST | `/api/brokers` | `{ fullName, mobile }` | `Broker` (with generated `trackingUrl`) |
| GET | `/api/inventory` | — | `Unit[]` (admin master list) |
| GET | `/api/dashboard` | — | `{ kpis, activity, inventoryStatus }` |
| GET | `/api/transactions` | — | `Reservation[]` (audit ledger) |
| GET | `/api/settings` | — | `Settings` |
| PUT | `/api/settings` | `Settings` | `Settings` |

**Key flow to implement carefully — reservation attribution:**
The reservation form reads `?ref=ID-xxxx` from the URL (the broker's tracking link). On
`POST /api/reservations`, persist that `brokerRef` so the reservation, the transaction ledger,
and the broker's `unitsReserved` / `revenue` rollups all reflect the attributed broker.
Also: on reserve, the unit's `status` should move `available → hold` (during the hold window)
and `→ reserved` on confirmed payment.

---

## Project structure

```
react-app/
  index.html                 CLIENT site entry → src/entries/client.jsx
  admin.html                 ADMIN  site entry → src/entries/admin.jsx
  vite.config.js             two-page build (client + admin) + /api proxy
  .env.example               API target + cross-site base URLs
  src/
    entries/
      client.jsx             mounts ClientApp (I18nProvider key jiwar.client.lang)
      admin.jsx              mounts AdminApp  (I18nProvider key jiwar.admin.lang)
    apps/
      ClientApp.jsx          client routes (domain root)
      AdminApp.jsx           admin routes (domain root)
    index.css                resets, fonts, scrollbar, @keyframes (only non-inline CSS)
    theme/tokens.js          ← design tokens (color, type, radius, shadow, spacing)
    i18n/strings.js          EN + AR copy (every string, verbatim from Figma)
    i18n/I18nContext.jsx     locale + dir provider (RTL), per-site storageKey
    api/client.js            ← API seams (USE_MOCK flag, all endpoints stubbed)
    data/fixtures.js         mock data shaped like backend responses
    components/ui.jsx        shared: PhoneFrame, PhoneHeader, StatusBadge, SAR()
    components/LangToggle.jsx  shared EN/AR switch
    screens/client/*.jsx     Home, Projects, UnitList, UnitDetail, Reserve, Success
    screens/admin/*.jsx      Login, ForgotPassword, AdminLayout, Dashboard,
                             Inventory (+ UnitModal), Marketers,
                             Transactions (+ ReceiptPanel), Settings
  public/assets/img/         all images (logos, renders, payment icons) from the Figma export
```

> **Note on the HTML prototype** (`reference/`): it bundles both sites behind one top nav purely
> as a *preview* tool so you can click through every screen in one place. The React app is the
> real structure — two separate sites, as above.

---

## Design tokens (`src/theme/tokens.js`)

**Color**

| Token | Hex | Use |
|-------|-----|-----|
| `primary` | `#4A0810` | deep maroon — headings, primary buttons, sidebar accents |
| `primaryHover` | `#671F23` | hero panels, reserve CTA, active nav |
| `accentRose` | `#EA8586` | accents on dark surfaces |
| `gold` | `#725A40` | secondary links / labels |
| `goldSoft` | `#BB9E80` | sand fills, countdown banner |
| `goldFill` / `goldText` | `#FBDAB9` / `#58432A` | pale gold chips |
| `emerald` / `emeraldSoft` / `emeraldMint` | `#004036` / `#76AC9E` / `#B6EEDF` | available + confirmed |
| `amber` / `amberChipBg` | `#D97706` / `#FDEBD2` | hold status |
| `ink` / `inkSoft` / `inkMuted` | `#1B1B1D` / `#544242` / `#877271` | text hierarchy |
| `line` / `lineSoft` | `#EAE7EA` / `#F1EDF0` | borders |
| `bgWarm` / `bgStone` / `bgAdmin` | `#FBF8FB` / `#F2F1ED` / `#F4F1F3` | surfaces |
| `sidebar` | `#1F1F21` | admin sidebar |

**Type** — Inter (Latin) / IBM Plex Sans Arabic (Arabic, auto via `dir=rtl`).
Scale: display 30 · h1 24 · h2 20 · body 16/14 · label 11 (600, .05em tracking).

**Radius** 2 / 4 / 8 / 12 / 16 / pill · **Shadow** card, soft, lift (burgundy CTA glow), modal, phone.

**Status → pill** mapping lives once in `components/ui.jsx` (`StatusBadge`): available=emerald,
hold=amber, reserved=slate, confirmed=emerald-on-dark. Reuse it; don't re-color per screen.

---

## Screens (summary)

**Client**
- **Home** — burgundy "Heritage Excellence" hero with the client's dedicated rep, horizontal
  project rail, list of available unit cards (reserved units dimmed + disabled CTA), search FAB.
- **Projects** — search + filter, 2-col project cards with location + AVAILABLE/RESERVED badge.
- **Unit List** — project header, unit-type filter chips (All / 2 / 3 / 4 Rooms), unit cards with
  bed/bath/area spec row and status badge.
- **Unit Detail** — image carousel, status chip, price-from, 3-up spec matrix, description,
  2-col amenities, location map, sticky **Reserve** CTA.
- **Reserve** — unit summary + deposit, hold-window countdown, client name/phone, 4 payment
  methods (mada / STC Pay / Apple Pay / Card), sticky "Proceed to Secure Payment".
- **Success** — animated check, reservation receipt (unit code, deposit, **attributed marketer**,
  CONFIRMED status), 3-step next-steps timeline, download receipt.

**Admin**
- **Login** — split brand panel + credentials, remember me, forgot link.
- **Forgot Password** — email reset.
- **Dashboard** — 4 KPI cards, recent activity feed (reservations/inquiries/cancellations with
  attributed marketer), inventory status donut→bars, footer stat strip.
- **Inventory** — master unit table (code, project, floor, specs, price, status pill) + an
  **Actions** column (Hold Unit / Release / Manage). The action opens a **Unit Detail & Override
  modal** (`screens/admin/UnitModal.jsx`) with two variants:
  - *Reserved / held unit* → shows the **current holder** (client name, phone, reserved-since) and
    the activity timeline (deposit, lead assignment).
  - *Available unit* → shows a "No Current Holder" card and the publish/sync timeline.
  Both expose an **Administrative Override** panel: manual status toggle (Available / On Hold /
  Confirmed Reservation / Cancelled) + a required reason, applied via `Apply Status Change` →
  `api.setUnitStatus(code, status, reason)`. Plus metric cards + quick action.
- **Marketers** — broker roster table (tracking URL, clicks, units reserved, revenue) + onboard
  form that **generates a dynamic tracking link** + quick stats panel.
- **Transactions** — audit ledger (timestamp, ref, client+phone, property, deposit, marketer) +
  export CSV/Excel + summary widgets. The **View** action in the Receipt column opens a **slide-in
  receipt panel** (`screens/admin/ReceiptPanel.jsx`) — a print/download-ready document with verified
  header, client + property details, financial breakdown, total paid, and assigned agent.
- **Settings** — financial parameters (deposit, VAT, hold window, currency) + integration toggles.

Interaction details (hover/active, sticky bars, disabled states, countdown, toggles) are
implemented in the components and visible in `reference/` — open the HTML prototype to verify.

---

## Assets

All images in `public/assets/img/` were exported from the Figma file: brand logos
(`86442120d5.png` maroon, `8c1601d0f5.png` white for the dark sidebar), the geometric pattern
(`10655a55ec.png`), property renders, and payment-method icons. Filenames are the original Figma
image hashes; rename freely if you re-organize assets. Replace the placeholder property photos
with production photography when available.

## Notes
- Brand: **Jiwar Aloula**. Keep the burgundy/gold system; don't substitute another palette.
- Currency is SAR; locale formatting via `Intl.NumberFormat`. VAT 15% (Saudi).
- Phone numbers default to `+966`. Arabic is a first-class language, not an afterthought — keep
  copy in `i18n/strings.js` in sync across both locales when you add anything.
