import { createCRUDMutation } from './createCRUDMutation';
import { updateArticle } from '../services/articleService';
import { ArticleUpdateDTO } from '../dtos';

export const useUpdateArticle = createCRUDMutation({
  type: 'update',
  mutationFn: ({ id, data }: { id: number | undefined; data: ArticleUpdateDTO }) =>
    updateArticle(id, data),
  queryKey: ['articles'],
  getEntityId: (vars) => vars.id!,
  idField: 'idArticle',
  successMessage: 'Статья обновлена',
  errorMessage: 'Не удалось обновить статью',
});