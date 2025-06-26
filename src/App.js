import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, Navigate } from 'react-router-dom';
import UrlShortener from './components/UrlShortener';
import Statistics from './components/Statistics';

const LOCAL_STORAGE_KEY = 'shortenedUrls';

const RedirectShortcode = ({ shortenedUrls }) => {
  const { shortcode } = useParams();
  const urlEntry = shortenedUrls.find(u => u.shortcode === shortcode);

  if (urlEntry) {
    const now = new Date();
    if (urlEntry.expiryDate && new Date(urlEntry.expiryDate) > now) {
      window.location.href = urlEntry.originalUrl;
      return null;
    } else {
      return <div>Shortened URL expired.</div>;
    }
  } else {
    return <div>Shortened URL not found.</div>;
  }
};

function App() {
  const [shortenedUrls, setShortenedUrls] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(shortenedUrls));
  }, [shortenedUrls]);

  return (
    <Router>
      <nav style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
        <Link to="/" style={{ marginRight: '10px' }}>URL Shortener</Link>
        <Link to="/statistics">Statistics</Link>
      </nav>
      <Routes>
        <Route path="/" element={<UrlShortener setShortenedUrls={setShortenedUrls} shortenedUrls={shortenedUrls} />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/:shortcode" element={<RedirectShortcode shortenedUrls={shortenedUrls} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
