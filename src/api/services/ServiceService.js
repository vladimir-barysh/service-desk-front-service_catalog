import api from '../axios';

export const getServices = async () => {
    const { data } = await api.get('/api/service');
    return data;
}