import api from '../axios';

export const getUsers = async () => {
    const { data } = await api.get('/api/user');
    return data;
}