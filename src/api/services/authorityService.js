import api from '../axios';

export const getAuthorities = async () => {
  const { data } = await api.get('/api/authority');
  return data;
};

export const createAuthority = async (authority) => {
  const { data } = await api.post('/api/authority', authority);
  return data;
};