export const emailChangeVerificationTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your New Email Address</title>
</head>
<body style="{{styles.main}}">
  <div style="{{styles.container}}">
    <p style="{{styles.tertiary}}">{{appName}}</p>

    <h1 style="{{styles.secondary}}">Verify Your New Email Address</h1>

    <p style="{{styles.paragraph}}">
      Enter the verification code below to confirm your new email address:
    </p>

    <div style="{{styles.codeContainer}}">
      <p style="{{styles.code}}">{{otp}}</p>
    </div>

    <p style="{{styles.paragraph}}">
      This verification code is valid for the next 5 minutes.
    </p>

    <p style="{{styles.paragraph}}">
      If you did not request to change your email address, you can safely ignore this email.
    </p>
  </div>

  <p style="{{styles.footer}}">Securely powered by {{appName}}</p>
</body>
</html>
`;
