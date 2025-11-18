import React, { useEffect, useMemo, useState } from 'react';
import axios from './axios';
import './DetailsModal.css';

const IMG_BASE = 'https://image.tmdb.org/t/p/original';
const API_KEY = '88f05f1d6e70e3fff58f39e53f03b723';

function DetailsModal({ movie, onClose, onPlay }) {
  const safeMovie = movie || {};
  const title = safeMovie.title || safeMovie.name || safeMovie.original_name || '';
  const year = (safeMovie.release_date || safeMovie.first_air_date || '').slice(0, 4);
  const vote = typeof safeMovie.vote_average === 'number' ? safeMovie.vote_average.toFixed(1) : safeMovie.vote_average;
  const backdrop = safeMovie.backdrop_path ? `${IMG_BASE}${safeMovie.backdrop_path}` : (safeMovie.poster_path ? `${IMG_BASE}${safeMovie.poster_path}` : '');
  const isTV = useMemo(() => {
    if (!safeMovie) return false;
    if (safeMovie.media_type) return safeMovie.media_type === 'tv';
    return !!safeMovie.first_air_date || (!!safeMovie.name && !safeMovie.title);
  }, [safeMovie]);

  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedEpisode, setSelectedEpisode] = useState('');

  // Fetch seasons for TV shows
  useEffect(() => {
    let cancelled = false;
    if (!isTV) return;
    (async () => {
      try {
        if (!safeMovie?.id) return;
        const resp = await axios.get(`/tv/${safeMovie.id}?api_key=${API_KEY}`);
        const tvSeasons = (resp.data?.seasons || []).filter(s => s.season_number > 0 && s.episode_count > 0);
        if (cancelled) return;
        setSeasons(tvSeasons);
        if (tvSeasons.length > 0) {
          const firstSeasonNum = tvSeasons[0].season_number;
          setSelectedSeason(String(firstSeasonNum));
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => { cancelled = true; };
  }, [isTV, movie]);

  // Fetch episodes when season changes
  useEffect(() => {
    let cancelled = false;
    if (!isTV || !selectedSeason) return;
    (async () => {
      try {
        if (!safeMovie?.id) return;
        const resp = await axios.get(`/tv/${safeMovie.id}/season/${selectedSeason}?api_key=${API_KEY}`);
        const eps = resp.data?.episodes || [];
        if (cancelled) return;
        setEpisodes(eps);
        if (eps.length > 0) {
          setSelectedEpisode(String(eps[0].episode_number));
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => { cancelled = true; };
  }, [isTV, movie, selectedSeason]);

  const handlePlay = () => {
    if (isTV && selectedSeason && selectedEpisode) {
      const s = String(selectedSeason).padStart(2, '0');
      const e = String(selectedEpisode).padStart(2, '0');
      const q = `${title} S${s}E${e}`;
      onPlay(q);
    } else {
      onPlay(title);
    }
  };

  if (!movie) return null;

  return (
    <div className="details-modal" onClick={onClose}>
      <div className="details-modal__content" onClick={(e) => e.stopPropagation()}>
        <div
          className="details-modal__backdrop"
          style={{ backgroundImage: `url(${backdrop})` }}
        >
          <div className="details-modal__gradient" />
          <div className="details-modal__close" onClick={onClose}>&times;</div>
        </div>
        <div className="details-modal__body">
          <div className="details-modal__title">{title}</div>
          <div className="details-modal__meta">
            {year ? <span>{year}</span> : null}
            {vote ? <span>Rating: {vote}</span> : null}
            {movie.adult ? <span>18+</span> : <span>PG-13</span>}
          </div>
          <div className="details-modal__overview">
            {movie.overview || 'No description available.'}
          </div>
          {isTV && (
            <div className="details-modal__picker">
              <label>
                Season
                <select
                  className="details-modal__select"
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                >
                  {seasons.map((s) => (
                    <option key={s.id || s.season_number} value={s.season_number}>
                      {s.name || `Season ${s.season_number}`}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Episode
                <select
                  className="details-modal__select"
                  value={selectedEpisode}
                  onChange={(e) => setSelectedEpisode(e.target.value)}
                >
                  {episodes.map((ep) => (
                    <option key={ep.id || ep.episode_number} value={ep.episode_number}>
                      {ep.episode_number}. {ep.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
          <div className="details-modal__actions">
            <button className="details-modal__button" onClick={handlePlay}>
              Play
            </button>
            <button className="details-modal__button details-modal__button--secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailsModal;


