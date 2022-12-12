import Link from "next/link";
import { motion } from "framer-motion"

export default function Message({children, avatar, title, description, userName, user, id, imageUrl}) {
    return(
        <motion.div  
                initial={ {y: 10, opacity: 0} }
                animate={ {y: 0, opacity: 1} }
                transition={{ delay: 0.1 }} 
                key={id}
                className="relative rounded border border-opacity-20 dark:border-opacity-20 border-textColor-light dark:border-textColor-dark bg-container-light dark:bg-container-dark py-8 shadow-sm z-0 cursor-pointer overflow-hidden"
                >
            <div className="relative border-b border-opacity-20 border-textColor-light dark:border-textColor-dark dark:border-opacity-20">
                <h3 className="font-bold text-2xl mb-4 text-center text-textColor-light dark:text-textColor-dark break-words">{title}</h3>
                {!!imageUrl &&  (
                    <div className="top-0 left-0 w-full h-[400px] md:h-[250px] sm:h-[150px]">
                        <img className="w-full h-full object-cover object-center" src={imageUrl}></img>
                    </div>
                )}
                <div className="text-textColor-light px-3 sm:px-6 leading-[100%] sm:leading-5 py-3 dark:text-textColor-dark text-justify indent-2">{description}</div>
            </div>
            <div className="flex flex-wrap items-center px-3 sm:px-6 justify-between h-6 mt-3 transition-all">
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
        </motion.div>
    )
}