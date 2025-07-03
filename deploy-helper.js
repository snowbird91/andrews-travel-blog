#!/usr/bin/env node

/**
 * Quick deployment script for Vercel migration
 * This script helps automate the initial steps
 */

const { exec } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Andrew\'s Travel Blog - Vercel Deployment Helper\n');

function runCommand(command, description) {
  return new Promise((resolve, reject) => {
    console.log(`📝 ${description}...`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.warn(`⚠️ Warning: ${stderr}`);
      }
      console.log(`✅ ${description} completed`);
      resolve(stdout);
    });
  });
}

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  try {
    // Step 1: Validate deployment readiness
    console.log('🔍 Step 1: Validating deployment readiness...');
    await runCommand('npm run validate', 'Validation check');

    // Step 2: Ask about git status
    console.log('\n📦 Step 2: Preparing Git repository...');
    const shouldCommit = await askQuestion('Do you want to commit and push changes now? (y/n): ');
    
    if (shouldCommit.toLowerCase() === 'y' || shouldCommit.toLowerCase() === 'yes') {
      await runCommand('git add .', 'Staging files');
      
      const commitMessage = await askQuestion('Enter commit message (or press Enter for default): ');
      const message = commitMessage.trim() || 'feat: Add admin dashboard and prepare for Vercel deployment';
      
      await runCommand(`git commit -m "${message}"`, 'Committing changes');
      await runCommand('git push', 'Pushing to GitHub');
    }

    // Step 3: Build test
    console.log('\n🏗️ Step 3: Testing build process...');
    const shouldBuild = await askQuestion('Do you want to test the build locally? (y/n): ');
    
    if (shouldBuild.toLowerCase() === 'y' || shouldBuild.toLowerCase() === 'yes') {
      await runCommand('npm run build', 'Building application');
    }

    // Step 4: Deployment instructions
    console.log('\n🚀 Step 4: Ready for Vercel deployment!');
    console.log('\nNext steps:');
    console.log('1. Go to https://vercel.com');
    console.log('2. Sign in with GitHub');
    console.log('3. Import your andrews-travel-blog repository');
    console.log('4. Click Deploy');
    console.log('5. Visit your new site!');
    
    console.log('\n📚 For detailed instructions, see MIGRATION_GUIDE.md');
    console.log('🔧 For configuration help, see VERCEL_SETUP.md');

  } catch (error) {
    console.error('\n❌ Deployment preparation failed:', error.message);
    console.log('\n🔧 Please check the error above and try again.');
    console.log('📚 For help, see MIGRATION_GUIDE.md');
  } finally {
    rl.close();
  }
}

main();
