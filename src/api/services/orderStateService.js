import api from '../axios';

export const getOrderStates = async () => {
    const { data } = await api.get('/api/orderstate');
    return data;
}