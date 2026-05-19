import { AiOutlinePlus } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../utils/api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";
import toast from "react-hot-toast";
import LoadingScreen from "../../Components/loadingScreen";
import ProductDeleteButton from "../../Components/productDeleteButton";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartDataLabels
);

const sampleProducts = [   
  {
    productId: "GPU-001",
    name: "NVIDIA GeForce RTX 4090 24GB",
    altNames: ["RTX 4090", "Gaming GPU", "Flagship Card"],
    price: 650000,
    labelledPrice: 720000,
    description: "The ultimate GeForce GPU for gaming and productivity.",
    images: ["/images/products/rtx4090-front.png"],
    brand: "NVIDIA",
    model: "RTX 4090",
    category: "Graphic Card",
    stock: 5,
    isAvailable: true,
  },
  {
    productId: "CPU-002",
    name: "Intel Core i9-14900K",
    altNames: ["i9 14th Gen", "High-end CPU"],
    price: 185000,
    labelledPrice: 210000,
    description: "24-core desktop processor for extreme performance.",
    images: ["/images/products/i9-14900k.png"],
    brand: "Intel",
    model: "i9-14900K",
    category: "Processor",
    stock: 12,
    isAvailable: true,
  },
  {
    productId: "RAM-003",
    name: "Corsair Vengeance RGB 32GB DDR5",
    altNames: ["32GB DDR5", "RGB RAM"],
    price: 45000,
    labelledPrice: 52000,
    description: "High-performance DDR5 memory with dynamic RGB lighting.",
    images: ["/images/products/corsair-ddr5.png"],
    brand: "Corsair",
    model: "Vengeance RGB",
    category: "Memory",
    stock: 0,
    isAvailable: false,
  },
  {
    productId: "MB-004",
    name: "ASUS ROG Maximus Z790 Hero",
    altNames: ["Z790 Motherboard", "ROG Hero"],
    price: 145000,
    labelledPrice: 160000,
    description: "Feature-rich motherboard for enthusiasts and gamers.",
    images: ["/images/products/z790-hero.png"],
    brand: "ASUS",
    model: "Maximus Z790 Hero",
    category: "Motherboard",
    stock: 8,
    isAvailable: true,
  }
]

