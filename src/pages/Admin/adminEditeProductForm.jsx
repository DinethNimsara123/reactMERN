import { useState, useEffect } from "react"
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { FaArrowDown } from "react-icons/fa"; 
import toast from "react-hot-toast";
import api from "../../utils/api";
import { useNavigate } from 'react-router-dom';
import uploadMedia from "../../utils/mediaUpload";
import { MdClear } from "react-icons/md";
import { PiBroomFill } from "react-icons/pi";
import { MdOutlineSaveAlt } from "react-icons/md";

export default function AdminEditeProduct() {
    const location = useLocation();
    const navigate = useNavigate();

    const productData = location.state;

    const [productId, setproductId] = useState(productData?.productId || "")
    const [name, setname] = useState(productData?.productName || productData?.name || "")
    const [altNames, setaltNames] = useState(productData?.altNames?.join(",") || "")
    const [price, setprice] = useState(productData?.productPrice || productData?.price || "")
    const [labelPrice, setlabelPrice] = useState(productData?.labelPrice || productData?.labelledPrice || "") 
    const [description, setdescription] = useState(productData?.description || "")
    const [image, setimage] = useState([]) 
    const [oldImages, setOldImages] = useState(productData?.image || []) 
    const [isAvailable, setisAvailable] = useState(productData?.isAvailable !== undefined ? productData.isAvailable : true)
    const [stock, setstock] = useState(productData?.stock || 0)
    
    
    const [category, setcategory] = useState(productData?.category || "Graphic Card")
    const [brand, setbrand] = useState(productData?.brand || "") 
    const [model, setmodel] = useState(productData?.model || "") 
    const [isLoading, setisLoading] = useState(false) 

    useEffect(() => {
        if (!productData) {
            toast.error("No product data found! Please click edit button again.");
            navigate("/admin/products");
        }
    }, [productData, navigate]);

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
       
        setcategory("Graphic Card")
        setbrand("")
        setmodel("")
    }

    async function editeProduct() {
        if (!productId || !name || !price || !description) {
            toast.error("Please fill all required fields");
            return; 
        } 
        
        const token = localStorage.getItem("Token")
        if (token == null) {
            toast.error("You must be logged in to update a product")
            navigate("/signin")
            return
        }

        setisLoading(true);
        console.log("Save Button එක Click විය!");

        try {
            let imageUrls = oldImages; 

            if (image.length > 0) {
                const imageUploadPromises = []
                for (let i = 0; i < image.length; i++) {
                    imageUploadPromises.push(uploadMedia(image[i]))
                }
                imageUrls = await Promise.all(imageUploadPromises)
            }

            const altNamesArry = altNames ? altNames.split(",") : [];

            const finalPrice = isNaN(Number(price)) ? 0 : Number(price);
            const finalLabelPrice = isNaN(Number(labelPrice)) ? 0 : Number(labelPrice);
            const finalStock = isNaN(Number(stock)) ? 0 : Number(stock);

         
            
            const requestBody = {
                name: name,
                altNames: altNamesArry,
                description: description,
                price: String(finalPrice),            
                labelPrice: finalLabelPrice,         
                image: imageUrls,
                isAvailable: isAvailable,
                category: category,  
                stock: finalStock,
                brand: brand,
                model: model
            }

            const idForUrl = productData?.productId; 

            if (!idForUrl) {
                toast.error("Product ID missing!");
                setisLoading(false);
                return;
            }

            await api.put(`/products/${idForUrl}`, requestBody, {
                headers: { "Authorization": "Bearer " + token }
            });

            toast.success("Product updated successfully");
            setisLoading(false)
            navigate("/admin/products")

        } catch (error) {
            console.log("Error in updating product", error)
            setisLoading(false)
            toast.error(error.response?.data?.message || "Failed to update product. Please try again.")
        }
    }

    const [isAtBottom, setIsAtBottom] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
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

    return (
        <div className="w-full bg-[#041024] pb-20 relative">
            <div className=" w-full h-[100px] bg-gradient-to-r from-blue-500 to-green-500 mt-5 rounded-2xl flex items-center justify-between">
                <h1 className="text-white ml-5 font-bold">Edit Product</h1>
                <div className="flex flex-row items-center gap-2 mr-5">
                    <Link to="/admin/products" className="ml-7 flex items-center justify-center px-4 py-1 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 transition-all duration-300 shadow-md active:scale-95">
                        <MdClear className="mr-2"/> Cancel
                    </Link>
                    
                    <button 
                        disabled={isLoading}
                        type="button" 
                        onClick={editeProduct}
                        className="save-btn ml-2 flex items-center justify-center px-6 py-2 text-sm font-bold text-white bg-green-600 rounded-full hover:bg-green-700 transition-all duration-300 shadow-lg active:scale-95 border-2 border-black hover:shadow-green-500/50"
                    >
                        <MdOutlineSaveAlt className="mr-2"/> {isLoading ? "Saving..." : "Save"}
                    </button>
                </div>
                <div>
                    <button
                        type="button"
                        onClick={clearForm}
                        className="active:scale-[2] active:translate-y-[2px] mr-7 ml-2 flex items-center justify-center px-4 py-1 text-sm font-medium text-white bg-yellow-600 rounded-full hover:bg-yellow-700 transition-all duration-300 shadow-md active:scale-95"
                    >
                        <PiBroomFill className="mr-2"/> Clear ALL
                    </button>
                </div>
            </div>
             
            <div className="w-full flex flex-wrap mt-5 gap-y-8 pb-32">
                
                <div className="w-[25%] h-[70px] flex flex-col">
                    <label className="text-gray-300 text-sm font-semibold ml-1">Product ID</label>
                    <input
                        type="text"
                        disabled={true} 
                        placeholder="(e.g. P1001)"
                        value={productId}
                        onChange={(e) => setproductId(e.target.value)}
                        className="moving-border opacity-60 bg-gray-800 text-sm w-full px-4 py-3 border border-gray-600 rounded-lg text-white transition-all"
                    />
                </div>

                <div className="w-[25%] h-[70px] flex flex-col">
                    <label className="ml-5 text-gray-300 text-sm font-semibold">Product Name</label>
                    <input
                        type="text"
                        placeholder=" (e.g. RTX 5090 Graphics Card)"
                        value={name}
                        onChange={(e) => setname(e.target.value)}
                        className="ml-5 moving-border hover:scale-105 focus:scale-[1.02] focus:outline-none focus:border-blue-500 shadow-md text-sm w-full px-4 py-3 bg-[#041024] border border-gray-600 rounded-lg text-white placeholder-gray-500 transition-all"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="ml-10 text-gray-300 text-sm font-semibold">Alternative Name</label>
                    <input
                        type="text"
                        placeholder="(Graphics Card , VGA Card , GPU)"
                        value={altNames}
                        onChange={(e) => setaltNames(e.target.value)}
                        className="ml-10 moving-border hover:scale-105 focus:scale-[1.02] focus:outline-none focus:border-blue-500 shadow-md text-sm w-full px-4 py-3 bg-[#041024] border border-gray-600 rounded-lg text-white placeholder-gray-500 transition-all"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="ml-10 text-gray-300 text-sm font-semibold">Price</label>
                    <input
                        type="text"
                        placeholder="(LKR 100000 )"
                        value={price}
                        onChange={(e) => setprice(e.target.value)}
                        className="ml-10 moving-border hover:scale-105 focus:scale-[1.02] focus:outline-none focus:border-blue-500 shadow-md text-sm w-full px-4 py-3 bg-[#041024] border border-gray-600 rounded-lg text-white placeholder-gray-500 transition-all"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="ml-20 text-gray-300 text-sm font-semibold">Label Price </label>
                    <input
                        type="text"
                        placeholder="(LKR 100000 )"
                        value={labelPrice}
                        onChange={(e) => setlabelPrice(e.target.value)}
                        className="ml-20 moving-border hover:scale-105 focus:scale-[1.02] focus:outline-none focus:border-blue-500 shadow-md text-sm w-full px-4 py-3 bg-[#041024] border border-gray-600 rounded-lg text-white placeholder-gray-500 transition-all"
                    />
                </div>

                <div className="w-full h-[200px] mb-10 flex flex-col">
                    <label className="text-gray-300 text-sm font-semibold ml-1">Description</label>
                    <textarea
                        placeholder="Powerful VGA card..."
                        value={description}
                        onChange={(e) => setdescription(e.target.value)}
                        className="mb-[10px] h-[200px] moving-border hover:scale-105 focus:scale-[1.02] focus:outline-none focus:border-blue-500 shadow-md text-sm w-full px-4 py-3 bg-[#041024] border border-gray-600 rounded-lg text-white placeholder-gray-500 transition-all"
                    />
                </div>

                <div className="w-[40%] flex flex-col">
                    <label className="text-gray-300 text-sm font-semibold ml-1">Select New Image (Optional)</label>
                    <input 
                        multiple={true}
                        type="file"
                        onChange={(e) => setimage(Array.from(e.target.files))}
                        className="moving-border hover:scale-105 focus:scale-[1.02] focus:outline-none focus:border-blue-500 shadow-md text-sm w-full px-4 py-3 bg-[#041024] border border-gray-600 rounded-lg text-white placeholder-gray-500 transition-all"
                    />
                    {oldImages.length > 0 && <span className="text-xs text-green-400 mt-1 ml-1">✓ Has {oldImages.length} existing images</span>}
                </div>

                <div className="flex flex-col">
                    <label className="ml-[50px] text-gray-300 text-sm font-semibold">Available or UnAvailable</label>
                    <select value={isAvailable} onChange={(e) => { setisAvailable(e.target.value === "true") }} className="ml-[50px] h-[50px] moving-border hover:scale-105 focus:scale-[1.02] focus:outline-none focus:border-blue-500 shadow-md text-sm w-48 px-4 py-3 bg-[#041024] border border-gray-600 rounded-lg text-white transition-all">
                        <option value={true} className="bg-[#041024] text-white">Available</option>
                        <option value={false} className="bg-[#041024] text-white">unAvailable</option>
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="ml-[60px] text-gray-300 text-sm font-semibold">Stock</label>
                    <input 
                        type="text"
                        value={stock}
                        placeholder="(10 )"
                        onChange={(e) => setstock(e.target.value)}
                        className="ml-[60px] moving-border hover:scale-105 focus:scale-[1.02] focus:outline-none focus:border-blue-500 shadow-md text-sm w-full px-4 py-3 bg-[#041024] border border-gray-600 rounded-lg text-white placeholder-gray-500 transition-all"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="ml-[100px] text-gray-300 text-sm font-semibold">Category</label>
                    {/* ✅ වෙනස් කළා: value සහ Text දෙකම සමානව මුල් අකුරු කැපිටල් කරන ලදී */}
                    <select value={category} onChange={(e) => { setcategory(e.target.value) }} className="ml-[100px] h-[50px] moving-border hover:scale-105 focus:scale-[1.02] focus:outline-none focus:border-blue-500 shadow-md text-sm w-48 px-4 py-3 bg-[#041024] border border-gray-600 rounded-lg text-white transition-all">
                        <option value="Graphic Card" className="bg-[#041024] text-white">Graphic Card</option>
                        <option value="Motherboard" className="bg-[#041024] text-white">Motherboard</option>
                        <option value="CPU" className="bg-[#041024] text-white">CPU</option>
                        <option value="RAM" className="bg-[#041024] text-white">RAM</option>
                        <option value="Storage" className="bg-[#041024] text-white">Storage</option>
                        <option value="Power Supply" className="bg-[#041024] text-white">Power Supply</option>
                        <option value="Casing" className="bg-[#041024] text-white">Casing</option>
                        <option value="Cooling Fan" className="bg-[#041024] text-white">Cooling Fan</option>
                        <option value="Keyboards" className="bg-[#041024] text-white">Keyboards</option>
                        <option value="Mouse" className="bg-[#041024] text-white">Mouse</option>
                        <option value="Laptop" className="bg-[#041024] text-white">Laptop</option>
                        <option value="Monitors" className="bg-[#041024] text-white">Monitors</option>
                        <option value="Chairs" className="bg-[#041024] text-white">Chairs</option>
                        <option value="Tables" className="bg-[#041024] text-white">Tables</option>
                        <option value="Headsets" className="bg-[#041024] text-white">Headsets</option>
                        <option value="Mobiles" className="bg-[#041024] text-white">Mobiles</option>
                        <option value="Consoles" className="bg-[#041024] text-white">Consoles</option>
                        <option value="Tablet PC (Tabs)" className="bg-[#041024] text-white">Tablet PC (Tabs)</option>
                        <option value="Others" className="bg-[#041024] text-white">Others</option>
                    </select>
                </div>
            
                <div className="flex flex-col">
                    <label className="ml-[200px] text-gray-300 text-sm font-semibold">Brand </label>
                    <input
                        type="text"
                        placeholder="(MSI )"
                        value={brand}
                        onChange={(e) => setbrand(e.target.value)}
                        className="ml-[200px] moving-border hover:scale-105 focus:scale-[1.02] focus:outline-none focus:border-blue-500 shadow-md text-sm w-full px-4 py-3 bg-[#041024] border border-gray-600 rounded-lg text-white placeholder-gray-500 transition-all"
                    />
                </div>

                <div className="ml-7 flex flex-col">
                    <label className="text-gray-300 text-sm font-semibold ml-1"> Model </label>
                    <input 
                        type="text"
                        value={model}
                        placeholder="(RTX 5090 )"
                        onChange={(e) => setmodel(e.target.value)}
                        className="moving-border hover:scale-105 focus:scale-[1.02] focus:outline-none focus:border-blue-500 shadow-md text-sm w-full px-4 py-3 bg-[#041024] border border-gray-600 rounded-lg text-white placeholder-gray-500 transition-all"
                    />
                </div>
            </div>

            <div className="fixed bottom-10 right-10 flex flex-col items-center pointer-events-none opacity-80 z-50">
                <span className="text-[10px] text-blue-400 mb-2 font-bold tracking-widest uppercase">
                    {isAtBottom ? "Back to Top" : "Scroll for more"}
                </span>
                <div className={`bg-blue-600 p-3 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)] border border-blue-400/30 transition-transform duration-500 ${isAtBottom ? 'rotate-180' : 'rotate-0'}`}>
                    <FaArrowDown className="text-white text-xl" />
                </div>
            </div>
        </div>
    )
}