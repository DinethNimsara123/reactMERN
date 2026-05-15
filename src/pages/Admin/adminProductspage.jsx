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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartDataLabels
);



const sampleProducts = [


]

export default function AdminProductspage() {
  const [products, setProducts] = useState([]);
  const[PRODUCTS,setPRODUCTS]=useState(sampleProducts)

  useEffect(() => {
    loadProducts();
  }, []);

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

  const counts = categories.map((cat) => {
    return products.filter(
      (item) =>
        (item.category || "").trim().toLowerCase() ===
        cat.trim().toLowerCase()
    ).length;
  });

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
        max: maxValue + 2,
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
      <div className="w-full max-w-[1400px] h-[520px] mx-auto bg-[#0d1b35] rounded-3xl p-6 shadow-2xl border border-blue-500">
        <h1 className="text-white text-3xl font-bold text-center mb-6">
          Product Summary Dashboard
        </h1>

        <div className="h-[400px]">
          <Bar data={data} options={options} />
        </div>
      </div>
      <div className="w-full h-full">
{
        PRODUCTS.map(
          (PRODUCT,index) => {

              toast.success("hi")
              return(
                <div key={index}>   
                  <h2>{PRODUCT.name}</h2>
                  <p>{PRODUCT.description}</p>
                </div>
              )
          }
        )

  }



      

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

/*import { AiOutlinePlus } from "react-icons/ai";
import { Routes,Route,Link} from 'react-router-dom'



export default function AdminProductspage () {
       
return(
    <div className="h-full w-full bg-[#041024]">
          <Link to="/admin/add-product" className="w-[100px] h-[100px] rounded-full bg-[#8BC34A] text-5xl flex justify-center items-center fixed bottom-4 right-5 shadow-2xl active:bg-red-700">
    
            <AiOutlinePlus/>
          </Link>

    </div>
)

}*/