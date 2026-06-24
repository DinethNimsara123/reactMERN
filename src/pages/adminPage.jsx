import { Routes,Route,Link} from 'react-router-dom'
import { FcNews } from "react-icons/fc"
import { FcAddDatabase } from "react-icons/fc";
import { FcManager } from "react-icons/fc";
import AdminProductspage from './admin/adminProductspage';
import AdminAddProduct from './admin/adminAddproduct';
import { NavLink,useLocation} from 'react-router-dom';
import AdminEditeProduct from './Admin/adminEditeProductForm';
import AdminOrdersPage from './admin/adminOrdersPage';


export default function AdminPage () {
    const location = useLocation();
    const isProductsActive = location.pathname === "/admin/products" || 
                           location.pathname === "/admin/add-product";

return(
    <div className="w-full h-screen flex overflow-hidden bg-[#041024]">
          <div className="w-[300px] h-full bg-[#061737] shadow-xl flex-shrink-0 ">
             <div className='bg-[#061737] h-[100px] w-full'>
                   <img src="/logo.png" alt="Logo" className="w-full h-full object-cover mt-3" />
                </div>



            {/*<Link className=' active:bg-red-700 w-[200px] h-[50px] bg-blue-600 my-5 mx-5 flex items-center justify-center text-white' to="/admin/"><FcNews className='text-5xl' />Order Page</Link>*/}
           <NavLink 
  to="/admin/" 
  end 
  className={({ isActive }) => 
    `relative w-[200px] h-[50px] my-5 mx-5 flex items-center justify-center text-white transition-all duration-300 rounded-lg active:bg-red-700 ${
      isActive 
        ? "bg-blue-700 border-2 border-white scale-110 active-arrow z-10" 
        : "bg-blue-600 border-2 border-transparent scale-100 hover:bg-blue-500 shadow-md"
    }`
  }
>
  <FcNews className='text-5xl' /> 
  <span className="font-bold ml-2">Order Page</span>
</NavLink>



            
            {/*<Link className=' active:bg-red-700 w-[200px] h-[50px] bg-blue-600 my-5 mx-5 flex items-center justify-center text-white' to="/admin/products"><FcAddDatabase className='text-5xl'/>Products Page</Link>*/}

        <Link 
          to="/admin/products" 
          className={`relative w-[200px] h-[50px] my-5 mx-5 flex items-center justify-center text-white transition-all duration-300 active:bg-red-700 shadow-md rounded-lg ${
            isProductsActive 
              ? "bg-blue-700 border-2 border-white scale-110 active-arrow z-10" 
              : "bg-blue-600 border-2 border-transparent scale-100 hover:bg-blue-500"
          }`}
        >
          <FcAddDatabase className='text-5xl' /> 
          <span className="font-bold ml-2">Products Page</span>
        </Link>


           {/* <Link className=' active:bg-red-700 w-[200px] h-[50px] bg-blue-600 my-5 mx-5 flex items-center justify-center text-white' to="/admin//users"><FcManager className='text-5xl'  />Users Page</Link>*/}
<NavLink 
  to="/admin/users" 
  className={({ isActive }) => 
    `relative w-[200px] h-[50px] my-5 mx-5 flex items-center justify-center text-white transition-all duration-300 active:bg-red-700 shadow-md rounded-lg ${
      isActive 
        ? "bg-blue-700 border-2 border-white scale-110 active-arrow z-10" 
        : "bg-blue-600 border-2 border-transparent scale-100 hover:bg-blue-500"
    }`
  }
>
  <FcManager className='text-5xl' /> 
  <span className="font-bold ml-2">Users Page</span>
</NavLink>
             
              
    
              
          </div>
          <div id="admin-content-area" className="flex-1 h-screen overflow-y-auto bg-[#041024] text-2xl text-amber-50 p-5 custom-scrollbar ">
               <Routes>
                <Route path="/" element={<AdminOrdersPage />} />
                  <Route path="/products" element={<AdminProductspage/>}/>
                   <Route path="/users" element={<h1>Users Page</h1>}/>
                   <Route path='/add-product' element = {<AdminAddProduct />}/>
                    <Route path='/edit-product' element = {<AdminEditeProduct />}/>
                 
                 
               </Routes>

               {/* යටම තියෙන ඉන්පුට් බලන්න ලේසි වෙන්න යටින් පොඩි ඉඩක් */}
                <div className="h-20"></div>

              </div>

         
    </div>
)
}
