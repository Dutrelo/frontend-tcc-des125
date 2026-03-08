import axios from 'axios';

const api = axios.create({
  // Atualizamos para a porta oficial que vimos no print!
  baseURL: 'http://localhost:3333', 
});

export default api;