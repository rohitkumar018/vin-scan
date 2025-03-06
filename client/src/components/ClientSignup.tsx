import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Stack, 
  CircularProgress, 
  Alert, 
  Snackbar 
} from '@mui/material';

interface ClientInfo {
  name: string;
  position: string;
  websiteUrl: string;
  email: string;
  socialMedia: string;
}

interface ClientSignupProps {
  onComplete: (clientInfo: ClientInfo, clientId: string) => void;
}

const ClientSignup: React.FC<ClientSignupProps> = ({ onComplete }) => {
  const [clientInfo, setClientInfo] = useState<ClientInfo>(() => {
    const saved = localStorage.getItem('vinScanClientInfo');
    return saved ? JSON.parse(saved) : {
      name: '',
      position: '',
      websiteUrl: '',
      email: '',
      socialMedia: ''
    };
  });

  const [errors, setErrors] = useState({
    name: '',
    position: '',
    websiteUrl: '',
    email: '',
    socialMedia: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const validateForm = (): boolean => {
    const newErrors = {
      name: '',
      position: '',
      websiteUrl: '',
      email: '',
      socialMedia: ''
    };

    let isValid = true;

    if (!clientInfo.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!clientInfo.position.trim()) {
      newErrors.position = 'Position is required';
      isValid = false;
    }

    if (!clientInfo.websiteUrl.trim()) {
      newErrors.websiteUrl = 'Website URL is required';
      isValid = false;
    }

    if (!clientInfo.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(clientInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setShowError(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5002/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientInfo),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const data = await response.json();
      onComplete(data.clientInfo, data.clientId);
    } catch (error) {
      setShowError(true);
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to VinScan
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Please enter your information to get started
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Your Name"
              placeholder="Please Enter Your Name"
              value={clientInfo.name}
              onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
            <TextField
              fullWidth
              label="Position within Organisation"
              value={clientInfo.position}
              onChange={(e) => setClientInfo({ ...clientInfo, position: e.target.value })}
              error={!!errors.position}
              helperText={errors.position}
              required
            />
            <TextField
              fullWidth
              label="Website URL"
              type="url"
              value={clientInfo.websiteUrl}
              onChange={(e) => setClientInfo({ ...clientInfo, websiteUrl: e.target.value })}
              error={!!errors.websiteUrl}
              helperText={errors.websiteUrl}
              required
            />
            <TextField
              fullWidth
              label="Organisational Email"
              type="email"
              value={clientInfo.email}
              onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
              error={!!errors.email}
              helperText={errors.email}
              required
            />
            <TextField
              fullWidth
              label="Social Media Links"
              placeholder="Social Media Links (Separated by Comma)"
              value={clientInfo.socialMedia}
              onChange={(e) => setClientInfo({ ...clientInfo, socialMedia: e.target.value })}
              error={!!errors.socialMedia}
              helperText={errors.socialMedia || "Enter URLs separated by commas (optional)"}
              multiline
              rows={2}
            />
            <Button 
              variant="contained" 
              size="large" 
              type="submit"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
            </Button>
          </Stack>
        </form>
        <Snackbar 
          open={showError} 
          autoHideDuration={6000} 
          onClose={() => setShowError(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="error" onClose={() => setShowError(false)}>
            Please fix the errors in the form
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default ClientSignup; 