#!/usr/bin/env node

/**
 * Pre-deployment validation script for Vercel migration
 * Run this before deploying to ensure everything is set up correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Vercel Migration Pre-Deployment Check\n');

const checks = [];

// Check 1: Next.js configuration
console.log('1. Checking Next.js configuration...');
try {
  const nextConfig = fs.readFileSync('next.config.js', 'utf8');
  // Check for uncommented output: 'export' line
  const lines = nextConfig.split('\n');
  const hasActiveExport = lines.some(line => 
    line.includes("output: 'export'") && !line.trim().startsWith('//')
  );
  
  if (hasActiveExport) {
    checks.push({ name: 'Next.js Config', status: 'FAIL', message: 'Static export is still enabled - should be disabled for Vercel' });
  } else {
    checks.push({ name: 'Next.js Config', status: 'PASS', message: 'Correctly configured for Vercel' });
  }
} catch (error) {
  checks.push({ name: 'Next.js Config', status: 'FAIL', message: 'next.config.js not found' });
}

// Check 2: Package.json scripts
console.log('2. Checking package.json scripts...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const hasVercelScript = packageJson.scripts && packageJson.scripts.vercel;
  if (hasVercelScript) {
    checks.push({ name: 'Package Scripts', status: 'PASS', message: 'Vercel scripts configured' });
  } else {
    checks.push({ name: 'Package Scripts', status: 'WARN', message: 'Vercel scripts not found (optional)' });
  }
} catch (error) {
  checks.push({ name: 'Package Scripts', status: 'FAIL', message: 'package.json not found or invalid' });
}

// Check 3: Environment variables template
console.log('3. Checking environment setup...');
if (fs.existsSync('.env.example')) {
  checks.push({ name: 'Environment Template', status: 'PASS', message: '.env.example found' });
} else {
  checks.push({ name: 'Environment Template', status: 'WARN', message: '.env.example not found' });
}

// Check 4: Vercel configuration
console.log('4. Checking Vercel configuration...');
if (fs.existsSync('vercel.json')) {
  checks.push({ name: 'Vercel Config', status: 'PASS', message: 'vercel.json found' });
} else {
  checks.push({ name: 'Vercel Config', status: 'WARN', message: 'vercel.json not found (optional)' });
}

// Check 5: Admin components
console.log('5. Checking admin components...');
const adminComponents = [
  'src/components/AdminDashboard.tsx',
  'src/components/AdminGuard.tsx',
  'src/app/admin/page.tsx'
];

let adminChecks = 0;
adminComponents.forEach(component => {
  if (fs.existsSync(component)) {
    adminChecks++;
  }
});

if (adminChecks === adminComponents.length) {
  checks.push({ name: 'Admin Components', status: 'PASS', message: 'All admin components found' });
} else {
  checks.push({ name: 'Admin Components', status: 'FAIL', message: `Missing ${adminComponents.length - adminChecks} admin components` });
}

// Check 6: Dependencies
console.log('6. Checking dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = ['next', 'react', 'react-dom', '@supabase/supabase-js', 'lucide-react'];
  const missingDeps = requiredDeps.filter(dep => 
    !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]
  );
  
  if (missingDeps.length === 0) {
    checks.push({ name: 'Dependencies', status: 'PASS', message: 'All required dependencies found' });
  } else {
    checks.push({ name: 'Dependencies', status: 'FAIL', message: `Missing: ${missingDeps.join(', ')}` });
  }
} catch (error) {
  checks.push({ name: 'Dependencies', status: 'FAIL', message: 'Could not check dependencies' });
}

// Display results
console.log('\n📊 Validation Results:\n');
checks.forEach(check => {
  const emoji = check.status === 'PASS' ? '✅' : check.status === 'WARN' ? '⚠️' : '❌';
  console.log(`${emoji} ${check.name}: ${check.message}`);
});

const passCount = checks.filter(c => c.status === 'PASS').length;
const totalChecks = checks.length;

console.log(`\n🎯 Status: ${passCount}/${totalChecks} checks passed`);

if (passCount === totalChecks) {
  console.log('\n🎉 Ready for Vercel deployment!');
  console.log('\nNext steps:');
  console.log('1. Commit and push your changes to GitHub');
  console.log('2. Go to vercel.com and import your repository');
  console.log('3. Set up environment variables if using Supabase');
  console.log('4. Deploy!');
} else {
  console.log('\n⚠️  Some issues need attention before deployment.');
  console.log('Please address the failed checks above.');
}

console.log('\n📚 For detailed instructions, see VERCEL_SETUP.md');
