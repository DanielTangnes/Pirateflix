Collecting workspace information# Pirateflix - Netflix-Inspired Streaming Platform

Pirateflix is a Netflix-inspired web application that allows users to browse and stream movies and TV shows. The application uses the TMDB API to fetch movie data and posters, and integrates with torrent sources for streaming content.

![Pirateflix Screenshot](https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg)

## Features

- Netflix-like user interface with rows of movie categories
- Dynamic banner showcasing random featured titles
- Responsive design that works on various screen sizes
- Movie/TV show streaming directly in the browser
- Integration with TMDB API for movie metadata
- On-demand content streaming

## Technology Stack

- **Frontend**: React 18, React Router 6
- **APIs**: TMDB API, Torrent Search API
- **Streaming**: HLS.js for streaming media content
- **Backend**: Express.js server for handling torrent streams
- **Video Processing**: fluent-ffmpeg for converting video formats
- **Torrent Handling**: torrent-stream for processing magnet links

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pirateflix.git
   cd pirateflix
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file in the root directory with your API keys:
   ```
   REACT_APP_RAPIDAPI_KEY=your_rapidapi_key
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. In a separate terminal, start the backend server:
   ```bash
   npm run server
   ```

6. Open your browser and navigate to `http://localhost:3000`

## Project Structure

- src - React components and frontend code
- public - Static assets and HTML template
- server.js - Backend server for handling torrent streams

## Key Components

- App.js - Main application component with routing
- Row.js - Displays a row of movies by category
- Banner.js - Hero banner with featured content
- Nav.js - Navigation bar with logo and user avatar
- StreamingModal.js - Modal for streaming content
- server.js - Backend for handling torrent streams

## API Requirements

This application requires:
1. A TMDB API key (used in requests.js)
2. A RapidAPI key for Torrent Search API (used in Row.js and .env)

## Legal Disclaimer

This application is designed for educational purposes only. Users are responsible for complying with local laws regarding content streaming and copyright. The developers of this application do not condone or promote piracy.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Netflix for UI inspiration
- TMDB for their comprehensive movie database API
- All open-source libraries used in this project