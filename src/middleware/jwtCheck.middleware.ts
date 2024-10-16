import { auth } from 'express-oauth2-jwt-bearer';
// Import the 'auth' function from the 'express-oauth2-jwt-bearer' package.
// This function provides middleware for validating JWT (JSON Web Tokens).

export const jwtCheck = auth({
  // Export a middleware named 'jwtCheck' that uses the 'auth' function to check the JWT in incoming requests.

  audience: process.env.AUTH0_AUDIENCE,
  // Specify the audience for the JWT. This should match the 'aud' claim in the token.
  // The value is provided by the environment variable 'AUTH0_AUDIENCE'.

  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  // Specify the issuer of the JWT. This should match the 'iss' claim in the token.
  // The value is provided by the environment variable 'AUTH0_ISSUER_BASE_URL', which is typically your Auth0 domain.

  tokenSigningAlg: 'RS256',
  // Specify the signing algorithm that the JWT should use. In this case, it's 'RS256',
  // which is an RSA signature with SHA-256 hashing. Only tokens signed using this algorithm will be accepted.
});
