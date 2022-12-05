import { useRouter } from "next/router"
import Message from "../components/message"
import { useState, useEffect } from "react"
import { auth, db } from "../utils/firebase"
import { toast } from "react-toastify"
import { toastOptions } from "./post"
import { arrayUnion, doc, getDoc, onSnapshot, Timestamp, updateDoc } from "firebase/firestore"
import { async } from "@firebase/util"

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
            comments: arrayUnion({
                comment,
                avatar: auth.currentUser.photoURL,
                userName: auth.currentUser.displayName,
                time: Timestamp.now(),
            })
        });
        setComment('');
    }

    //Get Comments
    const getComments = async () => {
        const docRef = doc(db,'posts',routePost.id);
        const unsubscribe = onSnapshot(docRef, (snapshot)=>{
            setAllComments(snapshot.data().comments);
        });
        return unsubscribe;
    }

    useEffect(()=>{
        if(!route.isReady) return;
        getComments();
    },[route.isReady]);

    return(
        <ul>
            <Message {...routePost} ></Message>
            <div className="w-full mt-2 shadow-sm ">
                <div>
                    <h3 className="font-bold text-xl text-center ">Comments</h3>
                    <ul className="rounded">
                        {allComments?.map(comment => 
                            <li className="flex flex-col border py-2 px-4" key={comment.time}> 
                                <div className="flex items-center h-button">
                                    <img className="rounded-full h-1/2" src={comment.avatar} alt="avatar" />
                                    <p className="h-1/2 ml-2">{comment.userName}:</p>
                                </div>
                                <p className="italic ml-10"> – {comment.comment} </p>
                            </li>)
                        }
                        {!allComments?.length && <p className="font-bold text-center">No comments, yet! Leave first one!</p>}
                    </ul>
                </div>
                <div className="flex w-full justify-between border border-t-0 rounded-b">
                    <input className="w-full p-2 rounded-b" type="text" value={comment} placeholder="Have something to say?🤔" onChange={(e)=>setComment(e.target.value)} />
                    <button onClick={submitComment} className="p-2 rounded-b rounded-l-none bg-slate-100">Send</button>
                </div>
            </div>
        </ul>
    )
}