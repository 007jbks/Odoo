import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import AuthPage from './pages/Auth'
import LandingPage from './pages/LandingPage'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import ItemDetail from './pages/ItemDetail'
import BrowseItems from './pages/BrowseItems'
import AddItem from './pages/AddItem'
import Navbar from './components/Navbar'

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  return (
    <div>
      {!isAuthPage && <Navbar />}
      <div className={!isAuthPage ? "pt-20" : ""}> {/* Only add padding when navbar is shown */}
        <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/auth' element={<AuthPage/>}/>
          <Route path='/admin-dashboard' element={<AdminDashboard/>}/>
          <Route path='/user-dashboard' element={<UserDashboard/>}/>
          <Route path='/item/:id' element={<ItemDetail/>}/>
          <Route path='/browse' element={<BrowseItems/>}/>
          <Route path='/add-item' element={<AddItem/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default App
