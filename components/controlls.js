import { MdDelete, MdModeEdit } from "react-icons/md";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../utils/firebase";
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
        route.push('/');
    }

    return (
        <div className="flex justify-center items-center space-x-1 z-20">
            <Link href={{ pathname:'/post', query: post }}>
                <button title="Edit" className="text-md flex items-center justify-center transition-all text-green-500 hover:text-green-400">
                    <MdModeEdit size={20}/>
                </button>
            </Link>
            <button 
                title="Delete" 
                className="group text-md flex items-center justify-center transition-all  text-red-500 hover:text-red-400"
                onClick={() => setDeletePostID(post.id)} 
            >
                <MdDelete size={20}/>
            </button>
            {deletePostID && (
                <AnimatePresence>
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="fixed top-0 left-0 z-30 w-screen h-screen bg-backgropColor backdrop-blur-sm flex justify-center items-center"
                        onClick={()=>setDeletePostID('')}>
                        <motion.div initial={{opacity:0,y:50}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="bg-wrapperColor p-10 rounded shadow-md" onClick={(e)=>e.stopPropagation()}>
                            <p className="font-bold mb-6">Are you sure that you wanna to remove this post?</p>
                            <div className="flex justify-center space-x-10 font-bold"  >
                                <button className="shadow-md rounded bg-white px-5 py-2" onClick={()=>setDeletePostID('')}>BACK</button>
                                <button className="shadow-md rounded bg-buttonColor-main hover:bg-buttonColor-hover text-white px-5 py-2" onClick={() => deletePost(deletePostID)}>DELETE</button>
                            </div>
                        </motion.div>
                    </motion.div> 
                </AnimatePresence>
            )}
        </div>
    )
}