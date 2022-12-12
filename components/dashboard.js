import { auth } from "../utils/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { useRouter } from "next/router"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { TEXTS } from "../utils/variables"

export default function Dashboard({ isOpened }) {
    const route = useRouter();
    const [user, loading] = useAuthState(auth);
    
    const signOut = async () => {
        await auth.signOut();
        route.push('/auth/login');
        return;
    }

    return(
        <AnimatePresence>
                {isOpened && (
                    <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0, y: -5 }}
                        className="bg-slate-100 fixed top-0 right-0 overflow-hidden  w-full shadow-md rounded-b min-w-[100px] sm:absolute sm:left-0 sm:top-[calc(100%-1px)]">
                        <Link href="/post">
                            <button className="w-full hover:bg-slate-200 py-3 px-3 text-right text-lg text-gray-700">
                                {TEXTS.DASHBOARD.NEW_POST}
                            </button>
                        </Link>
                        <Link href={{pathname: '/', query: {userID: user.uid, userName: user.displayName } }}>
                            <p className="w-full hover:bg-slate-200 py-3 px-3 text-right text-lg text-gray-700">
                                {TEXTS.DASHBOARD.USER_POSTS}
                            </p>
                        </Link>
                        <Link href={{pathname: '/profile' }} >
                            <p className="w-full hover:bg-slate-200 py-3 px-3 text-right text-lg text-gray-700">
                                {TEXTS.DASHBOARD.PROFILE}
                            </p>
                        </Link>
                        <button className="w-full border-t hover:bg-slate-200 py-3 px-3 text-right text-lg text-gray-700 rounded-b " onClick={signOut}>
                            {TEXTS.DASHBOARD.SIGN_OUT}
                        </button>
                    </motion.div>
                )}
        </AnimatePresence>
    )
}