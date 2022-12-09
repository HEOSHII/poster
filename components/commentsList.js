import Link from "next/link";

export default function CommentsList({comments}) {
    return(
        <ul className="rounded">
            {comments.map(comment => 
                <li className="flex p-3 bg-container-light dark:bg-container-dark border-b border-background-light dark:border-background-dark first:rounded-t" key={comment.time}> 
                    <img className="rounded-full h-10" src={comment.avatar} alt="avatar" />
                    <div className="flex flex-col max-w-full break-words items-left opacity-70 ml-2">
                        <Link href={{ pathname: "/", query: {userID: comment.user} }}>
                            <p className="italic text-[14px] hover:underline">{comment.userName}:</p>
                        </Link>
                        <p className="text-md font-comment ">– {comment.comment} </p>
                    </div>
                </li>)
            }
        </ul>
    ) 
}