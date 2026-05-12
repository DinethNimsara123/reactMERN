import { MdEmail } from "react-icons/md";
import { MdOutlineKey } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import axios from "axios";
import api from "../utils/api";
import toast from "react-hot-toast";






export default function LoginPage(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const Navigate =useNavigate()
    const [loading,setLoading]=useState(false)

        
      async function handleLogin(){
        try{ 
             //alert("Email: " + email + "Password :" + password);
             //const res = await axios.post("http://localhost:3000/api/users/login",
               // {
                   // email : email,
                   // password : password
              //  }
          // )
          setLoading(true)
          const res = await api.post("/users/login",
                { 
                    email : email,
                    password : password
                }
           )


          console.log(res.data)
           toast.success("Login Saccessfully")
           localStorage.setItem("Token",res.data.token)
           if(res.data.role=="Admin"){
              //window.location.href="/admin"
              Navigate("/admin")
           }else{
               // window.location.href="/"
                 Navigate("/")
           }
   

        }catch(err){

                console.log(err)
                toast.error("Login Failed")
                toast.error(err?.response?.data?.message || "Login Faild")
        }

         setLoading(false)
      }

            
           

            
                 
        
    
return(
    <div className="w-full h-full bg-[url('loginBg.jpg')] bg-cover bg-no-repeat flex justify-center items-center">
    
        <div className="w-[400px] h-[600px]  backdrop-blur-md shadow-2xl shadow-black rounded-3xl flex-col p-4">
            <h1 className="text-white font-bold text-5xl text-center mb-10 "> Login Page</h1>
               <div className="w-full  ">
                
                 <label className="font-bold text-white flex items-center gap-2"> <MdEmail /> Email </label>
                 <input className=" text-white w-full border-b mt-2 transition transform hover:scale-105 focus:scale-105" type="email" placeholder="Enter your Email"
                 onChange={
                    (e)=> {
                        console.log(e.target.value)
                        setEmail(e.target.value)

                    }
                 }
                   value={email}
                 />
               </div>


                <div>
                 <label className="font-bold text-white flex items-center gap-2 mt-10 "> <MdOutlineKey />Password</label>
                 <input className=" text-white w-full border-b mt-2 transition transform hover:scale-105 focus:scale-105" type="password" placeholder="Enter your Password"
                   onChange={
                    (e)=> {
                        console.log(e.target.value)
                        setPassword(e.target.value)

                    }
                 }
                 value={password}
                 />

                </div>
                <p className="text-white font-light mt-2">Forget your password? click<Link to="/forget-password" className="underline text-blue-600 ml-2">Here</Link> </p>
                 <div>
                <button  disabled={loading} className="w-full h-[50px] bg-blue-700 text-amber-50 mt-10 active:bg-blue-950 transition" onClick={handleLogin}>
                    {
                        loading?"Loading":"Login"
                    }
                    </button> 
              
                </div>
                <p className="text-white font-light mt-2">Don't have an account? click<Link to="/forget-password" className="underline text-blue-600 ml-2">Here</Link> </p>
                 <button className="w-full h-[50px] bg-white text-black mt-10 active:bg-amber-100 transition flex justify-center items-center"><FcGoogle  className="mr-2 text-4xl"/>SIgn In With Google</button>

        </div> 
        
    
    </div>


)

}
