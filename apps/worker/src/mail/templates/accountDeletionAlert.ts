export const accountDeletionAlertTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Account Deletion Request</title>
</head>
<body style="{{styles.main}}">
  <div style="{{styles.container}}">
    <p style="{{styles.tertiary}}">{{appName}}</p>

    <h1 style="{{styles.secondary}}">Your Account Deletion Request</h1>

    <p style="{{styles.paragraph}}">Hi {{name}},</p>

    <p style="{{styles.paragraph}}">
      We received a request to delete your {{appName}} account. If you made this request, no
      action is needed. Your account is scheduled for permanent deletion on
      <i><b>{{formatDate date}}</b></i>.
    </p>

    <p style="{{styles.paragraph}}">
      Changed your mind? Simply log in again before the deletion date to cancel the deletion and
      restore your account.
    </p>

    <div style="{{styles.codeContainer}}">
      <p style="{{styles.tertiaryDeletionDate}}">Account Deletion Date</p>
      <p style="{{styles.secondary}}">{{formatDate date}}</p>
    </div>

    <p style="{{styles.paragraph}}">
      If you did not request this deletion, log in immediately and secure your account.
    </p>
  </div>

  <p style="{{styles.footer}}">Securely powered by {{appName}}</p>
</body>
</html>
`;
