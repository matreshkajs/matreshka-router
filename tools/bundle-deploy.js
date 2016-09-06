const { execSync } = require('child_process');
const path = require('path');

execSync(`
    git clone -b gh-pages https://$GH_TOKEN@github.com/matreshkajs/matreshka-router.git bundle &&
    npm run bundle &&
    cd bundle &&
    git config user.email "andrey.a.gubanov@gmail.com" &&
    git config user.name "Andrey Gubanov (his digital copy)" &&
    git add . &&
    git commit --allow-empty -m $npm_package_version &&
    git push https://$GH_TOKEN@github.com/matreshkajs/matreshka-router.git gh-pages
`, {
    cwd: path.resolve(__dirname, '..')
});
