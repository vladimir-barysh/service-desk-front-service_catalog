import { notifications } from '@mantine/notifications';

interface NotificationProps {
  title: string;
  message?: string;
  color?: string;
}

export const showNotification = ({
  title = 'Ошибка',
  message = 'Пустое уведомление',
  color = 'red',
}: NotificationProps) => {

  // Определяем время автозакрытия в зависимости от цвета
  let autoCloseDuration: number;
  switch (color) {
    case 'green':
      autoCloseDuration = 2500;
      break;
    case 'orange':
      autoCloseDuration = 3000;
      break;
    default:
      autoCloseDuration = 7000;
  }

  notifications.show({
    title,
    message,
    color,
    autoClose: autoCloseDuration,
    styles: (theme) => ({
      root: {
        background: `linear-gradient(135deg, ${theme.white}, ${theme.colors[color][3]})`,
        border: 'none',
        borderRadius: theme.radius.md,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      },
      closeButton: {
        color: 'black',
        '&:hover': {
          backgroundColor: theme.colors[color][2],
        },
      },
    }),
  });
};