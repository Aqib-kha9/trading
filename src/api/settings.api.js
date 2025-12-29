import client from './client';

export const getSetting = (key) => client.get(`/settings/${key}`);
export const updateSetting = (key, data) => client.post(`/settings/${key}`, data);
