import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { MantineProvider, createTheme, rem } from '@mantine/core'

const theme = createTheme({
  headings: {
    fontWeight: "400",
    sizes: {
      h1: {
        fontWeight: "300",
        fontSize: rem(40),
      },
    },
  },
  primaryColor: 'indigo',
  autoContrast: true,
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider defaultColorScheme='dark' theme={theme}>
      <App />
    </MantineProvider>
  </StrictMode>,
)
