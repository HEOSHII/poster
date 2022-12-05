export default function Message({children, avatar, title, description, userName, timestamp}) {
    return(
        <li className="relative border bg-wrapperColor hover:bg-white rounded pt-3 pb-3 px-6 shadow-sm z-0 group cursor-pointer">
            <div className="pb-3 mb-2 border-b border-textColor">
                <h3 className="font-bold text-2xl mb-1">{title}</h3>
                <p>{description}</p>
            </div>
            <div className="flex items-center justify-between h-6 transition-all opacity-50 group-hover:opacity-100">
                <div className="flex h-full items-center">
                    <p className="italic text-sm">{userName}</p>
                    <img className="ml-3 h-full rounded-full" src={avatar} alt="avatar" />
                </div>
                {children}
            </div>
        </li>
    )
}