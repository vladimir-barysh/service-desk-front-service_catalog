import api from '../axios';
import { ArticleCreateDTO, ArticleUpdateDTO } from '../dtos';

export const getArticles = async () => {
  const { data } = await api.get('/api/article');
  return data;
}

export const createArticle = async (data: ArticleCreateDTO) => {
  const response = await api.post('/api/article', data);
  return response.data;
}

export const updateArticle = async (id: number | undefined, dto: ArticleUpdateDTO) => {
  const response = await api.put(`/api/article/${id}`, dto);
  return response.data;
}