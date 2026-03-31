import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateArticle } from '../services/articleService';
import { notifications } from '@mantine/notifications';
import { ArticleUpdateDTO } from '../dtos';
import { Article } from '../models';

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | undefined; data: ArticleUpdateDTO }) =>
      updateArticle(id, data),
    onSuccess: (updatedArticle, variables) => {

      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.setQueryData(['articles'], (old: Article[] | undefined) => {
        if (!old) return old;
        return old.map(article =>
          article.idArticle === variables.id ? { ...article, ...updatedArticle } : article
        );
      });

      notifications.show({
        title: 'Успешно',
        message: 'Заявка обновлена',
        color: 'green',
        autoClose: 4000,
        withCloseButton: true,
        withBorder: false,
        loading: false,
        styles: (theme) => ({
          root: {
            backgroundColor: theme.colors.green[6],
            borderColor: theme.colors.green[6],
          },
          title: { color: theme.white },
          description: { color: theme.white },
          closeButton: {
            color: theme.white,
            '&:hover': { backgroundColor: theme.colors.green[6] },
          },
        }),
      });
    },

    onError: (error: any) => {
      notifications.show({
        title: 'Ошибка',
        message: error?.response?.data?.message || error.message || 'Не удалось обновить заявку',
        color: 'red',
        autoClose: 4000,
        withCloseButton: true,
        withBorder: false,
        loading: false,
        styles: (theme) => ({
          root: {
            backgroundColor: theme.colors.red[6],
            borderColor: theme.colors.red[6],
          },
          title: { color: theme.white },
          description: { color: theme.white },
          closeButton: {
            color: theme.white,
            '&:hover': { backgroundColor: theme.colors.red[8] },
          },
        }),
      });
    },
  });
};