const rmdir = require('rimraf');
rmdir('lib', function(err) {
    err && console.error(err) || console.log("Cleanup successful");
});
