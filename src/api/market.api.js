import client from './client';

export const getSegments = async () => {
    const response = await client.get('/market/segments');
    return response.data;
};

export const getSymbols = async (segment) => {
    const query = segment ? `?segment=${segment}` : '';
    const response = await client.get(`/market/symbols${query}`);
    return response.data;
};



export const getMarketStats = async () => {
    const response = await client.get('/market/stats');
    return response.data;
};

export const getLoginUrl = async (provider) => {
    const response = await client.get(`/market/login/${provider}/url`);
    return response.data;
};

// --- CRUD Operations ---

export const createSegment = async (data) => {
    const response = await client.post('/market/segments', data);
    return response.data;
};

export const updateSegment = async (id, data) => {
    const response = await client.patch(`/market/segments/${id}`, data);
    return response.data;
};

export const deleteSegment = async (id) => {
    const response = await client.delete(`/market/segments/${id}`);
    return response.data;
};

export const createSymbol = async (data) => {
    const response = await client.post('/market/symbols', data);
    return response.data;
};

export const updateSymbol = async (id, data) => {
    const response = await client.patch(`/market/symbols/${id}`, data);
    return response.data;
};

export const deleteSymbol = async (id) => {
    const response = await client.delete(`/market/symbols/${id}`);
    return response.data;
};
