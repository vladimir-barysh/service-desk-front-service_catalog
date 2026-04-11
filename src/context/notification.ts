/* 
 *  showNotification - компонент для отображений единых уведомлений во всём приложении
 *
 *  title - основной текст уведомлений. По умолчанию - 'Ошибка'
 *  message - дополнительный текст, который выводится под основным и вносит ясность в уведомление.
 *            По умолчанию - 'Пустое уведомление'
 *  color - цвет фона уведомления. По умолчанию - 'red'
 *          red - ошибка
 *          green - успех
 *          orange -предупреждение     
 */

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
      autoCloseDuration = 10000;
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