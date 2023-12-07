import axios from 'axios';

export const getLinks = await axios.get(`/links/list`);
