# KwendaBiz Backend

## API documentation

The API uses Swagger/OpenAPI for interactive documentation.

Start the application and open:

- Swagger UI: `http://localhost:3000/docs`
- OpenAPI JSON: `http://localhost:3000/docs/openapi.json`

Protected endpoints use a JWT access token. In Swagger UI, select **Authorize**
and enter the token using the `Bearer` scheme. Routes marked with `@Public()`
are available without authentication.