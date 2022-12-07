import Link from "next/link";

export default function notFound() {
    return (
        <div>
            <h1>404 - Page Not Found</h1>
            <Link href="/">
                <button>Go to Home page</button> 
            </Link>
        </div>
    )
}