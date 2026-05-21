
import { Routes,Route } from 'react-router-dom'
import './App.css'
import ProductCard from './Components/ProductCard'
import HomePage from './pages/homePage'
import LoginPage from './pages/loginPage'
import RejisterPage from './pages/rejisterPage'
import AdminPage from './pages/adminPage'
import TestPage from './pages/test'
import { Toaster } from 'react-hot-toast'








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
             <Route path='/admin/*' element = {<AdminPage/>}/>
              <Route path='/test' element = {<TestPage />}/>
               
               
      </Routes>
      
   
     </div>
      
  )
}

export default App
