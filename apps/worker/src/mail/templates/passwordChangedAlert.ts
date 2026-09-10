export const passwordChangedAlertTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Password Was Changed</title>
</head>
<body style="{{styles.main}}">
  <div style="{{styles.container}}">
    <p style="{{styles.tertiary}}">{{appName}}</p>

    <h1 style="{{styles.secondary}}">Your Password Was Changed</h1>

    <p style="{{styles.paragraph}}">Hi {{name}},</p>

    <p style="{{styles.paragraph}}">
      Your {{appName}} account password was successfully changed.
    </p>

    <p style="{{styles.paragraph}}">
      Time: <b>{{formatDate time}}</b>
    </p>

    <p style="{{styles.paragraph}}">
      If you made this change, no action is needed. If you did not change your password, please
      secure your account immediately.
    </p>
  </div>

  <p style="{{styles.footer}}">Securely powered by {{appName}}</p>
</body>
</html>
`;
