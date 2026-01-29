import api from '../axios';

export const getOrders = async () => {
    const { data } = await api.get('/api/order');
    return data;
}