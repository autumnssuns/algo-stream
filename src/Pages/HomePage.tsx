import { Link } from "react-router-dom"

export function HomePage() {
    return (
        <div>
            <h1>Home</h1>
            <Link to="/linear-algorithms">Linear Algorithms</Link>
        </div>
    )
}