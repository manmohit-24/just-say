export const accountDeactivationAlertTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Account Has Been Deactivated</title>
</head>
<body style="{{styles.main}}">
  <div style="{{styles.container}}">
    <p style="{{styles.tertiary}}">{{appName}}</p>

    <h1 style="{{styles.secondary}}">Your Account Has Been Deactivated</h1>

    <p style="{{styles.paragraph}}">Hi {{name}},</p>

    <p style="{{styles.paragraph}}">
      Your {{appName}} account has been deactivated. You will no longer be able to access your
      account until it is reactivated.
    </p>

    <p style="{{styles.paragraph}}">
      To reactivate your account, simply log in again using your existing credentials. Your
      account will be restored automatically after a successful login.
    </p>

    <p style="{{styles.paragraph}}">
      If you did not deactivate your account, log in immediately and secure your account.
    </p>
  </div>

  <p style="{{styles.footer}}">Securely powered by {{appName}}</p>
</body>
</html>
`;
