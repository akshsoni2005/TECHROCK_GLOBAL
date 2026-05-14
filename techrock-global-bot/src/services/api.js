import axios from 'axios';

// This connects React (5173) to Django (8000)
const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
});

// This function will fetch all clients from your Django database
export const getClients = () => API.get('clients/');

export default API;