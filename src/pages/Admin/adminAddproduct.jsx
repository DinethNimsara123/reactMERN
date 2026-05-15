import { useState, useEffect} from "react"

import { Routes,Route,Link} from 'react-router-dom'
import { FaArrowDown, FaArrowUp } from "react-icons/fa"; 
import toast from "react-hot-toast";
import api from "../../utils/api";
import { useNavigate } from 'react-router-dom';
import uploadMedia from "../../utils/mediaUpload";
import { MdClear } from "react-icons/md";
import { PiBroomFill } from "react-icons/pi";
import { MdOutlineSaveAlt } from "react-icons/md";


export default function AdminAddProduct() {
   const [productId,setproductId]=useState("")
   const [name ,setname]=useState("")
   const [altNames,setaltNames]=useState("")
   const [price,setprice]=useState("")
   const [labelPrice,setlabelPrice]=useState("")
   const [description,setdescription]=useState("")
   const [image,setimage]=useState([])
   const [isAvailable,setisAvailable]=useState(true)
   const [ stock,setstock]=useState(0)
   const [category,setcategory]=useState("graphic card")
   const [brand,setbrand]=useState("") 
   const [model,setmodel]=useState("") 
   const [isLoading,setisLoading]=useState(false) 

   const navigate = useNavigate()

   
        function clearForm() {
    setproductId("")
    setname("")
    setaltNames("")
    setprice("")
    setlabelPrice("")
    setdescription("")
    setimage([])
    setisAvailable(true)
    setstock(0)
    setcategory("graphic card")
    setbrand("")
    setmodel("")
}

     
      async function addProduct() {


        if (!productId || !name || !price || !description || image.length === 0) {
        toast.error("Please fill all fields");
        return; 
    } 
    const token = localStorage.getItem("Token")

    if(token == null){
        toast.error("You must be logged in to add a product")
        navigate("/signin")
        return
    }

const response = await api.get(`/products/${productId}`, {
    headers: {
        Authorization: "Bearer " + token
    }
})
    
   // const response = await api.get(`/products/${productId}`);
    if (response.data) {
        toast.error("This Product ID already exists.,Please enter a different one.");
        return;
    }
        setisLoading(true)
        console.log("Save Button එක Click විය!");
        //const token = localStorage.getItem("Token")
    //if(token == null){
        //toast.error("You must be logged in to add a product")
       // navigate("/signin")
       // return
   // }


        const imageUploadPromises=[]

        for(let i=0; i<image.length; i++){
            imageUploadPromises.push(uploadMedia(image[i]))
            
        }
        try{
            const imageUrls = await Promise.all(imageUploadPromises)
            const altNamesArry = altNames.split(",")

           const requestBody = {
            productId : productId,
            name : name,
            altNames : altNamesArry ,
            description: description,
            price : Number(price),
            labelPrice : Number(labelPrice),
            image : imageUrls,
            isAvailable : isAvailable,
            category : category,
            stock : Number(stock),
            brand : brand,
            model : model
            }

             await api.post("/products",requestBody,
               {
                headers : {
                    "Authorization" : "Bearer " + token
               } 
            }
              )
              toast.success("Product added successfully")
              console.log("Product added successfully")
              setisLoading(false)
              navigate("/admin/products")

        }catch(error){
            console.error("Error in creating product")
            console.log(error)
              setisLoading(false)
              toast.error("Failed to add product. Please try again.")
              toast.error(errorMessage)     

        }
        
      }

      // වෙනස් කළා: Scroll කරන දිශාව තීරණය කිරීමට State එකක්
    const [isAtBottom, setIsAtBottom] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // පේජ් එකේ දකුණු පැත්තේ ඇති container එක scroll වන ප්‍රමාණය මනින්න
            const container = document.getElementById('admin-content-area');
            if (container) {
                const isBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
                setIsAtBottom(isBottom);
            }
        };

        const container = document.getElementById('admin-content-area');
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }
        return () => container?.removeEventListener('scroll', handleScroll);
    }, []);



       
