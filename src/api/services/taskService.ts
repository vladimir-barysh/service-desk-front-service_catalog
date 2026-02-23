import api from '../axios';

export const getTasks = async () => {
  const { data } = await api.get('/api/ordertask');
  return data;
}