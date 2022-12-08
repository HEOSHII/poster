import { auth } from "../utils/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { useRouter } from "next/router"
import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TEXTS } from "../utils/variables";

export default function Dashboard({isOpened}) {
    const route = useRouter();
    const [user,loading] = useAuthState(auth);

    //Are user logged
    const checkUser = async () => {
        if(loading) return;
        if(!user) return route.push('/auth/login');
    }

    //Get users data
    useEffect(() => {
        checkUser();
        },[user,loading]
    );

    const signOut = () => {
        auth.signOut();
        route.push('/auth/login');
    }

    return(
        <AnimatePresence>
                {isOpened && (
                    <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0, y: -5 }}
                        className="bg-white absolute overflow-hidden left-[-0.5rem] top-[calc(100%-1px)] w-full shadow-md rounded-b">
                        <Link href="/post">
                            <button className="w-full hover:bg-wrapperColor py-3 px-3 text-right text-lg">
                                {TEXTS.DASHBOARD.NEW_POST}
                            </button>
                        </Link>
                        <Link href={{pathname: '/', query: {userID: user.uid} }}>
                            <p className="w-full hover:bg-wrapperColor py-3 px-3 text-right text-lg">
                                {TEXTS.DASHBOARD.USER_POSTS}
                            </p>
                        </Link>
                        <Link href={{pathname: '/profile' }}>
                            <p className="w-full hover:bg-wrapperColor py-3 px-3 text-right text-lg">
                                {TEXTS.DASHBOARD.PROFILE}
                            </p>
                        </Link>
                        <button className="w-full border-t hover:bg-wrapperColor py-3 px-3 text-right text-lg rounded-b " onClick={signOut}>
                            {TEXTS.DASHBOARD.SIGN_OUT}
                        </button>
                    </motion.div>
                )}
        </AnimatePresence>
    )
}