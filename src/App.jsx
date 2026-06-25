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
import MyOrders from "./components/MyOrders";
import AdminRoute from "./Components/AdminRouteCheck";

function App() {
  return(
      
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

              <Route path='/test' element = {<TestPage />}/>
              <Route path="/cart" element={<CartPage />} />
              <Route path="/my-orders" element={<MyOrders />} />
      </Routes>
      
     </div>
      
  )
}

export default App