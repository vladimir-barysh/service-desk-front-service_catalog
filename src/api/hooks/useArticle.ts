import { createCRUDMutation } from './createCRUDMutation';
import { updateArticle, createArticle } from '../services/articleService';
import { ArticleUpdateDTO, ArticleCreateDTO } from '../dtos';

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

export const useCreateArticle = createCRUDMutation({
  type: 'create',
  mutationFn: (data: ArticleCreateDTO) => createArticle(data),
  queryKey: ['articles'],
  addToCache: (old, newArticle) => (old ? [newArticle, ...old] : [newArticle]),
  successMessage: 'Статья создана',
  errorMessage: 'Не удалось создать статью',
});