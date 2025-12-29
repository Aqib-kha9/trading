import client from './client';

export const fetchTickets = async (params) => {
    return client.get('/dashboard/tickets', { params }); // Using dashboard/tickets as per my route mount check?
    // Wait, let me re-verify route mount. 
    // routes/dashboard.route.js had /tickets mounted?
    // Looking at "Previous Session Summary": "Created dashboard routes for ticket creation... Mounted /dashboard route."
    // And in dashboard.route.js: router.get('/stats'...), router.post('/tickets'...)
    // So distinct endpoints under /dashboard.
};

export const createTicket = async (data) => {
    return client.post('/dashboard/tickets', data);
};

export const updateTicket = async (id, data) => {
    return client.patch(`/dashboard/tickets/${id}`, data);
};
