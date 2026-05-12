import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // මේක අලුතින් එක් කරන්න

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // මේකත් මෙතනට එක් කරන්න
  ],
})



//import { defineConfig } from 'vite'
//mport react from '@vitejs/plugin-react'

// https://vite.dev/config/
//export default defineConfig({
 // plugins: [react()],
//})
