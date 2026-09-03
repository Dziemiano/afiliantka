# Afiliantka Roadmap

## Completed

### Phase 1: Stabilize & Clean Up (Foundation)

- [x] Secured blob APIs -- Supabase session checks on upload/list routes
- [x] Removed duplicate route `/offer/[slug]`, kept `/oferta/[slug]` with description block filtering
- [x] Removed dead code -- verify-session, panel/sidebar, unused Sanity exports, empty schemaTypes, offers-section, offers-grid
- [x] Consolidated Sanity clients -- single client at `sanity/lib/client.ts` with apiVersion `2025-05-28`
- [x] Cleaned all debug `console.log` statements and middleware logging
- [x] Finished route group migration -- `(app)`/`(website)` split is clean, empty directories removed
- [x] Fixed pre-existing TypeScript error in `lib/roles.ts`

### Phase 2: Google Drive Integration & Content Delivery

- [x] Google Drive service account client (`lib/google-drive.ts`) with list/download/browse helpers
- [x] Shared file types (`types/file.ts`) -- `FileItem`, `DriveSource`
- [x] Supabase `drive_sources` table migration with RLS policies
- [x] API routes: `/api/drive/list`, `/api/drive/download`, `/api/drive/config`, `/api/drive/sources`, `/api/drive/browse`
- [x] Admin Drive Sources page (`/admin/drive`) with Browse Drive picker UI -- breadcrumb navigation, inline add with section/role config, manual ID fallback
- [x] Unified file browser on dashboard (`/dashboard/files`, `/dashboard/onboard`) showing Blob + Drive content
- [x] Admin sidebar updated with Drive Sources link
- [x] **Role-based content gating** -- `role_required` from `drive_sources` enforced in `/api/drive/list` and `/api/drive/download`; user roles fetched server-side, admins bypass all gates
- [x] **Content categories/sections** -- expanded sidebar and dashboard with Onboarding, Resources, and All Files; section tabs on `/dashboard/files` with filter UI
- [x] **File organization** -- shared `FileBrowser` component with collapsible folder groups, search, section tabs; files grouped by source name

### Phase 3: User Experience & Management

- [x] **Onboarding flow** -- multi-step guided onboarding: PDF viewer → select 4 offers → complete requirements → admin approval; Supabase tables `user_onboarding`, `user_offer_selections`, `admin_notifications`; Sanity `requirement` field on offers; role transition onboard → user on admin approval
- [x] **Two-checkbox onboarding** -- each offer has "account opened" and "requirement completed" checkboxes; all 4 accounts opened triggers admin notification; admin verifies accounts (assigns `accounts_verified` role, unlocks `onboard-verified` drive sources); second onboarding file shown inline after verification; requirement completion flow unchanged
- [x] **Role-based dashboard routing** -- `onboard`-only users are redirected to `/dashboard/onboarding`; sidebar adapts to role; onboard users also allowed `/dashboard/offers`
- [x] **Admin notifications** -- notification bell in admin layout with real-time polling, unread badges, mark-as-read; `admin_notifications` table with RLS; new `accounts_opened` notification type
- [x] **Improved admin users page** -- onboarding status badges (reading/selecting/completing/accounts_verified/pending/approved), expandable progress details per user, per-offer account + requirement dot indicators, "Zweryfikuj konta" button, one-click "Approve" action
- [x] **Offers page for onboard users** -- `/dashboard/offers` shows all offers by category; visible only to onboard users in sidebar; regular users do not see it
- [x] **User profiles** -- `/dashboard/profile` with user info (name from metadata), roles, onboarding status, activity count; API at `/api/user/profile`
- [x] **User activity tracking** -- `user_activity` Supabase table with RLS; `logActivity()` helper; tracked on file download/view, offer selection/removal, requirement completion, account opening; admin activity log page at `/admin/activity` with pagination; `sendBeacon` client-side tracking on FileBrowser downloads
- [x] **Moderation tools** -- moderator role can access admin panel (files, drive sources); admin-only server actions guarded with `requireAdmin()`; `isAdminOrModerator()` helper for shared routes; sidebar adapts to role level
- [x] **Invitation with name** -- admin invitation form includes name field; name stored in `user_metadata.full_name`; displayed in onboarding welcome, sidebar greeting, and profile page

