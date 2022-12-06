import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../utils/firebase";
import Message from "../components/message";
import { useRouter } from "next/router";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { MdDelete, MdModeEdit } from "react-icons/md";
import Link from "next/link";
import { toast } from "react-toastify"
import { toastOptions } from "./post";
import { variants } from "./index";

import { motion, AnimatePresence } from "framer-motion";

export default function MyPosts () {
    const [userPosts, setUserPosts] = useState([]);
    const [deletePostID, setDeletePostID] = useState(0);
    const [user, loading] = useAuthState(auth);
    const route = useRouter();
    
    const getData = async () => {
        if(!user) return route.push('/auth/login');
        const postsRef = collection(db, 'posts');
        const queryPosts = query(postsRef, where('user','==', user.uid));
        const unsubscribe = onSnapshot(queryPosts, (snapshot) => {
            setUserPosts(snapshot.docs.map(doc => ({...doc.data(), id:doc.id})));
        })
        return unsubscribe;
    }

    useEffect(() => {
        getData()
    }, [user, loading]);

    const deletePost = async id => {
        const decRef = doc(db,'posts',id);
        await deleteDoc(decRef);
        toast.success('Bye, post...🧹', toastOptions)
        setDeletePostID(0);
    }

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
                                variants={variants.li} transition={{ delay: index*0.1 }}>
                                    <Message {...userPost} key={userPost.id}>
                                        <div className="flex justify-center items-center space-x-1">
                                            <Link href={{ pathname:'/post', query: userPost }}>
                                                <button title="Edit" className="text-md flex items-center justify-center transition-all text-green-500 hover:text-green-400">
                                                    <MdModeEdit size={20}/>
                                                </button>
                                            </Link>
                                            <button 
                                                title="Delete" 
                                                className="group text-md flex items-center justify-center transition-all  text-red-500 hover:text-red-400"
                                                onClick={() => setDeletePostID(userPost.id)} 
                                            >
                                                <MdDelete size={20}/>
                                            </button>
                                        </div>
                                    </Message>
                                </motion.li>
                            
                        )})
                    : <p className="p-3 shadow-sm text-center">
                        { loading 
                            ? 'Loading...' 
                            :   <div className="flex flex-col">
                                    You don't have any posts. Add the first one🤔
                                    <Link href={'/post'}>
                                        <button className="mt-3 h-button bg-slate-100 px-2 rounded">ADD POST</button>
                                    </Link>
                                </div> 
                        }
                    </p>
                }
            </motion.ul>
        </AnimatePresence>
    )
}