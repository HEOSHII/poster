import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore"
import { auth, db } from "../utils/firebase"
import { useRouter } from "next/router"
import { toast } from "react-toastify"
import { motion, AnimatePresence } from "framer-motion";
import { toastOptions } from "../utils/variables"
import { changePageName } from "../redux/actions"
import { useDispatch } from "react-redux"
import Loading from "../components/spinner"


export default function Post() {
    const dispatch = useDispatch();
    //Form state
    const emptyPost = {title:'', description: '', comments: []}
    const [post, setPost] = useState(emptyPost)
    const [disabledButton, setdisabledButton] = useState(false)
    const [submittedOnce, setSubmittedOnce] = useState(false);
    //AUTH
    const [user, loading] = useAuthState(auth);
    //ROUTER
    const route = useRouter();
    const rotedPost = route.query;
    //Cheack user
    const getPost = async () => {
        if(loading) return;
        if(!user) route.push('/auth/login');
        if(rotedPost.id) {
            dispatch(changePageName('UPADATING POST'));
            setPost({
                title: rotedPost.title, 
                description: rotedPost.description,
                id: rotedPost.id
            });
        } else {
            dispatch(changePageName('CREATING POST'));
            setPost(emptyPost);
        }
    }
    useEffect(() => {
        getPost();
    }, [route.query]);

    //FORM SUBMIT
    const submitForm = async (e) => {
        e.preventDefault();
        setSubmittedOnce(true);

        //Validators
        if(post.description.length > 300) return toast.warning('Description field is too long!', toastOptions);
        if(!post.title || !post.description) return toast.warning('Some fields are empty!', toastOptions); 
        setdisabledButton(true);

        //Upadate post
        if(post?.hasOwnProperty('id')) {
            const docRef = doc(db, 'posts', post.id);
            const updatedPost = { ...post, timestamp: Date.now()};
            await updateDoc(docRef, updatedPost);
            toast.success('Post has been updated! Cool! 🤌🏻', toastOptions);
            return route.push({pathname: '/', query: auth.currentUser.uid});
        }

        // Make a new post
        const collectionRef = collection(db, 'posts');
        await addDoc(collectionRef, {
            ...post,
            user: user.uid,
            avatar: user.photoURL,
            userName: user.displayName,
            timestamp: Date.now()
        });
        toast.success('Post created succesfuly!', toastOptions);
        setPost(emptyPost);
        return route.push('/');
    }    

    return(
            <motion.form initial={{ y:30, opacity: 0 }} animate={{ y:0, opacity: 1 }} className="shadow-md p-5 bg-container-light dark:bg-container-dark rounded" onSubmit={submitForm}>
                <div className="flex flex-col">
                    <input 
                        className={`dark:bg-background-dark dark:text-textColor-dark text-lg shadow-md rounded mb-2 p-2 placeholder:opacity-20 border-1 border-transparent dark:border-transparent focus:ring-0 focus:border-button-light dark:border-button-dark dark:focus:border-button-dark ${submittedOnce && !post.title && '!border-delete focus:!border-delete'}`} 
                        type="text" 
                        maxLength={80}
                        placeholder="Title"
                        value={post.title}
                        onChange={e => setPost({...post, title: e.target.value})}
                        >
                    </input>
                    <textarea 
                        className={`dark:bg-background-dark dark:text-textColor-dark text-textColor-light text-lg shadow-md rounded mb-2 p-2 placeholder:opacity-20 border-1 border-transparent dark:border-transparent focus:ring-0 focus:border-button-light dark:focus:border-button-dark dark:border-button-dark resize-none ${submittedOnce && (!post.description || post.description.length > 300) && '!border-delete focus:!border-delete'}`}
                        placeholder="Description"
                        value={post.description}
                        rows='9'
                        onChange={event => setPost({...post, description: event.target.value})}>
                    </textarea>
                    <div className="mb-2 h-3 text-wrapperColor">
                        { post.description.length ? (<p className={`text-[10px] ${ post.description.length > 300 ? 'text-red-600' : '' }`}> {post.description.length}/300</p>) : '' }
                    </div>
                    <button 
                        className={`bg-button-light dark:bg-button-dark shadow-md hover:brightness-105 text-white font-bold rounded mx-auto w-full h-button transition-all uppercase disabled:opacity-20 disabled:cursor-not-allowed ${disabledButton && 'pointer-events-none'}`} 
                        type="submit" 
                        disabled={submittedOnce && (!post.title || !post.description || post.description.length > 300)}>
                            <div className="relative mx-auto overflow-hidden">
                                <h1 className="flex justify-center items-center text-textColor-dark dark:text-textColor-light">
                                    {disabledButton
                                        ? (<Loading />) 
                                        : (post.hasOwnProperty('id') ? "Update" : "Post it")
                                    } 
                                </h1>
                            </div>
                    </button>
                </div>
            </motion.form>            
    )
} 