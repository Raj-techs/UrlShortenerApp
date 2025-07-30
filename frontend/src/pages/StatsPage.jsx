import React, { useState, useEffect } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getShortUrlStats, getAllShortUrls } from '../api';
import { log, logError } from '../utils/logger';

const StatsPage = () => {
  const [allUrls, setAllUrls] = useState([]);
  const [selectedStats, setSelectedStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getAllShortUrls();
        setAllUrls(response.data);
        log('Fetched all short URLs');
      } catch (error) {
        logError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleShowDetails = async (shortcode) => {
    setLoading(true);
    try {
      const response = await getShortUrlStats(shortcode);
      setSelectedStats(response.data);
      log(`Fetched stats for ${shortcode}`);
    } catch (error) {
      logError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>URL Statistics</Typography>
      
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Short Code</TableCell>
              <TableCell>Original URL</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Clicks</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allUrls.map((url) => (
              <TableRow key={url.shortCode}>
                <TableCell>{url.shortCode}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {url.originalUrl}
                </TableCell>
                <TableCell>{new Date(url.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{url.totalClicks}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleShowDetails(url.shortCode)}
                    disabled={loading}
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedStats && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Details for: {selectedStats.shortCode}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ mb: 2 }}>
              <Typography><strong>Original URL:</strong> {selectedStats.originalUrl}</Typography>
              <Typography><strong>Created:</strong> {new Date(selectedStats.createdAt).toLocaleString()}</Typography>
              <Typography><strong>Expires:</strong> {new Date(selectedStats.expiresAt).toLocaleString()}</Typography>
              <Typography><strong>Total Clicks:</strong> {selectedStats.totalClicks}</Typography>
            </Box>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Referrer</TableCell>
                    <TableCell>Location</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedStats.clicks.map((click, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(click.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{click.referrer}</TableCell>
                      <TableCell>{click.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      )}
    </Container>
  );
};

export default StatsPage;