### Phase 3.5: UI/UX Overhaul (Dashboard & Admin)

- [x] **Mobile-first responsive redesign** -- audited and fixed all dashboard, admin, and onboarding pages for mobile usability; responsive padding, typography, and layouts across all pages
- [x] **Sidebar responsive behavior** -- reusable `AppShell` component with slide-over sidebar on mobile (hamburger toggle), static sidebar on `md+`; auto-close on route change; mobile header with branding
- [x] **Onboarding mobile UX** -- vertical stepper on mobile, horizontal on desktop; responsive PDF viewer heights; touch-friendly checkboxes (44px targets); mobile-optimized offer cards and progress counters
- [x] **Admin panel mobile support** -- user list with stacked layout on mobile; activity log with card view on mobile, table on desktop; drive management with proper touch targets; responsive forms and reject inputs
- [x] **Public website responsive polish** -- header with hamburger menu on mobile; hero, featured offers carousel, and all-offers table already responsive
- [x] **Component library audit** -- file browser with scrollable section tabs, proper search input sizing; login page with 44px touch targets; all buttons and links meet minimum touch target requirements

### Phase 4: Public Website Enhancements

- [x] **SEO optimization** -- removed `noindex`/`nofollow`; proper `Metadata` with OG tags on root layout, per-page metadata on home/oferty/oferta/blog pages; dynamic `generateMetadata` on offer and blog detail pages; `app/sitemap.ts` generating XML sitemap from Sanity offers + blog posts; `app/robots.ts` allowing public pages, disallowing dashboard/admin/studio/api; JSON-LD `Organization` on root, `Product` on offers, `BlogPosting` on blog posts
- [x] **Offer filtering/search** -- category filter tabs (Wszystkie/Osobiste/Biznesowe/Karty kredytowe) and text search input on `/oferty` via `OffersFilter` client component; `category` field added to GROQ query projection; client-side filtering of both featured carousel and all-offers table
- [x] **CMS-driven home page sections** -- new Sanity schema types `faq` (question, answer, order) and `howItWorks` (title, description, icon, order); `FaqSection` server component with accessible `details/summary` accordion; `HowItWorksSection` server component with numbered step grid; both rendered on home page between hero and footer
- [x] **Blog (renamed from news)** -- Sanity `news` type renamed to `blog` with new `slug` field; `/news` page moved to `/blog` with listing page linking to individual posts; `/blog/[slug]` detail page with `generateMetadata`, `generateStaticParams`, JSON-LD `BlogPosting`; Blog link added to header nav (desktop + mobile)
- [x] **Performance** -- removed `force-dynamic` from home page (ISR via Sanity `revalidate` tags); `generateStaticParams` on offer detail and blog detail pages for build-time pre-rendering; `next.config.ts` updated to proper ESM export

---

## Upcoming Phases

### Phase 4.5: Public Website UI Rebuild

Full visual overhaul of the public-facing website. Clean, light base with a real brand color palette (beyond stone/neutral monotone), better whitespace, modern card designs, and subtle animations.

