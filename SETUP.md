# IGMA Saturday: put it online (about 15 minutes)

The app is already built. You only need to do the parts that require your own accounts.
Do the steps in order.

## 1. Supabase (database and logins)

1. Go to supabase.com, sign in with GitHub, click **New project**. Name it `igma-saturday`, pick a **Europe** region, and save the database password somewhere.
2. **Authentication → Sign In / Providers → Email**: keep Email on, switch **Confirm email OFF**, and click Save.
   *If you skip this, nobody can get in, including the grading bot.*
3. **SQL Editor → New query**: open the file `supabase/schema.sql`, copy all of it, paste it in, and click **Run**. You should see "Success".
4. Click **Connect** at the top, or go to **Project Settings → API Keys**, and copy two values:
   - **Project URL** (looks like `https://abcd1234.supabase.co`)
   - **Publishable key** (starts with `sb_publishable_`)

   Never copy the secret key (`sb_secret_…`).

## 2. Run it on your laptop

1. Unzip `igma-saturday.zip` and open a terminal in the folder.
2. Copy `.env.example` to a new file called `.env.local` and paste in your two values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://abcd1234.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```
3. Run `npm install`, then `npm run dev`, and open http://localhost:3000.
4. Sign up, tap a spot, type your name, and press **Join**. Your name should appear on the pitch.

## 3. GitHub (public code)

In the same folder, type `claude` and send:

> Create a public GitHub repository called igma-saturday and push my code. Make sure .env.local is not uploaded.

Then open the repo on github.com and check two things: it says **Public**, and there is **no** `.env.local` file.

## 4. Vercel (the live link)

1. In Vercel, go to **Add New… → Project**, pick `igma-saturday`, and click **Import**.
2. Under **Environment Variables**, add the same two lines from `.env.local` (same names, same values). Click **Deploy**.
3. Go to **Settings → Domains**. Your link is the short one: `https://igma-saturday.vercel.app`. Never submit the long links with random letters.
4. Back in Supabase, go to **Authentication → URL Configuration**. Set **Site URL** to your Vercel link, add the same link under **Redirect URLs**, and click Save.

## 5. Test it like the bot (on the live link, not your laptop)

- [ ] Open the link in an incognito window. There's no Vercel login, and the page is clear in 5 seconds.
- [ ] Go to /signup with a new email. You land on the pitch right away, with no "check your email".
- [ ] Type only a name in the box and press Join. It appears on the pitch.
- [ ] Log out. In a different browser, go to /login and enter a wrong password: it's refused. With the right password, your name is still there.
- [ ] Sign up a second account. It sees the same lineup (that's correct: the data is shared).
- [ ] Open it on your phone. Everything is readable and nothing scrolls sideways.

## 6. Socratista text (Deliver → Async #1)

Fill in the two lines in brackets from your own interviews and users. Don't invent them.

```
Name: IGMA Saturday
One-liner (max 20 words): IGMA Saturday lets IE Sunday League players pick their position for each Saturday's 7v7 at La Chopera.
Who it's for: IE University students who play in the IGMA Sunday League (Fútbol 7).
The problem and how often it happens: [Every week the lineup is sorted out in WhatsApp: who's in, who dropped out, who plays where. What your 5 interviews said, e.g. "4 of 5 had a short team or a position clash in the last two weeks."]
Main feature (what a user does in 30 seconds): Tap an open position on the pitch, type your name, press Join. Everyone in the league sees the updated lineup and who they're playing against.
Data shared between users: yes
Real users so far (how many, and how you got them): [e.g. "9 players from the IGMA league WhatsApp group signed up this week."]
```

## After the deadline

Don't push changes, and don't delete anything. Open the app every few days so the free Supabase project doesn't pause.
To clear the board for a new week (only before or well after grading), run `delete from public.spots;` in the Supabase SQL Editor.
