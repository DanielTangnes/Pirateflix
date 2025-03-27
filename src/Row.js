import React, { useState, useEffect } from 'react'
import axios from './axios';
import pirateBayAxios from './pirateBayAxios';
import StreamingModal from './StreamingModal';
import './Row.css';

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow, overview }) {
    const [movies, setMovies] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [magnetURI, setMagnetURI] = useState('');

    useEffect(() => {
        async function fetchData(){
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results)
            return request;
        }
        fetchData();

    }, [fetchUrl]);
    

    
    return (
        <div className="row">
            <h2>{title}</h2>

            <div className="row__posters">
                {movies.map(movie => (
                    <img onClick={() => {
                        const query = `${movie.name || movie.title || movie.original_name}`;
                        const options = {
                          method: 'GET',
                          url: `https://torrent-search3.p.rapidapi.com/torrent/piratebay/${encodeURIComponent(query)}`,
                          headers: {
                            'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
                            'X-RapidAPI-Host': 'torrent-search3.p.rapidapi.com',
                          },
                        };
                        pirateBayAxios.request(options).then(function (response) {
                          const magnet = response.data[0].Magnet;
                          setMagnetURI(magnet);
                          setShowModal(true);
                        }).catch(function (error) {
                          console.error(error);
                        });
                      }}                      
                    key={movie.id}
                    className={`row__poster ${isLargeRow && "row__posterLarge"}`} 
                    src={`${base_url}${isLargeRow ? movie.poster_path: movie.backdrop_path}`}
                    alt={movie.name}
                    href="#/Movie"
                    />
                ))}
            </div>
            {showModal && (
              <StreamingModal
                magnetURI={magnetURI}
                closeModal={() => setShowModal(false)}
              />
            )}
        </div>
    )
}

export default Row