import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Homepage from './Pages/Homepage'
import Notfound from './Pages/Notfound'

function App() {

  return (
<Router>
  <Routes>
    <Route path='/' element={<Homepage/>} />
    <Route path='*' element={<Notfound/>} />
  </Routes>
</Router>
  )
}

export default App
