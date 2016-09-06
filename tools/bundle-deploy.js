const { execSync } = require('child_process');

execSync(`
    git config user.email "andrey.a.gubanov@gmail.com" &&
    git config user.name "Andrey Gubanov (his digital copy)" &&
    git clone -b gh-pages https://$GH_TOKEN@github.com/matreshkajs/matreshka-router.git &&
    npm run bundle &&
    cd bundle &&
    git add --all &&
    git commit --allow-empty -m $npm_package_version &&
    git push https://$GH_TOKEN@github.com/matreshkajs/matreshka-router.git gh-pages
`);
