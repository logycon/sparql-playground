const ghpages = require('gh-pages');
const dir = 'dist/sparql-playground';
const repo = 'https://github.com/logycon/sparql-playground-app.git';
const branch = 'master';
const dest = '';

ghpages.publish(dir, {
  branch: branch,
  repo: repo,
  dest: dest
}, function(err) {
  if (err) {
    console.log('Error Publishing:')
    console.log(err);
  } else {
    console.log('Published');
  }
});
