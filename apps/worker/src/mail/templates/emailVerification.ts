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
      Welcome to {{appName}}. Click the button below to verify your email address and activate
      your account.
    </p>

    <div style="{{styles.centeredSection}}">
      <a href="{{verificationUrl}}" style="{{styles.button}}">
        Verify Your Email
      </a>
    </div>

    <p style="{{styles.paragraph}}">
      This verification link is valid until {{formatDate date}}.
    </p>

    <p style="{{styles.paragraph}}">
      If the button doesn’t work, copy and paste the following link into your browser:
    </p>

    <p style="{{styles.link}}">{{verificationUrl}}</p>
  </div>

  <p style="{{styles.footer}}">Securely powered by {{appName}}</p>
</body>
</html>
`;
