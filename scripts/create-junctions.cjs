const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
const openzeppelinPath = path.join(nodeModulesPath, '@openzeppelin');

// Only run on Windows
if (process.platform === 'win32') {
  const junctions = [
    {
      link: path.join(openzeppelinPath, 'contracts@5.0.2'),
      target: path.join(openzeppelinPath, 'contracts-5.0.2'),
    },
    {
      link: path.join(openzeppelinPath, 'contracts@4.8.3'),
      target: path.join(openzeppelinPath, 'contracts-4.8.3'),
    },
  ];

  junctions.forEach(({ link, target }) => {
    try {
      // Check if target exists
      if (!fs.existsSync(target)) {
        console.log(`Target does not exist, skipping: ${target}`);
        return;
      }

      // Remove existing link if it exists
      if (fs.existsSync(link)) {
        try {
          fs.rmSync(link, { recursive: true, force: true });
        } catch (err) {
          // Ignore errors when removing
        }
      }

      // Create junction using mklink (must use cmd.exe)
      execSync(`cmd /c mklink /J "${link}" "${target}"`, { stdio: 'inherit' });
      console.log(`Created junction: ${link} -> ${target}`);
    } catch (error) {
      // If junction already exists or creation fails, that's okay
      if (!error.message.includes('already exists')) {
        console.warn(`Warning: Could not create junction ${link}: ${error.message}`);
      }
    }
  });
} else {
  console.log('Junction creation is only needed on Windows. Skipping on', process.platform);
}

