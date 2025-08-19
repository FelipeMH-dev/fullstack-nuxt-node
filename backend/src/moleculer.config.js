module.exports = {
  nodeID: "books-api",
  transporter: null, // NATS o "Redis"
  logger: true,
  logLevel: "info",
  cacher: "Memory",
  validator: true,
  serializer: "JSON",
  requestTimeout: 10 * 1000,
  retryPolicy: {
    enabled: true,
    retries: 5,
    delay: 1000,
    maxDelay: 5000,
    factor: 2,
    check: err => err && err.code >= 500
  }
};
