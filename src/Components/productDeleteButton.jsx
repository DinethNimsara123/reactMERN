import { useState } from "react";
import { CiTrash } from "react-icons/ci";
import toast from "react-hot-toast";
import api from "../utils/api"; 

export default function ProductDeleteButton(props) {
    const refresh = props.refresh;
    const productId = props.productId;

    
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    
    const [isDeleting, setIsDeleting] = useState(false);

    
    function openModal() {
        setShowConfirmModal(true);
    }

    
    function closeModal() {
        setShowConfirmModal(false);
    }

    
    async function handleDelete() {
        try {
            setIsDeleting(true);

            const token = localStorage.getItem("Token");

            
            await api.delete(`/products/${productId}`, {
                headers: {
                    
                    Authorization: `Bearer ${token}`
                }
            });

            toast.success("Product deleted successfully!");
            closeModal(); 
            refresh();    

        } catch (error) {
            console.error(error);
            toast.error("Error deleting product. Please login again.");
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <>
            
            <button
                onClick={openModal}
                className="p-2 hover:bg-red-50 rounded-full transition-colors duration-200"
            >
                <CiTrash className="text-xl text-red-600" />
            </button>

        
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    
                    
                    <div 
                        className="fixed inset-0 bg-black/30 backdrop-blur-[2px]"
                        onClick={closeModal} 
                    ></div>

                    
                    <div className="bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full mx-4 z-10 transform transition-all animate-in fade-in zoom-in-95 duration-200">
                        
                        
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                            <CiTrash className="h-6 w-6 text-red-600" />
                        </div>

                        
                        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                            Confirm Deletion
                        </h3>
                        <p className="text-sm text-gray-500 text-center mb-6">
                            Are you sure you want to delete this product? This action cannot be undone.
                        </p>

                    
                        <div className="flex gap-3 justify-center">
                            
                        
                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-150 disabled:opacity-50"
                            >
                                No, Cancel
                            </button>

                            
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-150 shadow-sm flex items-center gap-2 disabled:opacity-50"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className=" w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Deleting...
                                    </>
                                ) : (
                                    "Yes, Delete"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}