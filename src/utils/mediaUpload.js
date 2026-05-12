import { createClient } from '@supabase/supabase-js'
import { useState } from "react"


const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rcmRsYnFtaWt0bnpycWxhb3dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwODYzNDgsImV4cCI6MjA5MzY2MjM0OH0.7fOwFfXZDHI13JGMVxkyGlGdiWcFykMF8eWuM1AGPaI"
const url = "https://okrdlbqmiktnzrqlaowr.supabase.co"

const supabase=createClient(url,key)

export default function uploadMedia (files) {
    return new Promise(
        (resolve,reject)=>{
            if(files == null){
                reject("No files provided")
            }else{
                const timestamp = new Date ().getTime()
                const fileName = timestamp + "_"+ files.name
                supabase.storage.from("images").upload(fileName,files) 
    .then(
        ()=>{
            const publicUrl = supabase.storage.from("images").getPublicUrl(fileName).data.publicUrl
            resolve(publicUrl)
        }
    ).catch(
        (error)=>{
             reject(error)
        }
    )
  
    
            }
        } 
    )

}