export default function AdminProductspage() {
  const [products, setProducts] = useState([]);
  const[PRODUCTS,setPRODUCTS]=useState([])
  const [loading, setLoading] = useState(true);

  //useEffect එකට දැම්මහම එක පාරක් පමණක් run වේ
  useEffect(() => {
    if(loading) {

           const token = localStorage.getItem("Token"); 

    api.get("/products", {
      headers: {
        Authorization: "Bearer " + token 
      }
    }).then((res) => {
      setPRODUCTS(res.data);
      setProducts(res.data); 
      setLoading(false);
    }).catch(err => {
      console.error("දත්ත ලබාගැනීමේ දෝෂයක්:", err);
      setLoading(false);
    });
    
  }
  }, [loading]);

  async function loadProducts() {
    try {
      const token = localStorage.getItem("Token");

      const res = await api.get("/products", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.products)
        ? res.data.products
        : [];

      setProducts(list);
    } catch (err) {
      console.log(err);
    }
  }

  const categories = [
    "graphic card",
    "motherboard",
    "cpu",
    "ram",
    "storage",
    "power supply",
    "caseing",
    "cooling fan",
    "key boards",
    "mouse",
    "laptop",
    "Monitors",
    "Chairs",
    "Tables",
    "Headsets",
    "Mobiles",
    "Consoles",
    "Tablet PC (Tabs)",
    "others",
  ];

  // --- වෙනස් කළ කොටස: මෙතනින් සමස්ත ස්ටොක් එක එකතු කරනවා ---
  const counts = categories.map((cat) => {
    return products
      .filter(
        (item) =>
          (item.category || "").trim().toLowerCase() ===
          cat.trim().toLowerCase()
      )
      .reduce((total, item) => total + (Number(item.stock) || 0), 0); // ස්ටොක් එකතු කිරීම
  });

  // --- වෙනස් කළ කොටස: වැඩිම ස්ටොක් එක අනුව චාර්ට් එකේ උස ඉබේ හැදෙනවා ---
  const maxValue = Math.max(...counts, 1);

  const data = {
    labels: categories,
    datasets: [
      {
        data: counts,
        backgroundColor: "#38bdf8",
        borderRadius: 10,
        borderSkipped: false,
        barThickness: 38,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1200,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
      datalabels: {
        color: "#ffffff",
        anchor: "end",
        align: "top",
        offset: 4, // බාර් එකට උඩින් අගය පෙන්වීමට
        font: {
          size: 14,
          weight: "bold",
        },
        formatter: function (value) {
          return value;
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
          maxRotation: 55,
          minRotation: 55,
          font: {
            size: 11,
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        max: maxValue + (maxValue * 0.1), // උඩින් 10% ක ඉඩක් තබා උස සකස් කිරීම
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="h-full w-full bg-[#041024] relative p-4">
      {
        loading && <LoadingScreen/>
      }
      <div className="w-full max-w-[1400px] h-[520px] mx-auto bg-[#0d1b35] rounded-3xl p-6 shadow-2xl border border-blue-500">
        <h1 className="text-white text-3xl font-bold text-center mb-6">
          Product Summary Dashboard
        </h1>

        <div className="h-[400px]">
          <Bar data={data} options={options} />
        </div>
      </div>
      <div className="w-full h-full">
  
  <div  className=" mt-5  w-full overflow-x-auto rounded-xl border border-gray-800 bg-[#020a18]">
      <table className="w-full text-left border-collapse">
        <thead>
          
          <tr className="border-b border-gray-800 bg-[#051124]">
             <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-[#f4f4f4]">-</th>
            <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-[#f4f4f4]">Product ID</th>
            <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-[#f4f4f4]">Name</th>
            <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-[#f4f4f4]">Price</th>
            <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-[#f4f4f4]">Label Price</th>
            <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-[#f4f4f4]">Brand</th>
            <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-[#f4f4f4]">Model</th>
            <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-[#f4f4f4]">Category</th>
            <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-[#f4f4f4]">Availability</th>
            <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-[#f4f4f4]">Stock</th>
            <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-[#f4f4f4]">Actions</th>

          </tr>
        </thead>
        <tbody>
          {
             PRODUCTS.map(
              (PRODUCT,index) => {
                return <tr key={index} className="border-b border-gray-800/50 hover:bg-[#081b36] transition-colors group">
                      <td className="p-3">
                        <div className="w-12 h-12 rounded border border-gray-700 overflow-hidden bg-[#0a1f44]">
                       <img src={PRODUCT.image?.[0]} alt={PRODUCT.name} className="w-full h-full object-cover" />
                      </div>
                      </td>
                      <td className="p-3 text-[11px] font-mono text-blue-400">{PRODUCT.productId}</td>
                      <td className="p-3 text-xs font-medium text-gray-200 min-w-[150px]">{PRODUCT.name}</td>
                      <td className="p-3 text-xs font-bold text-[#00ffa3]">{PRODUCT.price}</td>
                      <td className="p-10 text-[20px] text-gray-600 line-through">{PRODUCT.labelPrice}</td>
                      <td className="p-3 text-xs text-gray-400">{PRODUCT.brand}</td>
                      <td className="p-3 text-[11px] text-gray-500 italic">{PRODUCT.model}</td>
                      <td className="p-3 text-[10px] uppercase text-gray-400">{PRODUCT.category}</td>
                      <td className="p-3 text-xs">
                        {PRODUCT.isAvailable ? (
                          <span className="text-green-500">In Stock</span>
                        ) : (
                          <span className="text-red-500">Out of Stock</span>
                        )}
                      </td>
                      <td className="p-3 text-center text-xs text-gray-300">{PRODUCT.stock}</td>
                  <td>


              {/*  <button 
  className="px-3 py-1 text-sm font-medium text-white bg-red-700 rounded hover:bg-red-500 transition"
  onClick={() => {
    const token = localStorage.getItem("Token");
    
    // මුලින්ම ID එක පෙන්වන්න toast එකක් දාමු
    toast.loading("Deleting " + PRODUCT.productId + "...");

    api.delete("/products/" + PRODUCT.productId, { // මෙතන PRODUCT._id (Database ID) එක දෙන එක වඩාත් සුදුසුයි
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => {
      toast.dismiss(); // Loading එක අයින් කරනවා
      toast.success("Product deleted successfully");
       console.log("Product deleted successfully");
      setLoading(true); // Products නැවත load කරනවා
      
      // UI එකෙන් අදාළ product එක අයින් කරනවා (මෙතන වරහන් හරියට බලන්න)
      setPRODUCTS(PRODUCTS.filter((p) => p._id !== PRODUCT._id));
      setProducts(products.filter((p) => p._id !== PRODUCT._id)); // Charts වලටත් මේක ඕනේ
    })
    .catch((error) => {
      toast.dismiss();
      toast.error("Error deleting product");
      console.error(error);
    });
  }}
>
  Delete
</button>*/}

<ProductDeleteButton productId={PRODUCT.productId} refresh={()=>setLoading(true)} />

                  </td>
                </tr>
              } 
            ) 
          }
        </tbody>
      </table>
</div>

      <Link
        to="/admin/add-product"
        className="w-[90px] h-[90px] rounded-full bg-[#8BC34A] text-5xl flex justify-center items-center fixed bottom-4 right-5 shadow-2xl active:scale-95 transition-all"
      >
        <AiOutlinePlus />
      </Link>
      </div>

    </div>
  );
}

//import { AiOutlinePlus } from "react-icons/ai";
//import { Routes,Route,Link} from 'react-router-dom'



//export default function AdminProductspage () {
       
//return(
   // <div className="h-full w-full bg-[#041024]">
          //<Link to="/admin/add-product" className="w-[100px] h-[100px] rounded-full bg-[#8BC34A] text-5xl flex justify-center items-center fixed bottom-4 right-5 shadow-2xl active:bg-red-700">
    
            //<AiOutlinePlus/>
          //</Link>

    //</div>
//)

//}