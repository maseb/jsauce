var spawn = require("child_process").spawn;

var buildSupport = require("thicket-build-support");

buildSupport.exportArtifacts("jsauce");

desc("Build lib-node and lib-web artifacts");
task("build", ["export-artifacts"]);

desc("Run tests");
task("test", ["export-artifacts", "run-tests"], function() {
});

task("run-tests", function() {
  var npm =spawn("npm", ["test"], {stdio: 'inherit'});
  npm.on("close", function() {
    complete();
  });
}, {async: true});

task("default", ["build"]);
