import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../Components/header";
import ProductsPage from "./Home/productsPage";
import ProductOverview from "./Home/ProductOverview";
import api from "../utils/api"; 
import uploadMedia from "../utils/mediaUpload"; // 👈 උඹේ Supabase Upload Function එක තියෙන තැන
import { FaChevronLeft, FaChevronRight, FaShippingFast, FaTag, FaLaptop, FaCog, FaSave, FaCloudUploadAlt, FaSpinner } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Footer from "../Components/footer";
import ContactUs from "./contactUs";
import AboutUs from "./AboutUs";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false); 
  const [showAdminPanel, setShowAdminPanel] = useState(false); 
  const [loading, setLoading] = useState(false);

  const [slides, setSlides] = useState([]);
  const [adBanner, setAdBanner] = useState("");

  const [slideFiles, setSlideFiles] = useState([null, null, null, null, null]);
  const [adFile, setAdFile] = useState(null);

  const [previews, setPreviews] = useState([]);
  const [adPreview, setAdPreview] = useState("");

  // 1. පේජ් එක ලෝඩ් වෙද්දී ඩේටාබේස් එකෙන් බැනර්ස් ඇදලා ගැනීම
  useEffect(() => {
    api.get("/settings/banners")
      .then((res) => {
        setSlides(res.data.slides);
        setAdBanner(res.data.adBanner);
        setPreviews(res.data.slides.map(s => s.url));
        setAdPreview(res.data.adBanner);
      })
      .catch((err) => console.error("Failed to fetch banners", err));

    // ඇඩ්මින්ද කියා බැලීම
    const token = localStorage.getItem("Token");
    if (token) {
      api.get("/users/me", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          if (res.data.isAdmin) setIsAdmin(true); 
        })
        .catch((err) => console.error("Admin check failed", err));
    }
  }, []);

  // ⏱️ Auto-play Timer (තත්පර 3න් 3ට මාරු වීම)
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [slides]);

  const handleFileChange = (index, file) => {
    if (!file) return;
    const newFiles = [...slideFiles];
    newFiles[index] = file;
    setSlideFiles(newFiles);

    const newPreviews = [...previews];
    newPreviews[index] = URL.createObjectURL(file);
    setPreviews(newPreviews);
  };

  const handleAdFileChange = (file) => {
    if (!file) return;
    setAdFile(file);
    setAdPreview(URL.createObjectURL(file));
  };

  // 💾 🚀 Supabase Upload කරලා MongoDB Save කරන ප්‍රධාන Function එක
  const handleUploadAndSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("Token");
    toast.loading("Uploading Banners to Supabase & Syncing with Database...", { id: "savingSettings" });

    try {
      // Slider Photos 5 චෙක් කරලා Supabase යැවීම
      const finalSlides = [];
      for (let i = 0; i < 5; i++) {
        if (slideFiles[i]) {
          const uploadedUrl = await uploadMedia(slideFiles[i]); 
          finalSlides.push({ url: uploadedUrl });
        } else {
          finalSlides.push({ url: slides[i].url });
        }
      }

      // Ad Banner එක Supabase යැවීම
      let finalAdUrl = adBanner;
      if (adFile) {
        finalAdUrl = await uploadMedia(adFile); 
      }

      // ලින්ක්ස් ටික MongoDB එකට යවා සේව් කිරීම
      const response = await api.post("/settings/banners", 
        { slides: finalSlides, adBanner: finalAdUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSlides(response.data.settings.slides);
      setAdBanner(response.data.settings.adBanner);
      setSlideFiles([null, null, null, null, null]);
      setAdFile(null);

      toast.success("All Banners Permanently Saved to Database! 🔥", { id: "savingSettings" });
      setShowAdminPanel(false);
    } catch (err) {
      console.error(err);
      toast.error("Upload failed: " + err.message, { id: "savingSettings" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen">
      <Header />
      <div className="bg-[#041024] w-full min-h-screen">
        
        <Routes>
          {/* 🏠 Main Home Path - මෙතනට තමයි ස්ලයිඩර් එක සෙට් වෙන්නේ */}
          <Route path="/" element={
            <div className="max-w-[1300px] mx-auto px-4 pt-6 space-y-6 pb-12">
              
              {/* 🛠️ Admin Control Button */}
              {isAdmin && (
                <div className="flex justify-end">
                  <button 
                    type="button"
                    onClick={() => setShowAdminPanel(!showAdminPanel)}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <FaCog /> {showAdminPanel ? "Hide Panel" : "Upload Banner Files (Admin Only)"}
                  </button>
                </div>
              )}

              {/* 🎛️ ADMIN UPLOAD CONTROL PANEL FORM */}
              {isAdmin && showAdminPanel && (
                <form onSubmit={handleUploadAndSave} className="bg-[#111827]/90 border border-amber-500/30 p-6 rounded-2xl space-y-4 shadow-xl">
                  <h3 className="text-sm font-bold text-amber-400 uppercase flex items-center gap-2">
                    <FaCloudUploadAlt /> Choose Files to Upload
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-300">
                    <div className="space-y-3 bg-black/30 p-4 rounded-xl border border-gray-800">
                      <span className="block font-bold text-blue-400 uppercase">1. Home Slider Images (Max 5)</span>
                      {[0, 1, 2, 3, 4].map((idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-900 pb-2">
                          <span>Slide {idx + 1} File:</span>
                          <input 
                            type="file" accept="image/*"
                            onChange={(e) => handleFileChange(idx, e.target.files[0])}
                            className="text-[11px] text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-900/40 file:text-blue-400 file:cursor-pointer hover:file:bg-blue-900/60"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4 bg-black/30 p-4 rounded-xl border border-gray-800 flex flex-col justify-between">
                      <div>
                        <span className="block font-bold text-cyan-400 uppercase mb-3">2. Bottom Promotion Banner</span>
                        <div className="flex flex-col gap-2">
                          <label className="text-gray-400">Select Banner Ad File:</label>
                          <input 
                            type="file" accept="image/*"
                            onChange={(e) => handleAdFileChange(e.target.files[0])}
                            className="text-[11px] text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-cyan-900/40 file:text-cyan-400 file:cursor-pointer hover:file:bg-cyan-900/60"
                          />
                        </div>
                      </div>
                      <div className="p-3 bg-blue-950/20 border border-blue-900/40 rounded-xl text-gray-400 text-[11px] leading-relaxed">
                        💡 **භාවිතා කරන්නේ කෙසේද?** ඇඩ්මින් කෙනෙක් විදිහට ලොග් වී මෙතනින් ඉමේජ් ෆයිල්ස් තෝරලා පහළ තියෙන බටන් එක ක්ලික් කරන්න. එවිට ඔටෝම සුපර්බේස් එකට අප්ලෝඩ් වී ලින්ක්ස් ටික MongoDB එකේ සේව් වේවි! හැමෝටම වෙනස් වෙලා පෙනෙයි.
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-md cursor-pointer transition-colors"
                    >
                      {loading ? <FaSpinner className="animate-spin" /> : <FaSave />} 
                      {loading ? "Uploading..." : "Upload & Save to Database"}
                    </button>
                  </div>
                </form>
              )}

              {/* 🎚️ Main Slider Render */}
              {slides.length > 0 ? (
                <div className="relative w-full h-[240px] sm:h-[360px] md:h-[420px] rounded-3xl overflow-hidden group border border-gray-800/40 shadow-2xl">
                  <div
                    style={{ backgroundImage: `url(${previews[currentSlide]})` }}
                    className="w-full h-full bg-center bg-cover duration-700 relative flex items-center"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent"></div>
                    <div className="relative z-10 pl-8 sm:pl-16 max-w-xl space-y-2">
                      <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded uppercase tracking-widest">Featured Tech Deals</span>
                      <h1 className="text-xl sm:text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-white leading-tight">
                        DN STORE DIGITAL HUB
                      </h1>
                      <p className="text-xs sm:text-sm font-medium text-gray-300">Experience premium performance with modern design specs.</p>
                      <div className="flex gap-2 pt-1">
                        <span className="flex items-center gap-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-lg text-[10px] font-bold"><FaShippingFast /> Free Shipping</span>
                      </div>
                    </div>
                  </div>
                  <button type="button" onClick={() => setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1)} className="hidden group-hover:flex absolute top-1/2 -translate-y-1/2 left-5 text-white p-3 bg-black/40 rounded-full cursor-pointer"><FaChevronLeft size={14} /></button>
                  <button type="button" onClick={() => setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1)} className="hidden group-hover:flex absolute top-1/2 -translate-y-1/2 right-5 text-white p-3 bg-black/40 rounded-full cursor-pointer"><FaChevronRight size={14} /></button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5">
                    {slides.map((_, idx) => (
                      <button type="button" key={idx} onClick={() => setCurrentSlide(idx)} className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${currentSlide === idx ? "w-6 bg-blue-400" : "w-1.5 bg-gray-600"}`} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-full h-[240px] bg-black/20 border border-gray-800 rounded-3xl flex items-center justify-center text-xs text-gray-500 animate-pulse">Loading Store Banners...</div>
              )}

              {/* ⚡ Bottom Ad Banner */}
              {adPreview && (
                <div 
                  style={{ backgroundImage: `url(${adPreview})` }}
                  className="relative w-full h-[130px] sm:h-[160px] rounded-2xl bg-center bg-cover border border-gray-800/40 shadow-xl overflow-hidden flex items-center px-6 sm:px-12"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>
                  <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between w-full gap-4">
                    <div className="text-center sm:text-left">
                      <span className="bg-red-600 text-white font-bold text-[9px] tracking-widest uppercase px-2 py-0.5 rounded">Special Promotion</span>
                      <h2 className="text-base sm:text-xl font-black text-white uppercase tracking-wide mt-1">DN Store Premium Hub</h2>
                    </div>
                  </div>
                </div>
              )}

            </div>
          } />

          {/* 📦 අනිත් සාමාන්‍ය රූට්ස් ටික එහෙම්මම තියෙනවා */}
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/overview/:productId" element={<ProductOverview />} />
          <Route path="/*" element={<h1 className="text-white text-3xl font-bold p-5">404 Not Found page</h1>} />
        </Routes>
<Footer />
      </div>
    </div>
  );
}