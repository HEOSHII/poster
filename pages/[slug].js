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
                    <h3 className="font-bold text-xl text-center">Comments</h3>
                    <ul className="rounded">
                        {allComments?.map(comment => 
                            <li className="flex flex-col border-b border-backgroundColor py-2 px-2 bg-wrapperColor first:rounded-t" key={comment.time}> 
                                <div className="flex items-center opacity-70 text-sm">
                                    <img className="rounded-full h-[25px]" src={comment.avatar} alt="avatar" />
                                    <p className="ml-2">{comment.userName}:</p>
                                </div>
                                <p className="italic ml-10 text-lg font-bold"> {comment.comment} </p>
                            </li>)
                        }
                        {!allComments?.length && <p className="font-bold text-center text-white">No comments, yet! Leave first one!</p>}
                    </ul>
                </div>
                <div className="flex w-full justify-between shadow-md rounded-b">
                    <input className="bg-headerColor text-white w-full p-2 rounded-b rounded-r-none placeholder:opacity-60" max={80} type="text" value={comment} placeholder="Have something to say?🤔" onChange={(e)=>setComment(e.target.value)} />
                    <button onClick={submitComment} className="font-bold px-5 rounded-b rounded-l-none transition-all bg-buttonColor-main text-white hover:bg-buttonColor-hover">Comment</button>
                </div>
            </div>
        </ul>
    )
}