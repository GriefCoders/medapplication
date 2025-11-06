export const getEmailServiceUrl = (email: string) => {
  const domain = email.split("@")[1]?.toLowerCase();

  switch (domain) {
    case "gmail.com":
      return "https://mail.google.com";
    case "yandex.ru":
    case "yandex.com":
    case "ya.ru":
      return "https://mail.yandex.ru";
    case "mail.ru":
    case "bk.ru":
    case "list.ru":
    case "inbox.ru":
      return "https://mail.ru";
    case "outlook.com":
    case "hotmail.com":
    case "live.com":
      return "https://outlook.live.com";
    case "icloud.com":
    case "me.com":
    case "mac.com":
      return "https://icloud.com/mail";
    case "rambler.ru":
      return "https://mail.rambler.ru";
    default:
      return `https://${domain}`;
  }
};
