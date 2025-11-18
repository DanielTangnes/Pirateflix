import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import StreamingModal from './StreamingModal';
import DetailsModal from './DetailsModal';
import './Search.css';
import axios from './axios';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
const API_KEY = '88f05f1d6e70e3fff58f39e53f03b723';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [magnetURI, setMagnetURI] = useState('');
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const onSearch = async (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    try {
      const resp = await axios.get(`/search/multi?api_key=${API_KEY}&include_adult=false&query=${encodeURIComponent(q)}`);
      setResults(resp.data.results || []);
    } catch (err) {
      console.error(err);
      setResults([]);
    }
  };

  // Read ?q= from URL and search automatically
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = (params.get('q') || '').trim();
    if (q) {
      setQuery(q);
      (async () => {
        try {
          const resp = await axios.get(`/search/multi?api_key=${API_KEY}&include_adult=false&query=${encodeURIComponent(q)}`);
          setResults(resp.data.results || []);
        } catch (err) {
          console.error(err);
        }
      })();
    }
  }, [location.search]);

  const playTitle = async (title) => {
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
    } catch (e) {
      console.error(e);
      alert('Failed to find a magnet link.');
    }
  };

  return (
    <div className="search">
      <form className="search__form" onSubmit={onSearch}>
        <input
          className="search__input"
          type="text"
          value={query}
          placeholder="Search for a movie..."
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="search__button" type="submit">Search</button>
      </form>
      <div className="search__grid">
        {results
          .filter((m) => m.media_type === 'movie' || m.media_type === 'tv' || (m.title || m.name))
          .map((m) => {
            const title = m.title || m.name || m.original_name;
            const img = m.poster_path ? `${IMG_BASE}${m.poster_path}` : '';
            return (
              <div className="search__posterWrap" key={`${m.media_type || 'any'}-${m.id}-${title}`}>
                <img
                  className="search__poster"
                  src={img}
                  alt={title}
                  onClick={() => {
                    setSelectedItem(m);
                    setDetailsOpen(true);
                  }}
                />
                <div className="search__titleOverlay">{title}</div>
              </div>
            );
          })}
      </div>
      {detailsOpen && selectedItem && (
        <DetailsModal
          movie={selectedItem}
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
  );
}

export default Search;


