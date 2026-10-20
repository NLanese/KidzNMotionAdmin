# Kidz-N-Motion Admin + API

This repo is two things in one Next.js (v12) app:

1. **The admin web portal** that therapists, organizations and guardians use in a browser.
2. **The backend API** that the mobile app (KidzNMotionNative) talks to:
   GraphQL at `/api/graphql`.

Data lives in a **MySQL database on PlanetScale**, accessed through **Prisma**.
Hosting is on **Vercel**.

---

## 1. First-time setup

```sh
nvm install 20 && nvm use 20
yarn            # installs packages and runs `prisma generate`
```

Create a `.env` file in the project root (it is gitignored, never commit it).
Ask the project owner for the values. It needs:

| Variable | Used for |
| --- | --- |
| `DATABASE_URL` | Production database connection (Prisma) |
| `DEV_DATABASE_URL`, `SHAWDOW_URL` | Dev database / Prisma shadow database |
| `JWT_SECRET_KEY` | Signing login tokens |
| `PASSWORD_SECRET_KEY` | Encrypting stored passwords |
| `SUPER_USER_SECRET_KEY` | Extra key required for "super user" admin actions |
| `STRIPE_PRIVATE_KEY` | Billing / checkout |
| `SEND_GRID_API_KEY` | Sending emails |
| `FIREBASE_SERVICE_ACCOUNT` | Push notifications. The whole Firebase service-account JSON on one line |
| `CLOUDINARY_PUBLIC`, `CLOUDINARY_PRIVATE` | Image uploads |
| `freeEmail` ... `freeEmail10` | Email addresses that get the app for free |
| `API_URL` | GraphQL URL the web portal's browser code calls |

The same variables must be set in **Vercel → Project → Settings → Environment Variables**
for the live site.

## 2. Running locally

```sh
yarn dev
```

- Web portal: http://localhost:3000
- GraphQL playground: http://localhost:3000/api/graphql

To point the mobile app at this local server, run `npm run start:local` in the
mobile repo.

## 3. Deploying

Merging into **`master`** deploys to the live site automatically (Vercel).
Before merging, make sure any new environment variables are already in Vercel.

## 4. Database changes

Edit `prisma/schema.prisma`, then:

```sh
npx prisma generate          # regenerate the client
npx prisma migrate status    # see what's pending
npx prisma migrate dev       # create + apply a migration (dev database only)
```

## 5. Where things are

| Folder | What's in it |
| --- | --- |
| `pages/` | Every web page (file name = URL). `pages/api/` = backend endpoints |
| `pages/api/graphql.js` | The GraphQL server (used by both the portal and the mobile app) |
| `pages/api/billing/` | Stripe checkout / subscription endpoints |
| `graphql/typeDefs.js` | The GraphQL schema: every query and mutation that exists |
| `graphql/resolvers/` | The code that runs for each query/mutation, grouped by area |
| `graphql/operations.js` | Queries/mutations the *web portal* sends |
| `graphql/prisma_functions/` | Shared database + email helpers used by resolvers |
| `helpers/api/auth.js` | Turns a login token into a user (`handleAuth`) |
| `prisma/schema.prisma` | Database tables |
| `components/`, `containers/`, `styles/` | Web portal UI (Ant Design + styled-components) |
| `atoms/` | Web portal shared state (Recoil) |
| `utils/` | Prisma client, Firebase, date/medal/user helpers |

Imports like `@components/...` or `@helpers/...` are shortcuts defined in `.babelrc`.
