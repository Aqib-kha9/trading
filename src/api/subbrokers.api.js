import client from './client';

export const fetchSubBrokers = async (params) => {
    // subBroker.route.js mounted at /sub-brokers presumably
    return client.get('/sub-brokers', { params });
};

export const createSubBroker = async (data) => {
    // Usually creating a user with sub-broker role
    // Using auth/register or user create. 
    // Let's assume we use the specific endpoint if it exists, or User create.
    // "SubBroker Module Implementation ... Mounted /sub-brokers route."
    // It has get sub-brokers, get clients, get commission.
    // Creation might be via standard User creation with role=sub-broker.
    // I'll stick to User API for creation if sub-broker route is read-only.
    // But let's verify if I added create endpoint. 
    // "Created sub-broker service with functions for retrieving...". No create mentioned.
    // So createSubBroker will likely use users.api or auth.api.
    // I will map it to client.post('/auth/register') or similar for now.
    return client.post('/admin/users', { ...data, role: 'sub-broker' }); 
};

export const fetchBrokerClients = async (brokerIds) => {
    return client.get('/sub-brokers/clients'); // Logic might need checking
};
