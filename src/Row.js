import React, { useState, useEffect } from 'react'
import axios from './axios';
import StreamingModal from './StreamingModal';
import DetailsModal from './DetailsModal';
import './Row.css';

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow, overview }) {
    const [movies, setMovies] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [magnetURI, setMagnetURI] = useState('');
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);

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
                {movies.map(movie => {
                    const displayTitle = `${movie.name || movie.title || movie.original_name}`;
                    return (
                        <div className="row__posterWrap" key={movie.id}>
                            <img onClick={() => {
                                setSelectedMovie(movie);
                                setDetailsOpen(true);
                              }}
                            className={`row__poster ${isLargeRow && "row__posterLarge"}`} 
                            src={`${base_url}${isLargeRow ? movie.poster_path: movie.backdrop_path}`}
                            alt={displayTitle}
                            />
                            <div className="row__titleOverlay">{displayTitle}</div>
                        </div>
                    )
                })}
            </div>
            {detailsOpen && selectedMovie && (
              <DetailsModal
                movie={selectedMovie}
                onClose={() => setDetailsOpen(false)}
                onPlay={async (title) => {
                  try {
                    const resp = await fetch(`/api/search?q=${encodeURIComponent(title)}`);
                    if (!resp.ok) throw new Error('Search API error');
                    const data = await resp.json();
                    const first = (data.results || [])[0];
                    if (!first || !first.magnet) {
                      alert('No streamable torrents found for this title.');
                      return;
                    }
                    setMagnetURI(first.magnet);
                    setShowModal(true);
                    setDetailsOpen(false);
                  } catch (e) {
                    console.error(e);
                    alert('Failed to find a magnet link.');
                  }
                }}
              />
            )}
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