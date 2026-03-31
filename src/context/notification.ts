import { notifications } from '@mantine/notifications';

interface NotificationProps {
  title: string;
  message: string;
  color?: string;
}

export const showNotification = ({
  title,
  message,
  color = 'blue',
}: NotificationProps) => {
  notifications.show({
    title,
    message,
    color,
    autoClose: 3000,
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