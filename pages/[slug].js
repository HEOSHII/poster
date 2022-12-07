import { useRouter } from "next/router"
import Message from "../components/message"
import { useState, useEffect } from "react"
import { auth, db } from "../utils/firebase"
import { toast } from "react-toastify"
import { toastOptions } from "../utils/variables"
import { arrayUnion, doc, onSnapshot, Timestamp, updateDoc } from "firebase/firestore"

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link"

export default function Details() {
    const route = useRouter();
    const routePost = route.query;
    const [comment, setComment] = useState('');
    const [allComments, setAllComments] = useState([]);

    //Submit comment
    const submitComment = async () => {
        //Check is user logget
        if(!auth.currentUser) return route.push('/auth/loggin');
        if(!comment) return toast.error('You need to type something!🤬',toastOptions);

        const docRef = doc(db, 'posts', routePost.id);
        await updateDoc(docRef, {
            ...routePost, 
            timestamp: Number(routePost.timestamp),
            comments: arrayUnion({
                comment,
                avatar: auth.currentUser.photoURL,
                userName: auth.currentUser.displayName,
                user: auth.currentUser.uid,
                time: Timestamp.now(),
            })
        });
        setComment('');
    }

    //Get Comments
    const getComments = async () => {
        const docRef = doc(db,'posts',routePost.id);
        const unsubscribe = onSnapshot(docRef, (snapshot)=>{
            snapshot.data() && setAllComments(snapshot.data().comments);
        });
        return unsubscribe;
    }

    useEffect(()=>{
        // if(!route.isReady) return;
        getComments();
    },[route.query]);

    

    const resizeTextarea = e => {
        e.target.style.height = "1rem";
        e.target.style.height = (e.target.scrollHeight)+"px"
    }

    console.log(allComments)

    return(
        <motion.ul initial={{ y: 10, opacity: 0 }} animate={{ y:0, opacity: 1 }}>
            <Link href={'/'}>
                <Message {...routePost} ></Message>
            </Link>
            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y:0, opacity: 1 }} transition={{ delay: 0.1 }} className="w-full mt-2 shadow-sm">
                <div>
                    {allComments?.length 
                        ? <h3 className="font-bold text-xl text-center text-white">Comments</h3> 
                        : <p className="font-bold text-center text-white">No comments, yet! Leave first one!</p> 
                    }
                    <ul className="rounded">
                        {allComments?.map(comment => 
                            <li className="flex p-3 bg-wrapperColor border-b border-backgroundColor first:rounded-t" key={comment.time}> 
                                <img className="rounded-full h-10" src={comment.avatar} alt="avatar" />
                                <div className="flex flex-col max-w-full break-words items-left opacity-70 ml-2">
                                    <Link href={{ pathname: "/", query: comment.user }}>
                                        <p className="italic text-[14px] hover:underline">{comment.userName}:</p>
                                    </Link>
                                    <p className="text-md font-comment">– {comment.comment} </p>
                                </div>
                            </li>)
                        }
                    </ul>
                </div>

                <div>
                    <label htmlFor="chat" className="sr-only">Your message</label>
                    <div className="flex items-end px-3 py-2 rounded-b bg-wrapperColor">
                        <button type="button" className=" h-max text-backgroundColor rounded-full cursor-pointer hover:text-headerColor hover:bg-gray-100">
                            <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd"></path></svg>
                            <span className="sr-only">Add emoji</span>
                        </button>
                        <textarea 
                            id="chat" 
                            rows="1" 
                            maxLength={255}
                            value={comment}
                            onInput={(e)=>resizeTextarea(e)}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder={'Have something to say?🤔'}
                            className="block mx-4 p-2.5 w-full text-sm text-textColor bg-slate-50 rounded border-none shadow-sm resize-none placeholder:opacity-30" 
                        />
                        <button onClick={submitComment} className="flex h-max justify-center text-buttonColor-main rounded-full cursor-pointer hover:text-headerColor hover:bg-white">
                            <svg aria-hidden="true" className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                            <span className="sr-only">Send message</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.ul>        
    )
}