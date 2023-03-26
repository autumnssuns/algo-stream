import { Link } from "react-router-dom"

export function AlgorithmTypeNavBar(){
    return (
        <div className="algorithm-type-nav-bar">
            <Link to="/algorithms/search">Search</Link>
            <Link to="/algorithms/sort">Sort</Link>
        </div>
    )
}