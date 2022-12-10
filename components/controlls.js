import { MdDelete, MdModeEdit } from "react-icons/md";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { db, auth } from "../utils/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify"
import { toastOptions } from "../utils/variables";
import { useRouter } from "next/router";

export default function Controlls({...post}) {
    const [deletePostID, setDeletePostID] = useState('');
    const route = useRouter();
    const deletePost = async id => {
        const decRef = doc(db,'posts',id);
        await deleteDoc(decRef);
        toast.success('Bye, post...🧹', toastOptions)
        setDeletePostID(0);
        route.push({pathname: '/', query: {userID: auth.currentUser.uid}})
    }

    return (
        <div className="absolute top-2 right-2 flex justify-center items-center space-x-1 z-20">
            <Link href={{ pathname:'/post', query: post }} >
                <button 
                    title="Edit" 
                    className="text-md flex items-center justify-center transition-all text-green-600 hover:text-green-700">
                        <MdModeEdit size={25}/>
                </button>
            </Link>
            <button 
                title="Delete" 
                className="group text-md flex items-center justify-center transition-all  text-delete hover:brightness-95"
                onClick={() => setDeletePostID(post.id)}>
                    <MdDelete size={25}/>
            </button>
            <AnimatePresence>
                {deletePostID && (
                        <motion.div 
                            initial={{opacity:0}} 
                            animate={{opacity:1}} 
                            exit={{opacity:0}} 
                            key={'popup'} 
                            className="fixed top-0 left-0 z-30 w-screen h-screen bg-backdrop backdrop-blur-sm flex justify-center items-center"
                            onClick={()=>setDeletePostID('')}>
                                <motion.div 
                                    initial={{opacity:0, y:20}} 
                                    animate={{opacity:1, y:0}} 
                                    exit={{opacity:0, y:20}} 
                                    transition={{duration:0.2}}
                                    key={'buttons'}  
                                    className="bg-container-light p-10 rounded shadow-md dark:bg-container-dark" 
                                    onClick={(e)=>e.stopPropagation()}>
                                        <p className="flex mb-6 w-max mx-auto text-center">Delete post: "<p className="max-w-[250px] font-bold overflow-hidden whitespace-nowrap overflow-ellipsis">{post.title}</p>" ?</p>
                                        <div className="flex justify-center space-x-10 font-bold"  >
                                            <button className="shadow-md rounded bg-white px-5 py-2" onClick={()=>setDeletePostID('')}>BACK</button>
                                            <button className="shadow-md rounded bg-delete hover:brightness-105 text-white px-5 py-2" onClick={() => deletePost(deletePostID)}>DELETE</button>
                                        </div>
                                </motion.div>
                        </motion.div> 
                )}
            </AnimatePresence>
        </div>
    )
}