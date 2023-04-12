import axios from 'axios';

const instance = axios.create({
    method: 'GET',
    url: 'https://torrent-search3.p.rapidapi.com/torrent/piratebay/The%20night%20agent',
    headers: {
      'X-RapidAPI-Key': '9d166f6c8emsh5deae1cf9026e08p136a6ejsn78d5643434c7',
      'X-RapidAPI-Host': 'torrent-search3.p.rapidapi.com'
    },
});

export default instance;
