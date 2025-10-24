This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Authentication Setup

This project uses Supabase for invite-only authentication.

### 1. Set up Supabase

1.  Create a new project on [Supabase](https://supabase.com/).
2.  In your Supabase project, go to the **SQL Editor** and run the following command to create the `invitations` table:

    ```sql
    -- Invites table
    -- Used to store invitations for new users.
    CREATE TABLE invitations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT NOT NULL UNIQUE,
      token TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      used_at TIMESTAMPTZ,
      invited_by UUID REFERENCES auth.users(id),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      meta JSONB
    );
    ```

3.  Go to **Authentication -> Providers** and enable the **Email** provider.
4.  Go to **Authentication -> URL Configuration** and set your **Site URL** to `http://localhost:3000` for local development.
5.  Go to **Authentication -> Settings** and disable **Enable new user sign ups**.

### 2. Environment Variables

Create a `.env.local` file in the root of the project and add the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"
BLOB_READ_WRITE_TOKEN="YOUR_VERCEL_BLOB_READ_WRITE_TOKEN"
```

You can find these keys in your Supabase project settings under **API**.

### 3. Client-side Supabase Client

For client-side operations (e.g., in React components), use the `createClient` function from `lib/supabase/client.ts`.

### 4. Server-side Supabase Client (Route Handlers, Server Actions, Middleware)

For server-side operations, the Supabase client is created directly within the Route Handler, Server Action, or Middleware. This ensures correct cookie handling within Next.js's App Router.

### 5. Invite a User

To invite a user, navigate to the `/admin` page in your application after logging in with an existing user. Enter the email address and click "Send Invitation".

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

### Viewing Blob Storage Files in App

To view the files stored in your Vercel Blob storage, navigate to the `/panel/files` page in the application. This page fetches and displays a list of all blobs, providing previews for supported MIME types (images, videos, audio, PDFs, JSON, and plain text) and download links for others.

- **`url` vs `downloadUrl`**: The `url` provides a direct link to the blob content, suitable for embedding (e.g., `<img>`, `<video>`, `<iframe>`). The `downloadUrl` forces the browser to download the file, which is useful for types not supported for inline viewing or when a direct download is desired.

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