- [x] **Header redesign** -- sticky header with backdrop blur, brand logo/wordmark with accent color, active link indicator (underline or pill highlight), CTA button with brand gradient for Dashboard/Login, remove or make "Beta" badge optional
- [x] **Hero section redesign** -- full-width hero with large centered headline (`text-4xl lg:text-6xl`), subtext, prominent CTA button ("Zobacz oferty"), subtle background gradient with brand accent, better typography hierarchy
- [x] **Offer cards redesign** -- larger cards with proper aspect-ratio images, hover scale/shadow transitions, category badge with color coding (personal=blue, business=green, credit-cards=amber), clean typography, visible CTA button on each card
- [x] **All offers grid** -- replace table layout on desktop with responsive card grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`), each card with image, title, category badge, featured badge, CTA; remove dual-button pattern in favor of single card link
- [x] **Offer detail page** -- full-width hero banner image, clean content layout with proper prose styling, prominent CTA button with brand color, improved breadcrumbs
- [x] **Blog pages** -- blog listing as card grid with hover effects; blog detail with proper prose/article styling and reading time estimate
- [x] **How It Works section** -- connecting lines/arrows between steps, subtle entrance animations (fade-in on scroll)
- [x] **FAQ section** -- smoother accordion animation (CSS grid-template-rows transition), better visual hierarchy with icons
- [x] **Offers filter** -- pill-style filter buttons with brand accent on active, search input with rounded design and subtle shadow
- [x] **Footer** -- new multi-column footer component with navigation links, legal links (privacy, terms), social media icons, brand description; dark background (stone-900) with light text; responsive (stacked on mobile, 3-4 columns on desktop)
- [x] **Website layout** -- remove separate `AppLogo` component between header and content (integrate into hero or header), clean white base background instead of stone/amber gradient
- [x] **Login page** -- brand-colored accent, centered card with subtle shadow

### Phase 4.6: Strona współpracy afiliacyjnej

Priorytet biznesowy -- strona informująca o modelu współpracy faceless i kierująca do panelu (invite-only).

- [x] **Route `/wspolpraca`** -- nowa strona w `app/(website)/wspolpraca/` z layoutem publicznym
- [x] **Sanity schema `cooperationPage`** -- korzyści współpracy, opis procesu dołączenia, FAQ współpracy (edytowalne w Studio)
- [x] **CTA buttons** -- "Zaloguj się" (link do `app.afiliantkafaceless.pl/login`), "Poproś o zaproszenie" (mailto lub kontakt z adminem)
- [x] **Navigation** -- link "Współpraca" w headerze i footerze
- [x] **Affiliate disclosure** -- informacja o linkach partnerskich na stronach ofert (`/oferta/[slug]`)
- [x] **Sitemap** -- dodanie `/wspolpraca` do `app/sitemap.ts`

### Phase 4.7: Content & Engagement

- [x] **Newsletter signup** -- email capture form on home page and blog, stored in Supabase, admin export
- [x] **Social proof / testimonials** -- new Sanity schema type, rendered on home page
- [x] **Offer comparison** -- side-by-side comparison feature for 2-3 selected offers
- [x] **Blog rich content** -- upgrade blog `content` from plain text to Portable Text (block array) for rich formatting, images, embeds
- [x] **Related offers on blog posts** -- link blog posts to relevant offers via Sanity references

### Phase 4.8: Analytics & Insights

- [x] **Public page analytics** -- track page views, offer clicks, blog reads (extend existing `user_activity` or use lightweight client-side tracking)
- [x] **Admin analytics dashboard** -- charts for user signups over time, most viewed offers, download counts, onboarding completion rates
- [x] **Offer click-through tracking** -- track external link clicks per offer, show stats in admin

### Phase 4.9: Remaining Platform Features

- [x] **Notification system** -- email/in-app notifications when new content is published (carried from Phase 2)
- [x] **Content versioning** -- track what is new for each user (carried from Phase 2)
- [x] **Accessibility basics** -- proper focus states, ARIA labels, keyboard navigation (carried from Phase 3.5)

### Phase 5: Scale & Polish ✅

- [x] **Email templates** -- branded magic link emails, invitation emails (`supabase/email-templates/`, `docs/EMAIL_TEMPLATES.md`)
- [x] **Rate limiting** -- protect auth and API endpoints (`lib/rate-limit.ts`, `/api/auth/magic-link`, newsletter, analytics)
- [x] **Error handling** -- global error boundaries, proper 404/500 pages (`app/not-found.tsx`, `app/error.tsx`, `app/global-error.tsx`)
- [x] **Testing** -- unit tests for role logic (`vitest`, `lib/role-utils.test.ts`, `lib/rate-limit.test.ts`)
- [x] **CI/CD** -- linting, type checking, tests, build (`.github/workflows/ci.yml`)
- [x] **Monitoring** -- optional Sentry error tracking (`lib/monitoring.ts`, `instrumentation.ts`, `SENTRY_DSN`)

### Phase 5.5: Public visitor repositioning (PRIORITY)

Strona publiczna jako katalog ofert bankowych dla odwiedzających (bonus za założenie), nie jako pitch afiliacyjny. Afiliacja tylko na `/wspolpraca`. Przed Phase 6/7.

- [x] **Homepage copy** -- visitor-facing bank offers (bonus za założenie), nie messaging afiliacyjny / partnerski
- [x] **Home layout** -- hero → how it works → featured only → CTA `/oferty` → FAQ
- [x] **Remove all-offers from `/`** -- filtr, compare i pełna lista tylko na `/oferty`
- [x] **Affiliate narrative** -- tylko `/wspolpraca` (+ istniejące disclosure na `/oferta/[slug]`)
- [x] **Public copy rebrand** -- metadata, hero fallbacks, footer blurb
- [x] **Docs sync** -- `PROJECT_SPEC.md` aligned with code (phases 4.5–5 done) + document Phase 5.5

Linear: DZI-48 (docs), DZI-49 (layout), DZI-50 (copy).

### Phase 5.6: UI + Sanity (home, oferty, toggles, branding)

- [x] **Hero simplify** -- tytuł + opis only (bez obrazka i CTA „Zobacz oferty”); pole `image` w Studio ukryte
- [x] **Featured carousel** -- shadcn `Carousel` w `FeaturedOffers` (mobile-first, touch ≥44px)
- [x] **Offer `bonusRequirement`** -- publiczne wymaganie bonusu; `requirement` bez zmian dla onboardingu
- [x] **`siteSettings` singleton** -- `showBlog`, `showLogin`, logo, social URLs (`lib/site-settings.ts`)
- [x] **Header/Footer** -- logo z Sanity (fallback tekst), Blog/Login toggles, social tylko przy URL
- [x] **Blog gate** -- `/blog`, `/blog/[slug]` → `notFound()` gdy `showBlog === false`
- [x] **Docs** -- ROADMAP + PROJECT_SPEC

Linear: DZI-51 (hero+carousel), DZI-52 (bonusRequirement), DZI-53 (siteSettings). Order: 5.6 → 5.7 → 6 → 7.

### Phase 5.7: Public Website UI Cohesion

Unified shader + glass design system across all public pages; legal routes, visitor copy, and layout primitives.

- [ ] **Design system** — `PublicSection`, `PublicGlassCard`, `PublicPageHero`, `public-surfaces.ts`; Geist font; website `not-found`
- [ ] **Homepage** — refactor sections to primitives; bank-offer copy on how-it-works; remove desktop density hack
- [ ] **Offers pages** — glass filter bar, unified page hero, offer detail glass shell
- [ ] **Blog + współpraca** — glass cards; Lucide benefit icons on `/wspolpraca`; newsletter styling
- [ ] **Legal pages** — `/polityka-prywatnosci`, `/regulamin`; footer links + sitemap
- [ ] **Docs** — ROADMAP + PROJECT_SPEC sync

Linear: DZI-62 (design system), DZI-63 (blog/wspolpraca), DZI-55 (legal), milestone Phase 5.7.

### Phase 6: Czat społecznościowy

Klasyczny czat między użytkownikami współpracującymi -- komunikacja społecznościowa, bez AI.

- [ ] **Supabase schema** -- tabele `conversations`, `messages` (ew. `chat_reports`); RLS per uczestnik konwersacji
- [ ] **Real-time messaging** -- Supabase Realtime subscriptions na nowe wiadomości
- [ ] **Wiadomości 1:1** -- prywatne konwersacje między współpracownikami (rola `user` i wyżej)
- [ ] **Kanał ogólny** -- opcjonalny kanał grupowy dla całej społeczności
- [ ] **Dashboard UI** -- nowa sekcja `/dashboard/czat` z listą konwersacji i widokiem wiadomości; mobile-first
- [ ] **Moderacja** -- admin/moderator: przegląd zgłoszeń, blokowanie użytkowników w czacie
- [ ] **Sidebar** -- link do czatu w nawigacji dashboardu (widoczny dla `user`, `moderator`, `admin`)

### Phase 7: Narzędzia AI

Asystent AI do rozwoju treści i profili społecznościowych -- późniejszy etap, niezależny od czatu użytkowników.

- [ ] **LLM integration** -- integracja z zewnętrznym API (OpenAI / Anthropic -- do wyboru)
- [ ] **Content assistant** -- pomoc w tworzeniu postów, opisów ofert, materiałów promocyjnych
- [ ] **Social profile assistant** -- pomoc w budowaniu i optymalizacji profili social media
- [ ] **Usage tracking** -- logowanie użycia AI, limity per użytkownik
- [ ] **Dashboard UI** -- osobna sekcja (np. `/dashboard/narzedzia`); mobile-first
- [ ] **API route** -- `/api/ai/generate` z auth check i rate limiting
