#!/usr/bin/env node

/**
 * Interactive setup script for migrating to Supabase
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function main() {
  console.log('🚀 Welcome to the Supabase Migration Setup!\n');
  
  console.log('This script will help you set up your environment for database migration.\n');
  
  console.log('First, you need to create a Supabase project:');
  console.log('1. Go to https://supabase.com and create a free account');
  console.log('2. Create a new project');
  console.log('3. Wait for the project to be fully provisioned (this takes a few minutes)');
  console.log('4. Go to Settings → API in your Supabase dashboard\n');
  
  const supabaseUrl = await askQuestion('Enter your Supabase Project URL: ');
  const supabaseAnonKey = await askQuestion('Enter your Supabase anon/public key: ');
  const supabaseServiceKey = await askQuestion('Enter your Supabase service_role key (for migration only): ');
  
  const adminEmail = await askQuestion('Enter your admin email (default: andrewliu3477@gmail.com): ') || 'andrewliu3477@gmail.com';
  
  // Create .env.local file
  const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}
SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceKey}

# Admin Configuration
ADMIN_EMAIL=${adminEmail}
`;

  const envPath = path.join(process.cwd(), '.env.local');
  fs.writeFileSync(envPath, envContent);
  
  console.log('\n✅ Created .env.local file with your configuration');
  
  console.log('\nNext steps:');
  console.log('1. Go to your Supabase dashboard → SQL Editor');
  console.log('2. Copy the contents of database_schema.sql and run it');
  console.log('3. Once the schema is created, run: node migrate-to-database.js');
  console.log('4. Verify the migration worked in your Supabase dashboard');
  console.log('5. Test your admin panel at http://localhost:3000/admin');
  
  rl.close();
}

main().catch(console.error);
