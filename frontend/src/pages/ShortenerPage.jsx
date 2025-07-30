import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { createShortUrl } from '../api';
import { log, logError } from '../utils/logger';

const ShortenerPage = () => {
  const [urlForms, setUrlForms] = useState([{ url: '', validity: 30, shortcode: '' }]);
  const [shortUrls, setShortUrls] = useState([]);
  const [errors, setErrors] = useState([]);

  const validateForm = (form) => {
    const newErrors = {};
    try {
      new URL(form.url);
    } catch {
      newErrors.url = 'Invalid URL format';
    }
    if (!Number.isInteger(Number(form.validity))) {
      newErrors.validity = 'Must be a whole number';
    }
    if (form.shortcode && !/^[a-zA-Z0-9]{4,10}$/.test(form.shortcode)) {
      newErrors.shortcode = 'Must be 4-10 alphanumeric characters';
    }
    return newErrors;
  };

  const handleAddForm = () => {
    if (urlForms.length < 5) {
      setUrlForms([...urlForms, { url: '', validity: 30, shortcode: '' }]);
    }
  };

  const handleRemoveForm = (index) => {
    if (urlForms.length > 1) {
      const updatedForms = [...urlForms];
      updatedForms.splice(index, 1);
      setUrlForms(updatedForms);
    }
  };

  const handleFormChange = (index, field, value) => {
    const updatedForms = [...urlForms];
    updatedForms[index][field] = value;
    setUrlForms(updatedForms);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationResults = urlForms.map(validateForm);
    setErrors(validationResults);

    if (validationResults.some(err => Object.keys(err).length > 0)) {
      return;
    }

    try {
      const results = await Promise.all(
        urlForms.map(form => createShortUrl(form))
      );
      log(`Created ${results.length} short URLs`);
      setShortUrls([...shortUrls, ...results.map(res => res.data)]);
      setUrlForms([{ url: '', validity: 30, shortcode: '' }]);
    } catch (err) {
      logError(err);
      setErrors([{ submit: err.response?.data?.error || 'Failed to create URLs' }]);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>URL Shortener</Typography>
        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            {urlForms.map((form, index) => (
              <Box key={index} sx={{ mb: 3, border: '1px solid #ddd', p: 2, borderRadius: 1 }}>
                <TextField
                  label="Original URL"
                  value={form.url}
                  onChange={(e) => handleFormChange(index, 'url', e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                  error={!!errors[index]?.url}
                  helperText={errors[index]?.url}
                />
                <TextField
                  label="Validity (minutes)"
                  type="number"
                  value={form.validity}
                  onChange={(e) => handleFormChange(index, 'validity', e.target.value)}
                  fullWidth
                  margin="normal"
                  error={!!errors[index]?.validity}
                  helperText={errors[index]?.validity}
                />
                <TextField
                  label="Custom Shortcode (optional)"
                  value={form.shortcode}
                  onChange={(e) => handleFormChange(index, 'shortcode', e.target.value)}
                  fullWidth
                  margin="normal"
                  error={!!errors[index]?.shortcode}
                  helperText={errors[index]?.shortcode}
                />
                {urlForms.length > 1 && (
                  <IconButton onClick={() => handleRemoveForm(index)}>
                    <RemoveIcon />
                  </IconButton>
                )}
              </Box>
            ))}
            {urlForms.length < 5 && (
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddForm}
                variant="outlined"
                sx={{ mb: 2 }}
              >
                Add Another URL
              </Button>
            )}
            <Button type="submit" variant="contained" fullWidth>
              Shorten URLs
            </Button>
          </form>
        </Paper>
        {shortUrls.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Shortened URLs</Typography>
            <List>
              {shortUrls.map((item, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={<a href={item.shortLink} target="_blank" rel="noopener">{item.shortLink}</a>}
                    secondary={
                      <>
                        Original: {item.originalUrl}<br />
                        Expires: {new Date(item.expiry).toLocaleString()}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ShortenerPage;