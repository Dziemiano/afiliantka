# Szablony email Supabase Auth

Magic linki logowania i zaproszenia użytkowników wysyła **Supabase Auth** — nie Resend. Resend (Faza 4.9) służy wyłącznie opcjonalnym powiadomieniom biznesowym (np. onboarding, nowa treść).

## Pliki w repozytorium

| Plik | Użycie w Supabase Dashboard |
|------|-----------------------------|
| `supabase/email-templates/magic-link.html` | Authentication → Email Templates → **Magic Link** |
| `supabase/email-templates/invite.html` | Authentication → Email Templates → **Invite user** |

## Konfiguracja w Supabase

1. Otwórz [Supabase Dashboard](https://supabase.com/dashboard) → projekt → **Authentication** → **Email Templates**.
2. Wybierz szablon (Magic Link lub Invite user).
3. Wklej zawartość odpowiedniego pliku HTML z tego repozytorium.
4. Upewnij się, że w szablonie pozostaje zmienna `{{ .ConfirmationURL }}` — Supabase podstawia nią link potwierdzający.
5. W **Authentication → URL Configuration** ustaw:
   - **Site URL**: publiczny adres strony (np. `https://afiliantkafaceless.pl`)
   - **Redirect URLs**: dozwolone adresy callback, m.in. `{NEXT_PUBLIC_APP_ORIGIN}/auth/callback`

## Temat wiadomości (sugerowany)

- Magic Link: `Twój link logowania — Afiliantka Faceless`
- Invite: `Zaproszenie do Afiliantka Faceless`

## Uwagi

- Szablony używają inline CSS dla lepszej kompatybilności z klientami poczty.
- Kolorystyka (`#0d9488`) odpowiada brandowi aplikacji.
- Po zmianie szablonu wyślij testowy magic link z `/login`, aby zweryfikować renderowanie.
