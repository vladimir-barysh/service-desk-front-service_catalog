import api from '../axios';

export const getAuthorities = async () => {
  const { data } = await api.get('/api/authorities');
  return data;
};

export const createAuthority = async (authority) => {
  const { data } = await api.post('/api/authorities', authority);
  return data;
};