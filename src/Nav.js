import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Nav.css';

function Nav() {
    const [show, handleShow] = useState(false);
    const [q, setQ] = useState('');
    const history = useHistory();

    useEffect(() => {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 100) {
                handleShow(true);
            }
            else handleShow(false);
        });
        return () => {
            window.removeEventListener("scroll");
        };
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        const query = q.trim();
        if (!query) return;
        history.push(`/?q=${encodeURIComponent(query)}`);
        setQ('');
        // Scroll a bit below the nav for UX
        window.scrollTo({ top: 120, behavior: 'smooth' });
    };

    return (
        <div className={`nav ${show && "nav__black"}`}>
            <div className="nav__left">
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" alt="Netflix Logo" className="nav__logo" />
            </div>
            <div className="nav__center">
                <form className="nav__search" onSubmit={onSubmit}>
                    <input
                        className="nav__searchInput"
                        type="text"
                        value={q}
                        placeholder="Search"
                        onChange={(e) => setQ(e.target.value)}
                    />
                </form>
            </div>
            <div className="nav__right">
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="Netflix Avatar" className="nav__avatar" />
            </div>
        </div>
        
    )
}

export default Nav;

