export default function ProductCard(props){
    console.log(props)

    return(
        <div className="border w-56 h-80">
            <h1>{props.name}</h1>
            <img src={props.photo}></img>
                 <p>{props.price}</p>

        </div>
    )
}