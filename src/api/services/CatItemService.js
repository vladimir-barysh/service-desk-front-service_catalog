import api from '../axios';

export const getCatItems = async () => {
    const { data } = await api.get('/api/catitem');
    return data;
}