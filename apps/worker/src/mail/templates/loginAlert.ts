export const loginAlertTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Sign-In to Your Account</title>
</head>
<body style="{{styles.main}}">
  <div style="{{styles.container}}">
    <p style="{{styles.tertiary}}">{{appName}}</p>

    <h1 style="{{styles.secondary}}">New Sign-In to Your Account</h1>

    <p style="{{styles.paragraph}}">Hi {{name}},</p>

    <p style="{{styles.paragraph}}">
      We noticed a new sign-in to your {{appName}} account:
    </p>

    <p style="{{styles.paragraph}}">
      Time: <b>{{formatDate time}}</b><br>
      Device / Browser: <b>{{deviceInfo}}</b>
    </p>

    <p style="{{styles.paragraph}}">
      If this was you, no action is needed. If you did not sign in, please secure your account
      immediately by changing your password.
    </p>
  </div>

  <p style="{{styles.footer}}">Securely powered by {{appName}}</p>
</body>
</html>
`;
