import api from '../axios';

export const getOrderTypes = async () => {
    const { data } = await api.get('/api/ordertype');
    return data;
}