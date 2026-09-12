export const emailVerificationTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email Address</title>
</head>
<body style="{{styles.main}}">
  <div style="{{styles.container}}">
    <p style="{{styles.tertiary}}">{{appName}}</p>

    <h1 style="{{styles.secondary}}">Verify Your Email Address</h1>

    <p style="{{styles.paragraph}}">Hi {{name}},</p>

    <p style="{{styles.paragraph}}">
      Thanks for signing up for {{appName}}. Click the button below to verify your email
      address and activate your account.
    </p>

    <div style="{{styles.centeredSection}}">
      <a href="{{verificationUrl}}" style="{{styles.button}}">
        Verify Your Email
      </a>
    </div>

    <p style="{{styles.paragraph}}">
      This verification link is valid for 30 minutes and will expire on
      {{formatDate tokenExpiresAt}}.
    </p>

    <p style="{{styles.paragraph}}">
      If this verification link expires, you can request a new verification link by
      logging in with your correct credentials.
    </p>

    <p style="{{styles.paragraph}}">
      Please verify your email address before {{formatDate deletionScheduledAt}}.
      Your account will be automatically deleted if it has not been verified by then.
    </p>

    <p style="{{styles.paragraph}}">
      If the button doesn't work, copy and paste the following link into your browser:
    </p>

    <p style="{{styles.link}}">
      <a href="{{verificationUrl}}" style="{{styles.link}}">
        {{verificationUrl}}
      </a>
    </p>

    <p style="{{styles.paragraph}}">
      If you didn't create an account with {{appName}}, you can safely ignore this email.
    </p>
  </div>

  <p style="{{styles.footer}}">Securely powered by {{appName}}</p>
</body>
</html>
`;
