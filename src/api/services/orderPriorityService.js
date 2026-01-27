import api from '../axios';

export const getOrderPriorities = async () => {
    const { data } = await api.get('/api/orderpriority');
    return data;
}