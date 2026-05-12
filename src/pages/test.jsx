import { createClient } from '@supabase/supabase-js'
import { useState } from "react"
import uploadMedia from '../utils/mediaUpload'


export default function TestPage () {
   const [files,setfiles]=useState(null)

   async function uploadFile(){
        const res= await uploadMedia(files)
        console.log(res)
    
   }
    return(
        <div className="w-full h-full bg-amber-700">
            <input type="file" onChange={
                (e)=>{
                     
                     setfiles(e.target.files[0])
                }
            }/>
            <button 
            onClick={uploadFile}
            className="h-[50px] w-[200px] bg-blue-700 rounded-4xl text-amber-50 active:bg-[#82B1FF]">Upload</button>
                   
        </div>
    )
}