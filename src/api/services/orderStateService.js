import api from '../axios';

export const getorderStates = async () => {
    const { data } = await api.get('/api/orderstate');
    return data;
}