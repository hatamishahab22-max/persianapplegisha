import { readFileSync } from 'fs';
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found');
  process.exit(1);
}

async function runMigration() {
  console.log('🚀 Running migration...');
  
  const sql = neon(DATABASE_URL);
  
  try {
    // Read migration file
    const migration = readFileSync('migrations/0000_eager_typhoid_mary.sql', 'utf-8');
    
    // Split by statement-breakpoint and execute each statement
    const statements = migration.split('--> statement-breakpoint').map(s => s.trim()).filter(s => s.length > 0);
    
    console.log(`Found ${statements.length} statements to execute`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.startsWith('CREATE TABLE') || statement.startsWith('ALTER TABLE')) {
        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        await sql(statement);
      }
    }
    
    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

runMigration();
