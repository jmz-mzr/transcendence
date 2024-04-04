const path = require('path');

const buildEslintCommand = (filenames) => {
  const frontDir = 'front-end';
  let cwd = process.cwd();

  if (!cwd.endsWith('/')) cwd += '/';
  if (!cwd.endsWith(frontDir)) cwd += frontDir;

  return `next lint --file ${filenames
    .map((f) => path.relative(cwd, f))
    .join(' --file ')}`;
};

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
};
