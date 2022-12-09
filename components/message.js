import Link from "next/link";

export default function Message({children, avatar, title, description, userName, user}) {

    return(
            <div className="bg-container-light dark:bg-container-dark rounded pt-3 pb-3 px-6 shadow-sm z-0 group cursor-pointer">
                <div className="pb-3 mb-2 border-b border-textColor">
                    <h3 className="font-bold text-2xl mb-1">{title}</h3>
                    <div>{description}</div>
                </div>
                <div className="flex items-center justify-between h-6 transition-all opacity-50 group-hover:opacity-100">
                    <div className="flex h-full items-center">
                        <Link href={{ pathname:'/', query: {userID: user, userName}}}>
                            <p className="italic text-sm hover:underline">{userName}</p>
                        </Link>
                        <img className="ml-3 h-full rounded-full" src={avatar} alt="avatar" />
                    </div>
                    {children}
                </div>
            </div>
    )
}