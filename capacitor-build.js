
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Capacitor build process...');

// Check if capacitor.config.ts exists
if (!fs.existsSync('./capacitor.config.ts')) {
  console.error('Error: capacitor.config.ts not found. Please create it first.');
  process.exit(1);
}

// Build the web app
console.log('Building web application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('Error building web application:', error);
  process.exit(1);
}

// Check if android platform is installed
const androidPlatformExists = fs.existsSync('./android');

if (!androidPlatformExists) {
  console.log('Adding Android platform...');
  try {
    execSync('npx cap add android', { stdio: 'inherit' });
  } catch (error) {
    console.error('Error adding Android platform:', error);
    process.exit(1);
  }
} else {
  console.log('Android platform already exists. Syncing...');
}

// Copy and sync web assets to native project
console.log('Syncing assets with Android platform...');
try {
  execSync('npx cap sync android', { stdio: 'inherit' });
} catch (error) {
  console.error('Error syncing with Android:', error);
  process.exit(1);
}

console.log('\nBuild process completed successfully!');
console.log('To open the project in Android Studio: npx cap open android');
console.log('To run on connected device: npx cap run android');
