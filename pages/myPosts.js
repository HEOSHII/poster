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

export default function MyPosts () {
    const [userPosts, setUserPosts] = useState([]);
    const [deletePopup, setDeletePopup] = useState(false);
    const [deletePostID, setDeletePostID] = useState(null);
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

    const openDeletePopup = id => {
        setDeletePopup(true);
        setDeletePostID(id);
    }

    const deletePost = async id => {
        const decRef = doc(db,'posts',id);
        await deleteDoc(decRef);
        toast.success('Bye, post...🧹', toastOptions)
        setDeletePopup(false);
    }

    return(
        <div className="py-5">
            <ul className="flex flex-col space-y-3">
                {
                    userPosts.length
                    ? userPosts.map(userPost => {
                        console.log(userPost.id)
                        return(
                            <Message {...userPost} key={userPost.id}>
                                <div className="absolute top-2 right-3 flex justify-center items-center space-x-1">
                                    <Link href={{ pathname:'/post', query: userPost }}>
                                        <button title="Edit" className="text-md flex items-center justify-center transition-all text-green-500 hover:text-green-400">
                                            <MdModeEdit size={20}/>
                                        </button>
                                    </Link>
                                    <button 
                                        title="Delete" 
                                        className="group text-md flex items-center justify-center transition-all  text-red-500 hover:text-red-400"
                                        onClick={() => openDeletePopup(userPost.id)} 
                                    >
                                        <MdDelete size={20}/>
                                    </button>
                                </div>
                            </Message>
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
            </ul>
            {deletePopup && 
                <div className="absolute bg-backgrop w-screen h-screen top-0 left-0 flex justify-center items-center z-50 backdrop-blur-sm">
                    <div className="bg-white shadow-sm p-4 rounded">
                        <p className="mb-5">Are you sure that you want to delete this post?😰</p> 
                        <div className="flex w-max mx-auto space-x-10">
                            <button 
                                className="border py-2 px-4 rounded bg-slate-100 font-bold" 
                                onClick={() => setDeletePopup(false)}>
                                    Back
                            </button>
                            <button 
                                className="border py-2 px-4 rounded bg-red-500 font-bold text-white" 
                                onClick={() => deletePost(deletePostID)}>
                                    Delete
                            </button>
                        </div>
                    </div>
                </div>}
        </div>
    )
}