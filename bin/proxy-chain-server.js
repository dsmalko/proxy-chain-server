const ProxyChain = require('proxy-chain');

const server = new ProxyChain.Server({
  // Port where the server the server will listen. By default 8000.
  port: process.env.PORT || 8000,

  // Enables verbose logging
  verbose: false,

  // Custom function to authenticate proxy requests and provide the URL to chained upstream proxy.
  // It must return an object (or promise resolving to the object) with following form:
  // { requestAuthentication: Boolean, upstreamProxyUrl: String }
  // If the function is not defined or is null, the server runs in a simple mode.
  // Note that the function takes a single argument with the following properties:
  // * request  - An instance of http.IncomingMessage class with information about the client request
  //              (which is either HTTP CONNECT for SSL protocol, or other HTTP request)
  // * username - Username parsed from the Proxy-Authorization header. Might be empty string.
  // * password - Password parsed from the Proxy-Authorization header. Might be empty string.
  // * hostname - Hostname of the target server
  // * port     - Port of the target server
  // * isHttp   - If true, this is a HTTP request, otherwise it's a HTTP CONNECT tunnel for SSL
  //              or other protocols
  prepareRequestFunction: ({ request, username, password, hostname, port, isHttp }) => {
    return {
      // Require clients to authenticate with username 'bob' and password 'TopSecret'
      // requestAuthentication: username !== 'bob' || password !== 'TopSecret',

      // Sets up an upstream HTTP proxy to which all the requests are forwarded.
      // If null, the proxy works in direct mode.
      upstreamProxyUrl: process.env.UPSTREAM_URL,
    };
  },
});

server.listen(() => {
  console.log(`Proxy server is listening on port ${server.port}`);
});