return(
    <div className="w-full bg-[#041024] pb-20 relative">
         <div className=" w-full h-[100px] bg-gradient-to-r from-blue-500 to-green-500  mt-5 rounded-2xl flex items-center  justify-between">
            
               <h1 className="text-white ml-5 font-bold">Add New Product</h1>
            <div className="flex flex-row items-center gap-2 mr-5">
            <Link to="/admin/products" className="ml-7 flex items-center justify-center px-4 py-1 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 transition-all duration-300 shadow-md active:scale-95"><MdClear className="mr-2"/> Cancel</Link>
             {/*<button onClick={addProduct} className=" save-btn ml-2 flex items-center justify-center px-4 py-1 text-sm font-medium text-white bg-green-600 rounded-full hover:bg-red-700 transition-all duration-300 shadow-md active:scale-95 border-2 border-black save-black-glow ">Save</button>*/}
            <button disabled={isLoading}
    type="button" 
    onClick={addProduct} 
    className="save-btn ml-2 flex items-center justify-center px-4 py-1 text-sm font-medium text-white bg-green-600 rounded-full hover:bg-red-700 transition-all duration-300 shadow-md active:scale-95 border-2 border-black save-black-glow flex items-center justify-center px-6 py-2 text-sm font-bold text-white bg-green-600 rounded-full hover:bg-green-700 transition-all duration-300 shadow-lg active:scale-95 border-2 border-black hover:shadow-green-500/50"
>
   <MdOutlineSaveAlt className="mr-2"/>  {isLoading ? "Saving..." : "Save"}
</button>
            </div>
            <div><button
    type="button"
    onClick={clearForm}
    className="active:scale-[2] active:translate-y-[2px] mr-7 ml-2 flex items-center justify-center px-4 py-1 text-sm font-medium text-white bg-yellow-600 rounded-full hover:bg-yellow-700 transition-all duration-300 shadow-md active:scale-95"
>
   <PiBroomFill className="mr-2"/>  Clear ALL
</button>



            </div>

         </div>
          
        <div className="w-full flex flex-wrap mt-5 gap-y-8 pb-32">
               
            <div className="w-[25%] h-[70px] flex-col ">
                
               <label className="text-gray-300 text-sm font-semibold ml-1">Product ID</label>
                    <input
                        type="text"
                        placeholder="(e.g. P1001)"
                        value={productId}
                        onChange={(e) => setproductId(e.target.value)}
                        className=" moving-border  hover:scale-105  focus:scale-[1.02] focus:outline-none focus:border-blue-500 shadow-md  text-sm w-full px-4 py-3 bg-[#041024] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all "
                    
                    />
            </div>

            <div className="w-[25%] h-[70px] flex-col ">
                
                 <label className="ml-5 text-gray-300 text-sm font-semibold ml-1">Product Name</label>
                    <input
                        type="text"
                        placeholder=" (e.g. RTX 5090 Graphics Card)"
                        value={name}
                        onChange={(e) => setname(e.target.value)}
                        className="ml-5 moving-border  hover:scale-105  focus:scale-[1.02] focus:outline-none focus:border-blue-500 shadow-md  text-sm w-full px-4 py-3 bg-[#041024] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all "
                    
                    />

            </div>
             <div>
               
                 <label className="ml-10 text-gray-300 text-sm font-semibold ml-1">Alternative Name</label>
                    <input
                        type="text"
                        placeholder="(Graphics Card , VGA Card , GPU)"
                        value={altNames}
                        onChange={(e) => setaltNames(e.target.value)}
                        className="ml-10 moving-border  hover:scale-105  focus:scale-[1.02] focus:outline-none focus:border-blue-500 shadow-md  text-sm w-full px-4 py-3 bg-[#041024] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all "
                    
                    />



             </div>
             <div>
                    <label className="ml-10 text-gray-300 text-sm font-semibold ml-1">Price</label>
                    <input
                        type="text"
                        placeholder="(LKR 100000 )"
                        value={price}
                        onChange={(e) => setprice(e.target.value)}
                        className="ml-10 moving-border  hover:scale-105  focus:scale-[1.02] focus:outline-none focus:border-blue-500 shadow-md  text-sm w-full px-4 py-3 bg-[#041024] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all "
                    
                    />
             </div>
             <div>
                 
                    <label className="ml-20 text-gray-300 text-sm font-semibold ml-1">Label Price </label>
                    <input
                        type="text"
                        placeholder="(LKR 100000 )"
                        value={labelPrice}
                        onChange={(e) => setlabelPrice(e.target.value)}
                        className=" line-through ml-20 moving-border  hover:scale-105  focus:scale-[1.02] focus:outline-none focus:border-blue-500 shadow-md  text-sm w-full px-4 py-3 bg-[#041024] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all "
                    
                    />
             </div>
             <div className="w-full h-[200px] mb-10">
                
                    <label className=" text-gray-300 text-sm font-semibold ml-1">Description</label>
                    <textarea
                        type="text"
                        placeholder="(Powerful VGA card with advanced cooling system and fast performance. 
Perfect for gamers, designers, and content creators.)"
                        value={description}
                        onChange={(e) => setdescription(e.target.value)}
                        className=" mb-[10px] h-[200px]  moving-border  hover:scale-105  focus:scale-[1.02] focus:outline-none focus:border-blue-500 shadow-md  text-sm w-full px-4 py-3 bg-[#041024] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all "
                    
                    />
             </div>
             <div className="w-[40%] flex flex-col">
                        
                    <label className=" text-gray-300 text-sm font-semibold ml-1"> Select image</label>
                    <input multiple={true}
                        type="file"
                        onChange={(e) =>setimage(Array.from(e.target.files))}
                        className="moving-border  hover:scale-105  focus:scale-[1.02] focus:outline-none focus:border-blue-500 shadow-md  text-sm w-full px-4 py-3 bg-[#041024] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all "
                    
                    />
            </div>
            <div>
                    
                    <label className="ml-[40px] text-gray-300 text-sm font-semibold ml-1">Available or UnAvailable</label>
                    <select value={isAvailable}  onChange={(e)=>{setisAvailable(e.target.value === "true")}} className=" ml-[50px] w-full h-[50px]  moving-border  hover:scale-105  focus:scale-[1.02] focus:outline-none focus:border-blue-500 shadow-md  text-sm w-full px-4 py-3 bg-[#041024] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all  ">
                         <option value={true} className="bg-[#041024] text-white">Available</option>
                         <option value={false} className="bg-[#041024]  text-white">unAvailable</option>
                    </select>
            </div>
            <div>
   
                    <label className="ml-[60px]  text-gray-300 text-sm font-semibold ml-1"> Stock </label>
                    <input 
                        type="text"
                        value={stock}
                         placeholder="(10 )"
                        onChange={(e) =>setstock(e.target. value)}
                        className="ml-[60px] moving-border  hover:scale-105  focus:scale-[1.02] focus:outline-none focus:border-blue-500 shadow-md  text-sm w-full px-4 py-3 bg-[#041024] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all "
                    
                    />
            </div>
            <div className="">
                
                    <label className="ml-[100px] text-gray-300 text-sm font-semibold ml-1">Category</label>
                    <select   value={category}  onChange={(e)=>{setcategory(e.target.value)}} className=" ml-[100px] w-full h-[50px]  moving-border  hover:scale-105  focus:scale-[1.02] focus:outline-none focus:border-blue-500 shadow-md  text-sm w-full px-4 py-3 bg-[#041024] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all  ">
                         <option value="graphic card"className="bg-[#041024] text-white">graphic card</option>
                         <option value="motherboard" className="bg-[#041024]  text-white">motherboard</option>
                         <option value="cpu" className="bg-[#041024]  text-white">cpu</option>
                         <option value="ram" className="bg-[#041024]  text-white">ram</option>
                         <option value="storage" className="bg-[#041024]  text-white">storage</option>
                         <option value="power supply" className="bg-[#041024]  text-white">power supply</option>
                         <option value="caseing" className="bg-[#041024]  text-white">caseing</option>
                         <option value="cooling fan" className="bg-[#041024]  text-white">cooling fan</option>
                         <option value="key boards" className="bg-[#041024]  text-white">key boards</option>
                         <option value="mouse" className="bg-[#041024]  text-white">mouse</option>
                        <option value="laptop" className="bg-[#041024]  text-white">laptop</option>
                        <option value="Monitors" className="bg-[#041024]  text-white">Monitors</option>
                         <option value="Chairs" className="bg-[#041024]  text-white">Chairs</option>
                         <option value="Tables" className="bg-[#041024]  text-white">Tables</option>
                         <option value="Headsets" className="bg-[#041024]  text-white">Headsets</option>
                          <option value="Mobiles" className="bg-[#041024]  text-white">Mobiles</option>
                          <option value="Consoles" className="bg-[#041024]  text-white">Consoles</option>
                          <option value="Tablet PC (Tabs)" className="bg-[#041024]  text-white">Tablet PC (Tabs)</option>
                          <option value="others" className="bg-[#041024]  text-white">others</option>
                    </select>
            </div>
        
            <div>
                   <label className="ml-[200px] text-gray-300 text-sm font-semibold ml-1">Brand </label>
                    <input
                        type="text"
                        placeholder="(MSI )"
                        value={brand}
                        onChange={(e) => setbrand(e.target.value)}
                        className=" ml-[200] moving-border  hover:scale-105  focus:scale-[1.02] focus:outline-none focus:border-blue-500 shadow-md  text-sm w-full px-4 py-3 bg-[#041024] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all "
                    
                    />
            </div>
             <div className="ml-7">
                
                    <label className="ml=[100px] text-gray-300 text-sm font-semibold ml-1"> Model </label>
                    <input 
                        type="text"
                        value={model}
                         placeholder="(RTX 5090 )"
                        onChange={(e) =>setmodel(e.target.value)}
                        className="ml=[100px] moving-border  hover:scale-105  focus:scale-[1.02] focus:outline-none focus:border-blue-500 shadow-md  text-sm w-full px-4 py-3 bg-[#041024] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all "
                    
                    />
            </div>
            
                 
            </div>
        {/* වෙනස් කළා: ස්වයංක්‍රීයව වෙනස් වන Scroll Indicator එක */}
            <div className="fixed bottom-10 right-10 flex flex-col items-center pointer-events-none opacity-80 z-50">
                <span className="text-[10px] text-blue-400 mb-2 font-bold tracking-widest uppercase">
                    {isAtBottom ? "Back to Top" : "Scroll for more"}
                </span>
                <div className={`bg-blue-600 p-3 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)] animate-bounce-slow border border-blue-400/30 transition-transform duration-500 ${isAtBottom ? 'rotate-180' : 'rotate-0'}`}>
                    <FaArrowDown className="text-white text-xl" />
                </div>
            </div>

    
    </div>
    
)

}