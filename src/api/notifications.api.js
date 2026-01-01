
import client from './client';

export const getMyNotifications = async () => {
    return client.get('/notifications');
};

export const markAsRead = async (id) => {
    return client.patch(`/notifications/${id}/read`);
};

export const markAllAsRead = async () => {
    return client.patch('/notifications/read-all');
};
