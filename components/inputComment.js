
import { auth, db } from "../utils/firebase"
import { arrayUnion, doc, Timestamp, updateDoc } from "firebase/firestore"
import { useState } from "react"
import { toast } from "react-toastify"
import { toastOptions } from "../utils/variables"

export default function InputComment ({post, className}) {
    const [comment, setComment] = useState('');
     //Submit comment
    const submitComment = async () => {

    if(!comment) return toast.error('You need to type something!🤬', toastOptions);
    
    const docRef = doc(db, 'posts', post.id);
    await updateDoc(docRef, {
        ...post, 
        timestamp: Number(post.timestamp),
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

    return (
        <div className={`${className} flex items-end px-4 py-2.5 rounded-b bg-container-light dark:bg-container-dark`}>
            <button type="button" className="p-2.5 h-max text-textColor-light dark:text-textColor-dark rounded-full cursor-pointer hover:bg-button-light dark:hover:bg-button-dark">
                <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd"></path></svg>
                <span className="sr-only ">Add emoji</span>
            </button>
            <textarea 
                id="chat" 
                rows="1" 
                maxLength={255}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={'Do you have something to say?🤔'}
                className="block mx-4 p-2.5 w-full text-textColor-light bg-slate-50 rounded outline-none ring-0 border-transparent shadow-sm resize-none placeholder:opacity-30 focus:ring-0 focus:border-button-light dark:focus:border-button-dark" 
            />
            <button onClick={submitComment} className="p-2.5 flex h-max justify-center text-textColor-light dark:text-textColor-dark rounded-full cursor-pointer hover:bg-button-light dark:hover:bg-button-dark">
                <svg aria-hidden="true" className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
            </button>
        </div>
    )
}