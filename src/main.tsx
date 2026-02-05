import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LicenseInfo } from '@mui/x-license'
import { App } from './App'
import './index.css'
import '@vivaahealth/design-system/dist/index.css'

// Set MUI X license key
LicenseInfo.setLicenseKey(
  '8c622cf908b050fe250de9e6749f0cfeTz0xMDkxMDEsRT0xNzcyODQxNTk5MDAwLFM9cHJvLExNPXN1YnNjcmlwdGlvbixQVj1pbml0aWFsLEtWPTI='
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
