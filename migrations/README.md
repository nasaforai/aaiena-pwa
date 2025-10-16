# Database Migrations

This directory contains SQL migration scripts for the Aaiena PWA database.

## How to Run Migrations

### Option 1: Using Supabase Dashboard

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy the contents of the migration file (e.g., `add_measurement_columns.sql`)
4. Paste into the SQL Editor
5. Click "Run" to execute the migration

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Navigate to the project root
cd /path/to/aaiena-pwa

# Run the migration script
supabase db execute --file ./migrations/add_measurement_columns.sql
```

### Option 3: Using psql (if you have direct database access)

```bash
psql -h YOUR_SUPABASE_DB_HOST -U postgres -d postgres -f ./migrations/add_measurement_columns.sql
```

## Available Migrations

- `add_measurement_columns.sql`: Adds missing measurement columns (neck_inches, inseam_inches, body_length_inches) to the profiles table

## After Running Migrations

After adding the new columns, you'll need to:

1. Update the `useProfile.ts` file to uncomment the newly added columns in the Profile interface
2. Update the UI components to use these fields
3. Restart the application

## Troubleshooting

If you encounter errors when running migrations:

1. Check that you have the necessary permissions to modify the database schema
2. Ensure the table name ('profiles') matches your actual table name
3. Verify that the column data types (NUMERIC(5,2)) are appropriate for your use case
4. If columns already exist but with different data types, you may need to use ALTER COLUMN instead of ADD COLUMN
