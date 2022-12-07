import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore"
import { auth, db } from "../utils/firebase"
import { useRouter } from "next/router"
import { toast } from "react-toastify"
import { motion, AnimatePresence } from "framer-motion";
import { toastOptions } from "../utils/variables"


export default function Post() {
    //Form state
    const emptyPost = {title:'', description: '', comments: []}
    const [post, setPost] = useState(emptyPost)
    const [submittedOnce, setSubmittedOnce] = useState(false);
    //AUTH
    const [user, loading] = useAuthState(auth);
    //ROUTER
    const route = useRouter();
    const rotedPost = route.query;
    //Cheack user
    const getData = async () => {
        if(loading) return;
        if(!user) route.push('/auth/login');
        if(rotedPost.id) {
            setPost({
                title: rotedPost.title, 
                description: rotedPost.description,
                id: rotedPost.id
            });
        } else {
            setPost(emptyPost);
        }
    }
    useEffect(() => {
        getData();
    }, [route.query]);

    //FORM SUBMIT
    const submitForm = async (e) => {
        e.preventDefault();
        setSubmittedOnce(true);

        //Validators
        if(!post.title || !post.description) return toast.error('Some fields are empty!', toastOptions); 
        if(post.description.length > 300) return toast.error('Description field is too long!', toastOptions)
        
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
            <motion.form initial={{ y:30, opacity: 0 }} animate={{ y:0, opacity: 1 }} className="shadow-md p-5 bg-wrapperColor rounded" onSubmit={submitForm}>
                <div className="relative mx-auto overflow-hidden mb-2">
                    <p className="font-bold text-center text-xl uppercase opacity-0">{!post.hasOwnProperty('id') ? 'Create Post:' : 'Update Post'}</p>
                    <AnimatePresence>
                        {post.hasOwnProperty('id') 
                        ?
                            <motion.h1 key={'update'} initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: -50 }} className="absolute h-wull w-full left-0 top-0 text-center font-bold text-xl uppercase">
                                Update Post:
                            </motion.h1> 
                            :
                            <motion.h1 key={'create'} initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: -50 }} className="absolute h-wull w-full left-0 top-0 text-center font-bold text-xl uppercase">
                                Create Post:
                            </motion.h1> 
                        }
                    </AnimatePresence>
                </div>
                <div className="flex flex-col">
                    <input 
                        className={`bg-white shadow-md rounded mb-2 p-2 placeholder:opacity-20 outline-solid focus:outline-1 ${submittedOnce && !post.title ? 'border border-red-500 outline-red-500' : 'outline-headerColor'}`} 
                        type="text" 
                        maxLength={80}
                        placeholder="Title"
                        value={post.title}
                        onChange={e => setPost({...post, title: e.target.value})}
                        >
                    </input>
                    <textarea 
                        className={`bg-white shadow-md rounded mb-2 p-2 placeholder:opacity-20 outline-solid focus:outline-1 resize-none ${submittedOnce && !post.description || post.description.length > 300 ? 'border border-red-500 outline-red-500' : 'outline-headerColor'}`}
                        placeholder="Description"
                        value={post.description}
                        rows='10'
                        onChange={event => setPost({...post, description: event.target.value})}>
                    </textarea>
                    <div className="mb-2 h-3 text-wrapperColor">
                        { post.description.length ? (<p className={`text-[10px] ${ post.description.length > 300 ? 'text-red-600' : '' }`}> {post.description.length}/300</p>) : '' }
                    </div>
                    <button 
                        className="bg-buttonColor-main shadow-md hover:bg-buttonColor-hover text-white font-bold rounded mx-auto w-full h-button transition-all uppercase disabled:opacity-20 disabled:cursor-not-allowed" 
                        type="submit" 
                        disabled={submittedOnce && (!post.title || !post.description || post.description.length > 300)}>

                            <div className="relative mx-auto overflow-hidden">
                                <p className="font-bold text-center uppercase opacity-0">{!post.hasOwnProperty('id') ? 'Create Post:' : 'Update Post'}</p>
                                <AnimatePresence>
                                    {post.hasOwnProperty('id') 
                                    ?
                                        <motion.h1 key={'update'} initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: -50 }} className="absolute h-wull w-full left-0 top-0 text-center font-bold uppercase">
                                            Update
                                        </motion.h1> 
                                        :
                                        <motion.h1 key={'create'} initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: -50 }} className="absolute h-wull w-full left-0 top-0 text-center font-bold uppercase">
                                            Post IT
                                        </motion.h1> 
                                    }
                                </AnimatePresence>
                            </div>
                    </button>
                </div>
            </motion.form>            
    )
} 