"use strict";

import ServerDispatcher from '../lib/ServerDispatcher.js';
import FsResourceDispatcher from '../lib/FsResourceDispatcher.js';
import http from 'http';

let http_port = 3030 || process.env.HTTP_PORT;
let serverDispatcher = new ServerDispatcher(),
    testServer = http.createServer(serverDispatcher.requestListener);

serverDispatcher.on('error', function (err, requestContext) {
    console.error(err.stack);
});
serverDispatcher.dispatchers.push(new FsResourceDispatcher('/etc', __dirname));

testServer.listen(http_port);

console.log(`ElenaJS 2 Demo listening on port ${http_port}...`);

export default testServer;
