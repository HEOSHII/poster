import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../utils/firebase";
import Message from "../components/message";
import { useRouter } from "next/router";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import Link from "next/link";
import { variants } from "./index";
import { motion, AnimatePresence } from "framer-motion";
import Controlls from "../components/controlls";
import Comments from "../components/comments";

export default function MyPosts () {
    const [userPosts, setUserPosts] = useState([]);
    const [user, loading] = useAuthState(auth);
    const route = useRouter();
    
    const getData = async () => {
        if(!user) return route.push('/auth/login');
        const postsRef = collection(db, 'posts');
        const queryPosts = query(postsRef, where('user','==', user.uid), orderBy('timestamp','desc'));
        const unsubscribe = onSnapshot(queryPosts, (snapshot) => {
            setUserPosts(snapshot.docs.map(doc => ({...doc.data(), id:doc.id})));
        })
        return unsubscribe;
    }

    useEffect(() => {
        getData()
    }, [user, loading]);

    return(
        <AnimatePresence>
            <motion.ul 
                variants={variants.ul}  
                initial="hidden"
                animate="show"
                exit='hidden'
                className="flex flex-col space-y-3">
                {
                    userPosts.length
                    ? userPosts.map((userPost, index) => {
                        return(
                            <motion.li  
                                variants={variants.li} 
                                transition={{ delay: index*0.1 }} 
                                key={index}>
                                    <Message {...userPost} >
                                        <Comments {...userPost} />
                                        <Controlls {...userPost} />
                                    </Message>
                            </motion.li>
                        )})
                    : <div className="p-3 shadow-sm text-center">
                        { loading 
                            ? 'Loading...' 
                            :   <div className="flex flex-col">
                                    You don't have any posts. Add the first one🤔
                                    <Link href={'/post'}>
                                        <button className="mt-3 h-button bg-slate-100 px-2 rounded">ADD POST</button>
                                    </Link>
                                </div> 
                        }
                    </div>
                }
            </motion.ul>
        </AnimatePresence>
    )
}