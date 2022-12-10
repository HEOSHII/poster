import Link from "next/link";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import User from "./user";
import ThemeChanger from "./themeChanger";
import { motion, AnimatePresence } from "framer-motion"

export default function Nav() {
    const [user, loading] = useAuthState(auth);
    if(!user) return;
    return ( 
            <div className={`w-screen bg-header-light py-3 shadow-md transition-all fixed z-50 hover:opacity-100 dark:bg-header-dark`}>
                <AnimatePresence>
                    <motion.nav initial={{y:-100}} animate={{y:0}} className={`flex justify-between items-center container`}>
                        <Link href="/">
                            <button className={`bg-button-light px-5 rounded shadow-md text-xl font-bold h-button transition-all text-textColor-dark dark:text-textColor-light hover:brightness-105 dark:bg-button-dark`}>
                                POSTS
                            </button>
                        </Link>
                        <ThemeChanger />
                        <User user={ user } />
                    </motion.nav>
                </AnimatePresence>
            </div> 
        )
}