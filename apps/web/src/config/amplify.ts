import { Amplify } from "aws-amplify";

/**
 * Configure AWS Amplify with Cognito settings.
 * This function should be called once at app startup.
 */
export function configureAmplify() {
  const userPoolId = import.meta.env.BUN_PUBLIC_COGNITO_USER_POOL_ID;
  const userPoolClientId = import.meta.env.BUN_PUBLIC_COGNITO_CLIENT_ID;
  const cognitoDomain = import.meta.env.BUN_PUBLIC_COGNITO_DOMAIN;
  const awsRegion = import.meta.env.BUN_PUBLIC_AWS_REGION || "ap-northeast-1";

  // Skip configuration if Cognito is not configured (development without auth)
  if (!userPoolId || !userPoolClientId || !cognitoDomain) {
    console.warn(
      "Cognito not configured. Authentication will be disabled.",
      "Set BUN_PUBLIC_COGNITO_USER_POOL_ID, BUN_PUBLIC_COGNITO_CLIENT_ID, and BUN_PUBLIC_COGNITO_DOMAIN to enable authentication.",
    );
    return;
  }

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId,
        userPoolClientId,
        loginWith: {
          oauth: {
            domain: `${cognitoDomain}.auth.${awsRegion}.amazoncognito.com`,
            scopes: ["openid", "email", "profile"],
            redirectSignIn: [`${window.location.origin}/auth/callback`],
            redirectSignOut: [window.location.origin],
            responseType: "code",
          },
        },
      },
    },
  });
}
