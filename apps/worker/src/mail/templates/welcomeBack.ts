export const welcomeBackTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome Back to {{appName}}</title>
</head>
<body style="{{styles.main}}">
  <div style="{{styles.container}}">
    <p style="{{styles.tertiary}}">{{appName}}</p>

    <h1 style="{{styles.secondary}}">Welcome Back to {{appName}}</h1>

    <p style="{{styles.paragraph}}">Hi {{name}},</p>

    <p style="{{styles.paragraph}}">
      We’re glad to see you back. Your account has been successfully reactivated, and you can
      continue where you left off.
    </p>

    <p style="{{styles.paragraph}}">
      Your account was reactivated by a new login:
    </p>

    <p style="{{styles.paragraph}}">
      Time: <b>{{formatDate time}}</b><br>
      Device / Browser: <b>{{deviceInfo}}</b>
    </p>

    <p style="{{styles.paragraph}}">
      If this was you, no action is needed. If you did not log in, please secure your account
      immediately by changing your password.
    </p>
  </div>

  <p style="{{styles.footer}}">Securely powered by {{appName}}</p>
</body>
</html>
`;
