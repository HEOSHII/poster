import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore"
import { auth, db } from "../utils/firebase"
import { useRouter } from "next/router"
import { toast } from "react-toastify"

export const toastOptions = {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 800,
}; 

export default function Post() {
    
    //Form state
    const emptyPost = {title:'', description: ''}
    const [post, setPost] = useState(emptyPost)
    const [submittedOnce, setSubmittedOnce] = useState(false);
    //AUTH
    const [user, loading] = useAuthState(auth);
    //ROUTER
    const route = useRouter();
    const userPost = route.query;
    //Cheack user
    const getData = async () => {
        if(loading) return;
        if(!user) route.push('/auth/login');
        if(userPost.id) {
            setPost({
                title: userPost.title, 
                description: userPost.description,
                id: userPost.id
            });
        }
    }
    useEffect(() => {
        getData();
    }, [user,loading]);

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
            const updatedPost = { ...post, timestamp: serverTimestamp()};
            await updateDoc(docRef, updatedPost);
            toast.success('Post has been updated! Cool! 🤌🏻',toastOptions);
            return route.push('/myPosts');
        }

        // Make a new post
        const collectionRef = collection(db, 'posts');
        await addDoc(collectionRef, {
            ...post,
            user: user.uid,
            avatar: user.photoURL,
            userName: user.displayName,
            timestamp: serverTimestamp()
        });
        setPost(emptyPost);
        toast.success('The post was born! Nice! 👶🏻', toastOptions);
        return route.push('/');
    }    

    return(
        <div>
            <form className="shadow-md p-5 bg-headerColor rounded" onSubmit={submitForm}>
                <h1 className="text-center font-bold text-xl mb-5 uppercase text-wrapperColor">
                    {post.hasOwnProperty('id') ? 'Update' : 'Create'} Post:
                </h1>
                <div className="flex flex-col">
                    <input 
                        className={`bg-backgroundColor shadow-md rounded mb-2 p-2 text-wrapperColor placeholder:text-slate-200 placeholder:opacity-20 outline-solid outline-neutral-500 focus:outline-1 ${submittedOnce && !post.title ? 'border border-red-500' : null}`} 
                        type="text" 
                        maxLength={80}
                        placeholder="Title"
                        value={post.title}
                        onChange={e => setPost({...post, title: e.target.value})}
                        >
                    </input>
                    <textarea 
                        className={`bg-backgroundColor shadow-md rounded mb-2 p-2 text-wrapperColor placeholder:text-slate-100 placeholder:opacity-20 outline-solid outline-neutral-500 focus:outline-1 resize-none ${submittedOnce && !post.description || post.description.length > 300 ? 'border border-red-500' : null}`}
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
                            {post.hasOwnProperty('id') ? 'Update Post' : 'Post It!'}
                    </button>
                </div>
            </form>
        </div>
    )
} 