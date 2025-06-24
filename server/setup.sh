#!/bin/bash

# Exit immediately on error
set -e

if [ -d prisma ]; 
then
  echo 'Deleting current prisma migrations directory' 
  rm -vfr prisma/migrations 
  rm -vfr generated ;
else
  echo 'Setting up Prisma ORM';
  npx prisma init --datasource-provider postgresql --output ./generated/prisma;
fi
  
echo "Pulling from database"
npx prisma db pull

echo "Creating baseline migration"
mkdir -pv prisma/migrations/0_init 
npx prisma migrate diff --from-empty --to-schema-datasource prisma/schema.prisma --script > prisma/migrations/0_init/migration.sql 

echo "Reading migration sql file"
cat prisma/migrations/0_init/migration.sql 

echo "Resolving migration (marking as applied)"
npx prisma migrate resolve --applied 0_init

npx prisma generate

echo "Seeding database"
node seedDb.js

echo "Starting production server"
nodemon --exec node --trace-warnings server.js