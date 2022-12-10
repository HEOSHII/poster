import Link from "next/link";

export default function Message({children, avatar, title, description, userName, user}) {

    return(
            <div className="bg-container-light dark:bg-container-dark rounded py-8 px-6 shadow-sm z-0 group cursor-pointer">
                <div className="pb-4 border-b border-opacity-20 border-textColor-light dark:border-textColor-dark dark:border-opacity-20">
                    <h3 className="font-bold text-2xl mb-4 text-center text-textColor-light dark:text-textColor-dark break-words">{title}</h3>
                    <div className="text-textColor-light dark:text-textColor-dark text-justify indent-2">{description}</div>
                </div>
                <div className="flex flex-wrap items-center justify-between h-6 mt-3 transition-all opacity-50 group-hover:opacity-100">
                    <div className="flex h-full items-center">
                        <Link href={{ pathname:'/', query: {userID: user, userName}}}>
                            <p className="italic text-sm hover:underline text-textColor-light dark:text-textColor-dark hover:text-button-light dark:hover:text-button-dark">{userName}</p>
                        </Link>
                        <Link href={{ pathname:'/', query: {userID: user, userName}}} className="h-full">
                            <img className="ml-3 h-full rounded-full" src={avatar} alt="avatar" />
                        </Link>
                    </div>
                    {children}
                </div>
            </div>
    )
}