import { Link } from "react-router-dom"

export default function Header(props){
    console.log(props)

    return(
        <div className=" bg-gradient-to-r from-blue-500 to-green-500   flex items-center justify-between w-full h-[100px] bg-amber-700">
            <Link to="/" >
              <img src="/logo.png" alt="Logo" className="w-[300px] h-[200px] w-auto object-cover" />
            </Link>
        </div>
    )
}