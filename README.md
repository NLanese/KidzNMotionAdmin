===== TESTING =====
to run locally...

( NPM )
- nvm use 16.10
- npm i 
- npm run dev

( Yarn -- Recommended)
- nvm use 18
- yarn install
- yarn run dev


to access the graphQL Playground, go to these urls
- locaolhost:3000/api/graphql (local)
- kidz-n-motion.app/api/graphql

===== TO POST UPDATES =====
- Updating the master branch in this repo will automatically trigger an update on the live site

===== BEFORE PUBLISHING =====
.

=== DB Updates ====
npx prisma generate
npx prisma migrate status
npx prisma migrate dev

