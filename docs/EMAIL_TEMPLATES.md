# Szablony email Supabase Auth

Magic linki logowania i zaproszenia użytkowników wysyła **Supabase Auth** — nie Resend.

## Pliki w repozytorium

| Plik | Użycie w Supabase Dashboard |
|------|-----------------------------|
| `supabase/email-templates/magic-link.html` | Authentication → Email Templates → **Magic Link** |
| `supabase/email-templates/invite.html` | Authentication → Email Templates → **Invite user** |

## Lokalne logowanie (ważne)

Domyślny `{{ .ConfirmationURL }}` używa **PKCE** (`?code=` + `code_verifier` w cookies). Przy `app.localhost` vs `127.0.0.1` cookies się rozjeżdżają → błąd:

`code challenge does not match previously saved code verifier`

Szablon magic-link w repo używa więc:

```html
{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=email
```

`.RedirectTo` to `emailRedirectTo` z aplikacji (`http://app.localhost:3002/auth/callback`). Callback woła `verifyOtp` — **bez PKCE**.

## Konfiguracja w Supabase

1. **Authentication → Email Templates → Magic Link** — wklej `supabase/email-templates/magic-link.html` (z `token_hash`, nie `ConfirmationURL`).
2. **Authentication → URL Configuration**:
   - **Redirect URLs** (wymagane):
     - `http://app.localhost:3002/auth/callback`
     - `http://127.0.0.1:3002/auth/callback` (opcjonalnie)
     - produkcyjny callback
   - Na czas local **Site URL** możesz ustawić na `http://app.localhost:3002` (albo zostawić prod — ważne są Redirect URLs + szablon z `RedirectTo`).
3. Po zmianie szablonu wyślij **nowy** magic link ze strony `http://app.localhost:3002/login`.

## Temat wiadomości (sugerowany)

- Magic Link: `Twój link logowania — Afiliantka Faceless`
- Invite: `Zaproszenie do Afiliantka Faceless`

## Uwagi

- Stare maile z `ConfirmationURL` / `?code=` mogą nadal padać na PKCE — użyj nowego linku po aktualizacji szablonu.
- Invite może zostać na `{{ .ConfirmationURL }}` albo analogicznie: `{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=invite`.
