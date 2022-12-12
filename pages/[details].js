import { useRouter } from "next/router"
import Message from "../components/message"
import { useState, useEffect } from "react"
import { auth, db } from "../utils/firebase"
import { doc, onSnapshot } from "firebase/firestore"
import { motion, AnimatePresence } from "framer-motion";
import { useAuthState } from "react-firebase-hooks/auth"
import { useDispatch } from "react-redux"
import { changePageName } from "../redux/actions"
import CommentsList from "../components/commentsList"
import InputComment from "../components/inputComment"

export default function Details() {
    const dispatch = useDispatch();
    const route = useRouter();
    const routePost = route.query;
    const [allComments, setAllComments] = useState([]);
    const [user,loading] = useAuthState(auth);

    //Get Comments
    const getComments = async () => {
        if(!user) return route.push('/auth/login');
        const docRef = doc(db,'posts',routePost.id || '');
        const unsubscribe = onSnapshot(docRef, (snapshot)=>{
            snapshot.data() && setAllComments(snapshot.data().comments);
        });
        return unsubscribe;
    }

    useEffect(()=>{
        if(!routePost.hasOwnProperty('id')) route.push('/');
        if(route.isReady) {
            dispatch(changePageName('Comments'))
            getComments();
        }
    },[route.isReady]);

    

    return(
        <motion.ul initial={{ y: 10, opacity: 0 }} animate={{ y:0, opacity: 1 }}>
            <Message {...routePost} ></Message>
            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y:0, opacity: 1 }} transition={{ delay: 0.2 }} className="w-full mt-2 shadow-sm">
                {!allComments.length  
                    ? <p className="font-bold text-center text-textColor-light dark:text-textColor-dark">No comments, yet! Leave first one!</p> 
                    :   <>
                            <h3 className="font-bold text-xl text-center text-textColor-light dark:text-textColor-dark">Comments</h3> 
                            <CommentsList comments={allComments}/>
                        </>
                }
                <InputComment post={routePost} className={!allComments.length ? 'rounded-t' : ''}/>
            </motion.div>
        </motion.ul>        
    )
}