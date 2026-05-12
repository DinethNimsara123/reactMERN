import { AiOutlinePlus } from "react-icons/ai";
import { Routes,Route,Link} from 'react-router-dom'



export default function AdminProductspage () {
       
return(
    <div className="h-full w-full bg-[#041024]">
          <Link to="/admin/add-product" className="w-[100px] h-[100px] rounded-full bg-[#8BC34A] text-5xl flex justify-center items-center fixed bottom-4 right-5 shadow-2xl active:bg-red-700">
    
            <AiOutlinePlus/>
          </Link>

    </div>
)

}