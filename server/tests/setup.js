// Dummy test env only — never real secrets. The fake ANTHROPIC_API_KEY keeps the
// SDK constructor happy at import time, and guarantees any accidental live call
// fails with a 401 instead of spending credit.
process.env.JWT_SECRET_KEY = 'test-jwt-secret';
process.env.ANTHROPIC_API_KEY = 'test-dummy-key';
process.env.CLIENT_ORIGIN = 'http://localhost:5173';
