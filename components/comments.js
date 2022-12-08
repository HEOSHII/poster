import Link from "next/link"

export default function Comments(post) {
    return(
        <div>
            <Link href={{ pathname: `/${post.id}`, query: post }} >
                <p className="transition-all opacity-50 hover:underline hover:opacity-100">{post.comments ? post.comments.length : '0'} comments</p>
            </Link>
        </div>        
    )
}