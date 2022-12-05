export default function Message({children, avatar, title, description, userName, timestamp}) {
    return(
        <li className="relative border bg-slate-50 rounded pt-3 pb-3 px-6 shadow-sm z-0">
            <div>
                <h3 className="font-bold text-xl mb-5">{title}</h3>
                <p>{description}</p>
            </div>
            <div className="flex items-center justify-end h-6">
                <p className="italic text-sm">{userName}</p>
                <img className="ml-3 h-full rounded-full" src={avatar} alt="avatar" />
            </div>
            {children}
        </li>
    )
}