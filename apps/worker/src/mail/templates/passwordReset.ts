export const passwordResetTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="{{styles.main}}">
  <div style="{{styles.container}}">
    <p style="{{styles.tertiary}}">{{appName}}</p>

    <h1 style="{{styles.secondary}}">Reset Your Password</h1>

    <p style="{{styles.paragraph}}">Hi {{name}},</p>

    <p style="{{styles.paragraph}}">
      We received a request to reset your {{appName}} account password. Click the button below
      to set a new password.
    </p>

    <div style="{{styles.centeredSection}}">
      <a href="{{resetUrl}}" style="{{styles.button}}">
        Reset Password
      </a>
    </div>

    <p style="{{styles.paragraph}}">
      This password reset link is valid for the next 30 minutes.
    </p>

    <p style="{{styles.paragraph}}">
      If you did not request a password reset, you can safely ignore this email.
    </p>
  </div>

  <p style="{{styles.footer}}">Securely powered by {{appName}}</p>
</body>
</html>
`;
