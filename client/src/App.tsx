import React, { useState } from 'react';
import { Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import ClientSignup from './components/ClientSignup';
import Chat from './components/Chat';

// Define theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#e3f2fd',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

interface ClientInfo {
  name: string;
  position: string;
  websiteUrl: string;
  email: string;
  socialMedia: string;
}

function App() {
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);

  const handleSignupComplete = (info: ClientInfo, id: string) => {
    setClientInfo(info);
    setClientId(id);
    setIsSignedUp(true);
    
    // Store in localStorage for persistence
    localStorage.setItem('vinScanClientInfo', JSON.stringify(info));
    localStorage.setItem('vinScanClientId', id);
  };

  // Check if user is already signed up (from localStorage)
  React.useEffect(() => {
    const savedClientInfo = localStorage.getItem('vinScanClientInfo');
    const savedClientId = localStorage.getItem('vinScanClientId');
    
    if (savedClientInfo && savedClientId) {
      setClientInfo(JSON.parse(savedClientInfo));
      setClientId(savedClientId);
      setIsSignedUp(true);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        py: 4
      }}>
        {!isSignedUp ? (
          <ClientSignup onComplete={handleSignupComplete} />
        ) : (
          <Chat 
            clientId={clientId!} 
            clientName={clientInfo?.name || 'User'} 
          />
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;