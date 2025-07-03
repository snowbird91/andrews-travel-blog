#!/usr/bin/env node

/**
 * Verification script to check if Supabase is properly configured
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function verifySupabase() {
  console.log('🔍 Verifying Supabase configuration...\n');
  
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  
  if (!supabaseUrl) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL');
    return false;
  }
  
  if (!supabaseAnonKey) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
    return false;
  }
  
  if (!serviceKey) {
    console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY (needed for migration)');
    return false;
  }
  
  if (!adminEmail) {
    console.error('❌ Missing ADMIN_EMAIL');
    return false;
  }
  
  console.log('✅ Environment variables are set');
  
  // Test connection
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Simple connectivity test
    const { data, error } = await supabase.from('destinations').select('count', { count: 'exact', head: true });
    
    if (error && error.code !== 'PGRST116') { // PGRST116 means table doesn't exist yet, which is fine
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Database connection successful');
    
    // Check if tables exist
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['destinations', 'blog_posts', 'comments']);
    
    if (tablesError) {
      console.log('⚠️ Cannot check table existence (this is fine if schema not applied yet)');
    } else {
      const tableNames = tables?.map(t => t.table_name) || [];
      if (tableNames.length === 0) {
        console.log('⚠️ Database tables not found - make sure to run the schema first');
        console.log('   Go to Supabase → SQL Editor and run database_schema.sql');
      } else {
        console.log(`✅ Found ${tableNames.length} database tables:`, tableNames.join(', '));
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error connecting to database:', error.message);
    return false;
  }
}

async function main() {
  const isReady = await verifySupabase();
  
  console.log('\n' + '='.repeat(50));
  
  if (isReady) {
    console.log('🎉 Supabase configuration looks good!');
    console.log('\nNext steps:');
    console.log('1. Make sure database schema is applied (database_schema.sql)');
    console.log('2. Run migration: npm run migrate');
    console.log('3. Test the app: npm run dev');
  } else {
    console.log('❌ Configuration issues found');
    console.log('\nPlease fix the issues above and try again');
    console.log('Run: npm run setup-db to configure your environment');
  }
}

main().catch(console.error);
