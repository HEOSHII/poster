import Link from "next/link"

export default function Comments({...post}) {
    return(
        <Link href={{ pathname: `/${post.id}`, query: {...post} }} >
            <button className="transition-all opacity-50 hover:underline hover:opacity-100">{post.comments ? post.comments.length : '0'} comments</button>
        </Link>
    )
}