import { useEffect, useState } from "react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";
import LoadingScreen from "../../Components/loadingScreen";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchAllUsers = async () => {
        try {
            const token = localStorage.getItem("Token");
            const response = await api.get("/users/admin/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load users");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            const token = localStorage.getItem("Token");
            const response = await api.patch(`/users/admin/users/${userId}/role`, 
                { role: newRole },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUsers(users.map(u => u._id === userId ? response.data : u));
            toast.success("User role updated successfully!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Could not update role");
        }
    };

    const handleBlockToggle = async (userId) => {
        try {
            const token = localStorage.getItem("Token");
            const response = await api.patch(`/users/admin/users/${userId}/block`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.map(u => u._id === userId ? { ...u, isBlocked: response.data.isBlocked } : u));
            toast.success(response.data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || "Action failed");
        }
    };

    const handleDeleteUser = async (userId, e) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to permanently delete this user from the database?")) return;

        try {
            const token = localStorage.getItem("Token");
            await api.delete(`/users/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.filter(u => u._id !== userId));
            setSelectedUser(null);
            toast.success("User permanently deleted.");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete user.");
        }
    };

    if (loading) return <LoadingScreen />;

    return (
        <div className="w-full min-h-screen bg-[#0a1128] text-white px-8 pt-24">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">Users Management Page</h1>
                <p className="text-gray-400 text-sm mb-8">Manage registered platform users, roles, and access permissions.</p>

                <div className="bg-[#041024] rounded-2xl border border-white/10 overflow-x-auto shadow-xl">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-white/10 text-gray-400 uppercase text-xs">
                                <th className="py-4 px-6">Profile</th>
                                <th className="py-4 px-6">Name</th>
                                <th className="py-4 px-6">Email</th>
                                <th className="py-4 px-6">Role</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6 text-center" colSpan="2">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((user) => (
                                <tr 
                                    key={user._id} 
                                    onClick={() => setSelectedUser(user)}
                                    className="hover:bg-white/5 transition-colors cursor-pointer"
                                >
                                    <td className="py-4 px-6">
                                        <img 
                                            src={user.image || "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"} 
                                            alt="Profile" 
                                            className="w-10 h-10 rounded-full object-cover border border-gray-600"
                                        />
                                    </td>
                                    <td className="py-4 px-6 font-medium">
                                        {user.firstName && user.lastName 
                                            ? `${user.firstName} ${user.lastName}` 
                                            : user.firstName || "N/A"}
                                    </td>
                                    <td className="py-4 px-6 text-gray-300">{user.email}</td>
                                    
                                    <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                                        <select 
                                            value={user.isAdmin ? "Admin" : "User"}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            className="bg-[#0a192f] border border-gray-600 rounded-lg px-2 py-1 text-white focus:outline-none cursor-pointer"
                                        >
                                            <option value="User">User</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    </td>
                                    
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.isBlocked ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                                            {user.isBlocked ? "Blocked" : "Active"}
                                        </span>
                                    </td>
                                    
                                    <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                                        <button 
                                            onClick={() => handleBlockToggle(user._id)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all ${user.isBlocked ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-red-600 hover:bg-red-500 text-white'}`}
                                        >
                                            {user.isBlocked ? "Unblock" : "Block"}
                                        </button>
                                    </td>
                                    
                                    <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                                        <button 
                                            onClick={(e) => handleDeleteUser(user._id, e)}
                                            className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-600 hover:bg-rose-700 active:scale-95 transition-all text-white"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedUser && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#041024] border-2 border-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
                        <button 
                            onClick={() => setSelectedUser(null)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-white bg-white/10 w-8 h-8 rounded-full flex items-center justify-center font-bold"
                        >
                            ✕
                        </button>
                        <div className="flex flex-col items-center text-center">
                            <img 
                                src={selectedUser.image || "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"} 
                                alt="User Avatar" 
                                className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-lg mb-4"
                            />
                            <h2 className="text-2xl font-bold mb-1">
                                {selectedUser.firstName && selectedUser.lastName 
                                    ? `${selectedUser.firstName} ${selectedUser.lastName}` 
                                    : selectedUser.firstName || "Unnamed User"}
                            </h2>
                            <p className="text-gray-400 text-sm mb-4">{selectedUser.email}</p>
                            
                            <div className="w-full bg-[#0a192f] rounded-xl p-4 border border-white/5 mb-6 text-left space-y-2">
                                <p className="text-xs text-gray-400">ROLE: <span className="text-white font-semibold">{selectedUser.isAdmin ? "Admin" : "User"}</span></p>
                                <p className="text-xs text-gray-400">STATUS: 
                                    <span className={`font-semibold ml-2 ${selectedUser.isBlocked ? 'text-red-400' : 'text-green-400'}`}>
                                        {selectedUser.isBlocked ? "BLOCKED" : "ACTIVE"}
                                    </span>
                                </p>
                                <p className="text-xs text-gray-400">USER ID: <span className="text-white font-mono text-[10px]">{selectedUser._id}</span></p>
                            </div>

                            <button 
                                onClick={(e) => handleDeleteUser(selectedUser._id, e)}
                                className="w-full py-3 mb-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition-all shadow-lg"
                            >
                                Permanently Delete User
                            </button>

                            <button 
                                onClick={() => setSelectedUser(null)}
                                className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}