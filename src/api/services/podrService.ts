import api from '../axios';

export const getPodrs = async () => {
  const { data } = await api.get('/api/podr');
  return data;
}