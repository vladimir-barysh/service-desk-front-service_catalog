import api from '../axios';

export const getArticleCategories = async () => {
    const { data } = await api.get('/api/articlecategory');
    return data;
}
