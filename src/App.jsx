import { Routes,Route } from 'react-router-dom'
import './App.css'
import ProductCard from './Components/ProductCard'
import HomePage from './pages/homePage'
import LoginPage from './pages/loginPage'
import RejisterPage from './pages/rejisterPage'
import AdminPage from './pages/adminPage'
import TestPage from './pages/test'
import { Toaster } from 'react-hot-toast'
import CartPage from "./pages/CartPage";
import MyOrders from "./components/MyOrders.jsx";
import AdminRoute from "./Components/AdminRouteCheck";
import SettingsPage from "./pages/SettingsPage";
import { GoogleOAuthProvider } from '@react-oauth/google';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

//211593988065-1bfp9ira0ulm4e1bcd6ri3lihes6l6gs.apps.googleusercontent.com


function App() {
  return(
    <GoogleOAuthProvider clientId="211593988065-1bfp9ira0ulm4e1bcd6ri3lihes6l6gs.apps.googleusercontent.com">
      
     <div className='w-full h-screen '>
      <Toaster
  position="top-center"
  reverseOrder={false}
/>
      
      <Routes>
            <Route path='/*' element = {<HomePage/>}/>
             <Route path='/signin' element = {<LoginPage/>}/>
             <Route path='/signup' element = {<RejisterPage/>}/>

             {/* ✅ මෙතන විතරයි වෙනස් වෙන්නේ */}
             <Route path='/admin/*' element={
                <AdminRoute>
                    <AdminPage/>
                </AdminRoute>
             }/>
              <Route path='/settings' element={<SettingsPage />} />
              <Route path='/test' element = {<TestPage />}/>
              <Route path="/cart" element={<CartPage />} />
              <Route path="/my-orders" element={<MyOrders />} />
              
               <Route path="/forget-password" element={<ForgotPassword />} />
               <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
      
     </div>
    </GoogleOAuthProvider>
  )
}

export default App