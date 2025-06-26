import React from 'react';
import { getLogs } from '../middleware/LoggingMiddleware';
import { Box, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';

function Statistics() {
  const logs = getLogs();

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: 'auto', backgroundColor: '#f9f9f9', borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        URL Shortener Statistics
      </Typography>
      <Paper sx={{ p: 3, mb: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Logs
        </Typography>
        {logs.length === 0 ? (
          <Typography>No logs available.</Typography>
        ) : (
          <List>
            {logs.map((log, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={log.timestamp}
                  secondary={JSON.stringify(log.action)}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
      <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Shortened URLs Stats
        </Typography>
        <Typography>Click analytics and detailed stats will be implemented here.</Typography>
      </Paper>
    </Box>
  );
}

export default Statistics;
