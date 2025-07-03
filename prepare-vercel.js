#!/usr/bin/env node

/**
 * Vercel deployment preparation script
 */

const fs = require('fs');
const path = require('path');

function checkEnvironmentVariables() {
  console.log('🔍 Checking environment variables for Vercel deployment...\n');
  
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
    'SUPABASE_SERVICE_ROLE_KEY',
    'ADMIN_EMAIL',
    'NEXT_PUBLIC_APP_URL'
  ];
  
  const envLocalPath = path.join(process.cwd(), '.env.local');
  const hasEnvLocal = fs.existsSync(envLocalPath);
  
  if (hasEnvLocal) {
    console.log('✅ Found .env.local file');
    require('dotenv').config({ path: '.env.local' });
    
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length === 0) {
      console.log('✅ All required environment variables are set locally');
    } else {
      console.log('❌ Missing environment variables in .env.local:');
      missingVars.forEach(varName => console.log(`   - ${varName}`));
    }
  } else {
    console.log('⚠️ No .env.local file found (this is OK for production)');
  }
  
  console.log('\n📋 Required Vercel Environment Variables:');
  requiredVars.forEach(varName => {
    const hasValue = process.env[varName] ? '✅' : '❌';
    const description = getVarDescription(varName);
    console.log(`${hasValue} ${varName} - ${description}`);
  });
}

function getVarDescription(varName) {
  const descriptions = {
    'NEXT_PUBLIC_SUPABASE_URL': 'Your Supabase project URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'Supabase public/anon key',
    'SUPABASE_SERVICE_ROLE_KEY': 'Supabase service role key (for server operations)',
    'ADMIN_EMAIL': 'Your admin email address',
    'NEXT_PUBLIC_APP_URL': 'Your Vercel app URL (e.g., https://myapp.vercel.app)'
  };
  return descriptions[varName] || 'Configuration variable';
}

function checkFiles() {
  console.log('\n📁 Checking required files...\n');
  
  const requiredFiles = [
    { path: 'database_schema.sql', description: 'Database schema for Supabase' },
    { path: 'migrate-to-database.js', description: 'Data migration script' },
    { path: 'src/app/api/blog/route.ts', description: 'Blog API endpoints' },
    { path: 'src/app/api/destinations/route.ts', description: 'Destinations API endpoints' },
    { path: 'src/app/api/comments/route.ts', description: 'Comments API endpoints' }
  ];
  
  requiredFiles.forEach(file => {
    const exists = fs.existsSync(path.join(process.cwd(), file.path));
    const status = exists ? '✅' : '❌';
    console.log(`${status} ${file.path} - ${file.description}`);
  });
}

function showDeploymentChecklist() {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 VERCEL DEPLOYMENT CHECKLIST');
  console.log('='.repeat(60));
  
  console.log('\n📋 Before deploying to Vercel:');
  console.log('1. ✅ Create Supabase project at supabase.com');
  console.log('2. ✅ Apply database schema (database_schema.sql in SQL Editor)');
  console.log('3. ✅ Get Supabase API keys from Settings → API');
  console.log('4. ✅ Add environment variables to Vercel project settings');
  console.log('5. ✅ Run migration script locally: npm run migrate');
  console.log('6. ✅ Push code to GitHub');
  console.log('7. ✅ Verify deployment at your Vercel URL');
  
  console.log('\n🔧 In Vercel Dashboard → Settings → Environment Variables:');
  console.log('Add these for ALL environments (Production, Preview, Development):');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  console.log('- ADMIN_EMAIL'); 
  console.log('- NEXT_PUBLIC_APP_URL');
  
  console.log('\n🧪 After deployment, test:');
  console.log('- Visit https://your-app.vercel.app');
  console.log('- Admin access at https://your-app.vercel.app/admin');
  console.log('- Add/edit destinations and blog posts');
  console.log('- Verify data persists across page refreshes');
  
  console.log('\n📚 Documentation:');
  console.log('- Complete guide: VERCEL_DEPLOYMENT_GUIDE.md');
  console.log('- Database setup: DATABASE_MIGRATION_GUIDE.md');
}

function main() {
  console.log('🚀 Vercel Deployment Preparation\n');
  
  checkFiles();
  checkEnvironmentVariables();
  showDeploymentChecklist();
  
  console.log('\n✨ Ready for Vercel deployment!');
}

main();
