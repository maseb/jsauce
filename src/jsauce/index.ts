
/// <reference path="./lib.d.ts" />

import thicket           = require("thicket");
import ProcessManager    = require("./core/ProcessManager");

var ComponentRegistry    = thicket.c("component-registry");

var c = new ComponentRegistry();

c.registerMany([
    {
        module: ProcessManager,
        as: "process-manager"
    }
]);

export = c;
