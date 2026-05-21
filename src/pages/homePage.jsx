import { Routes ,Route} from "react-router-dom";
import Header from "../Components/header";

export default function HomePage () {
    
return(
    <div className="w-full h-full ">

                <Header/>
        <div className="bg-[#041024] w-full h-screen ">









          <Routes>
               <Route path="/" element={<h1 className="text-white text-3xl font-bold p-5">Home page</h1>}/>
                 <Route path="/products" element={<h1 className="text-white text-3xl font-bold p-5">Products page</h1>}/>
                   <Route path="/contact-us" element={<h1 className="text-white text-3xl font-bold p-5">Contact Us page</h1>}/>
                     <Route path="/about-us" element={<h1 className="text-white text-3xl font-bold p-5">About Us  page</h1>}/>
                      <Route path="/*" element={<h1 className="text-white text-3xl font-bold p-5">404 Not Found page</h1>}/>


            
          </Routes>





         </div>
    </div>
)
}
