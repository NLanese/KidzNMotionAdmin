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
nvm install 22 && nvm use 22
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
| `SUPER_USER_SECRET_KEY` | Extra key required for "super user" admin actions. You type it into the box on `/superui/console`. Write any `$` in the value as `\$` |
| `STRIPE_PRIVATE_KEY` | Billing / checkout |
| `SES_AWS_ACCESS_KEY_ID`, `SES_AWS_SECRET_ACCESS_KEY` | Sending emails through Amazon SES. Keys for an IAM user allowed `ses:SendEmail` (Vercel reserves the plain `AWS_*` names, hence the `SES_` prefix) |
| `SES_AWS_REGION` | Optional. AWS region where the domain is verified in SES. Defaults to `us-east-1` |
| `EMAIL_FROM` | Optional. Sender address; must be on a domain verified in SES. Defaults to `noreply@kidz-n-motion.app` |
| `SES_CONFIGURATION_SET` | Optional. SES configuration set name, if you want bounce/complaint tracking |
| `SITE_URL` | Optional. Website address used in password-reset links. Defaults to `https://dashboard.kidz-n-motion.app` |
| `FIREBASE_SERVICE_ACCOUNT` | Push notifications. The whole Firebase service-account JSON on one line |
| `CLOUDINARY_PUBLIC`, `CLOUDINARY_PRIVATE` | Image uploads |
| `CRON_SECRET` | Any long random string. Vercel sends it to the daily job so outsiders can't trigger it |
| `API_URL` | GraphQL URL the web portal's browser code calls |

`.env.local` (optional) overrides `.env` for local development. Don't define the
same `$`-containing value in both files: Next.js will fail to load the env.

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

## 3. Payments are switched off

Kidz-N-Motion is currently **free for everyone**. On every login,
`loginUser` marks the user and their organizations as `Active`, and the web
portal no longer shows trial banners, subscription buttons or billing redirects.
The Stripe code (`pages/api/billing/`, `pages/account/billing.js`) is still in
the repo but nothing sends users there automatically.

## 4. Assignment notifications for therapists

Code: `functions/AssignmentHelpers/assignmentNotifications.js`

Alerts go to the therapist by **email** (Amazon SES, from `EMAIL_FROM`) and as a **phone push** if they use the app.

- **Completed:** when a child finishes the last video in an assignment
  (`setVideoCompleted`), the therapist is alerted once.
- **Missed:** a daily Vercel job (`/api/cron/missed-assignments`, scheduled in
  `vercel.json` for 13:00 UTC = 7am Denver) notifies the therapist once for every
  assignment whose due date has passed with videos unfinished. Assignments more
  than 7 days overdue when first seen are flagged without a notification.

## 5. Deploying

Merging into **`master`** deploys to the live site automatically (Vercel).
Before merging, make sure any new environment variables are already in Vercel.

## 6. Database changes

Edit `prisma/schema.prisma`, then:

```sh
npx prisma generate          # regenerate the client
npx prisma migrate status    # see what's pending
npx prisma migrate dev       # create + apply a migration (dev database only)
```

## 7. Where things are

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

## Email (Amazon SES)

All email goes through one helper: `graphql/prisma_functions/email/sendEmail.js`.
It never throws; it returns `false` and logs `sendEmail:` in Vercel's function logs
when something goes wrong.

To check the setup from your machine:

```
node --env-file=.env scripts/test-email.mjs you@example.com
```

New SES accounts start in the **sandbox** and can only send to addresses you have
verified in the SES console. Request production access in SES before going live.
