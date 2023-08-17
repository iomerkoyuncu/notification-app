import Home from './pages/Home/pages/Home';
import tr from 'date-fns/locale/tr'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <>
      <LocalizationProvider adapterLocale={tr}
        dateAdapter={AdapterDateFns}
      >
        <Home />
        <ToastContainer />
      </LocalizationProvider>

    </>
  );
}

export default App;
