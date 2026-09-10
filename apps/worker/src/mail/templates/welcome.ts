export const welcomeTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to {{appName}}</title>
</head>
<body style="{{styles.main}}">
  <div style="{{styles.container}}">
    <p style="{{styles.tertiary}}">{{appName}}</p>

    <h1 style="{{styles.secondary}}">Welcome to {{appName}}</h1>

    <p style="{{styles.paragraph}}">Hi {{name}},</p>

    <p style="{{styles.paragraph}}">
      Welcome to {{appName}}. We’re excited to have you on board. Start exploring and make the
      most out of your new account.
    </p>

    <div style="{{styles.centeredSection}}">
      <a href="{{dashboardLink}}" style="{{styles.button}}">
        Go to Dashboard
      </a>
    </div>
  </div>

  <p style="{{styles.footer}}">Securely powered by {{appName}}</p>
</body>
</html>
`;
