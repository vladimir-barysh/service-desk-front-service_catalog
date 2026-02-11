import api from '../axios';
import { OrderCreateDTO } from '../dtos';

export const getOrders = async () => {
    const { data } = await api.get('/api/order');
    return data;
}

export const createOrder = async (payload: OrderCreateDTO) => {
        const response = await api.post('/api/order', payload);
        return response.data;
    }