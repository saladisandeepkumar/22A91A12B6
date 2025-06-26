import React, { useState, useEffect } from 'react';
import { logAction } from '../middleware/LoggingMiddleware';
import { generateRandomShortcode, isValidUrl, isValidValidityPeriod, getExpiryDate } from '../utils/urlUtils';
import { TextField, Button, Typography, Box, Paper, Link as MuiLink } from '@mui/material';

const MAX_URLS = 5;
const DEFAULT_VALIDITY_MINUTES = 30;

function UrlShortener({ setShortenedUrls, shortenedUrls }) {
  const [urls, setUrls] = useState([
    { originalUrl: '', validity: '', shortcode: '', shortenedUrl: '', expiryDate: null, error: '' }
  ]);
  const [existingShortcodes, setExistingShortcodes] = useState(new Set());

  useEffect(() => {
    if (shortenedUrls && shortenedUrls.length > 0) {
      const shortcodesSet = new Set(shortenedUrls.map(u => u.shortcode));
      setExistingShortcodes(shortcodesSet);
    }
  }, [shortenedUrls]);

  useEffect(() => {
    if (setShortenedUrls) {
      const shortened = urls
        .filter(u => u.shortenedUrl)
        .map(u => ({
          originalUrl: u.originalUrl,
          shortcode: u.shortcode,
          shortenedUrl: u.shortenedUrl,
          expiryDate: u.expiryDate,
          clicks: 0,
          clickDetails: []
        }));
      setShortenedUrls(prev => {
        const merged = [...prev];
        shortened.forEach(newUrl => {
          const index = merged.findIndex(u => u.shortcode === newUrl.shortcode);
          if (index === -1) {
            merged.push(newUrl);
          } else {
            merged[index] = newUrl;
          }
        });
        return merged;
      });
    }
  }, [urls, setShortenedUrls]);

  const handleInputChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    newUrls[index].error = '';
    setUrls(newUrls);
  };

  const validateInputs = () => {
    let valid = true;
    const newUrls = [...urls];
    for (let i = 0; i < newUrls.length; i++) {
      const urlObj = newUrls[i];
      if (!urlObj.originalUrl || !isValidUrl(urlObj.originalUrl)) {
        urlObj.error = 'Invalid URL';
        valid = false;
      } else if (urlObj.validity && !isValidValidityPeriod(Number(urlObj.validity))) {
        urlObj.error = 'Validity must be a positive integer';
        valid = false;
      } else if (urlObj.shortcode && existingShortcodes.has(urlObj.shortcode)) {
        urlObj.error = 'Shortcode already in use';
        valid = false;
      } else {
        urlObj.error = '';
      }
    }
    setUrls(newUrls);
    return valid;
  };

  const handleAddUrl = () => {
    if (urls.length < MAX_URLS) {
      setUrls([...urls, { originalUrl: '', validity: '', shortcode: '', shortenedUrl: '', expiryDate: null, error: '' }]);
    }
  };

  const handleShorten = () => {
    if (!validateInputs()) return;

    const newExistingShortcodes = new Set(existingShortcodes);

    const newUrls = urls.map(urlObj => {
      let shortcode = urlObj.shortcode;
      if (!shortcode) {
        shortcode = generateRandomShortcode(newExistingShortcodes);
      }
      newExistingShortcodes.add(shortcode);

      const validityMinutes = urlObj.validity ? Number(urlObj.validity) : DEFAULT_VALIDITY_MINUTES;
      const expiryDate = getExpiryDate(validityMinutes);

      const shortenedUrl = window.location.origin + '/' + shortcode;

      logAction({
        type: 'SHORTEN_URL',
        originalUrl: urlObj.originalUrl,
        shortcode,
        validityMinutes,
        expiryDate: expiryDate.toISOString()
      });

      return { ...urlObj, shortcode, shortenedUrl, expiryDate };
    });

    setUrls(newUrls);
    setExistingShortcodes(newExistingShortcodes);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: 'auto', backgroundColor: '#f9f9f9', borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        URL Shortener
      </Typography>
      {urls.map((urlObj, index) => (
        <Paper key={index} sx={{ p: 3, mb: 3, boxShadow: 3, borderRadius: 2 }}>
          <TextField
            label="Original URL"
            fullWidth
            margin="normal"
            value={urlObj.originalUrl}
            onChange={e => handleInputChange(index, 'originalUrl', e.target.value)}
            error={!!urlObj.error && urlObj.error.includes('URL')}
            helperText={urlObj.error && urlObj.error.includes('URL') ? urlObj.error : ''}
          />
          <TextField
            label="Validity (minutes, optional)"
            fullWidth
            margin="normal"
            type="number"
            inputProps={{ min: 1 }}
            value={urlObj.validity}
            onChange={e => handleInputChange(index, 'validity', e.target.value)}
            error={!!urlObj.error && urlObj.error.includes('Validity')}
            helperText={urlObj.error && urlObj.error.includes('Validity') ? urlObj.error : ''}
            sx={{
              backgroundColor: '#e8f0fe',
              borderRadius: 1,
              '& .MuiInputBase-root': {
                color: '#1a237e',
                fontWeight: '600',
              },
              '& .MuiFormLabel-root': {
                color: '#3949ab',
                fontWeight: 'bold',
              },
              '& .MuiInputBase-root.Mui-error': {
                backgroundColor: '#ffebee',
              },
            }}
          />
          <TextField
            label="Preferred Shortcode (optional)"
            fullWidth
            margin="normal"
            value={urlObj.shortcode}
            onChange={e => handleInputChange(index, 'shortcode', e.target.value)}
            error={!!urlObj.error && urlObj.error.includes('Shortcode')}
            helperText={urlObj.error && urlObj.error.includes('Shortcode') ? urlObj.error : ''}
            sx={{
              backgroundColor: '#e8f0fe',
              borderRadius: 1,
              '& .MuiInputBase-root': {
                color: '#1a237e',
                fontWeight: '600',
              },
              '& .MuiFormLabel-root': {
                color: '#3949ab',
                fontWeight: 'bold',
              },
              '& .MuiInputBase-root.Mui-error': {
                backgroundColor: '#ffebee',
              },
            }}
          />
          {urlObj.shortenedUrl && (
            <Box sx={{ mt: 2, backgroundColor: '#e3f2fd', p: 2, borderRadius: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Shortened URL:{' '}
                <MuiLink href={urlObj.shortenedUrl} target="_blank" rel="noopener noreferrer" sx={{ color: '#1565c0' }}>
                  {urlObj.shortenedUrl}
                </MuiLink>
              </Typography>
              <Typography variant="subtitle2" sx={{ color: '#0d47a1' }}>
                Expires At: {urlObj.expiryDate ? new Date(urlObj.expiryDate).toLocaleString() : 'N/A'}
              </Typography>
            </Box>
          )}
        </Paper>
      ))}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        {urls.length < MAX_URLS && (
          <Button variant="outlined" onClick={handleAddUrl} sx={{ mr: 2 }}>
            Add Another URL
          </Button>
        )}
        <Button variant="contained" color="primary" onClick={handleShorten}>
          Shorten URLs
        </Button>
      </Box>
    </Box>
  );
}

export default UrlShortener;
