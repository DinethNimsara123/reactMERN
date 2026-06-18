import { Routes ,Route} from "react-router-dom";
import Header from "../Components/header";
import ProductsPage from "./Home/productsPage";
import ProductOverview from "./Home/ProductOverview";

export default function HomePage () {
    
return(
    <div className="w-full min-h-screen ">

                <Header/>
        <div className="bg-[#041024] w-full min-h-screen ">









          <Routes>
               <Route path="/" element={<h1 className="text-white text-3xl font-bold p-5">Home page</h1>}/>
                 <Route path="/products"  element={<ProductsPage/>}/>
                   <Route path="/contact-us" element={<h1 className="text-white text-3xl font-bold p-5">Contact Us page</h1>}/>
                     <Route path="/about-us" element={<h1 className="text-white text-3xl font-bold p-5">About Us  page</h1>}/>
                      <Route path="/overview/:productId" element={<ProductOverview />} />
                      <Route path="/*" element={<h1 className="text-white text-3xl font-bold p-5">404 Not Found page</h1>}/>
                      

            
          </Routes>





         </div>
    </div>
)
}
