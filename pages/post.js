import { useEffect, useState, useRef } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore"
import { auth, db } from "../utils/firebase"
import { useRouter } from "next/router"
import { toast } from "react-toastify"
import { motion, AnimatePresence } from "framer-motion";
import { toastOptions } from "../utils/variables"
import { changePageName } from "../redux/actions"
import { useDispatch } from "react-redux"
import { storage } from "../utils/firebase"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import Loading from "../components/spinner"


export default function Post() {
    const dispatch = useDispatch();
    //Form state
    const initialPost = {
        title:'', 
        description: '',
        comments: []
    }

    const [post, setPost] = useState(initialPost);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [disabledButton, setdisabledButton] = useState(false)
    const [submittedOnce, setSubmittedOnce] = useState(false);

    //AUTH
    const [user, loading] = useAuthState(auth);
    //ROUTER
    const route = useRouter();
    const routedPost = route.query;

    //Check user
    const getPost = async () => {
        if(loading) return;
        if(!user) route.push('/auth/login');
        if(routedPost.id) {
            dispatch(changePageName('UPADATING POST'));
            setPost(routedPost);
        } else {
            dispatch(changePageName('CREATING POST'));
            setPost(initialPost);
        }
    }
    useEffect(() => {
        getPost();
    }, [route.query]);

    //FORM SUBMIT
    const submitForm = async (e) => {
        e.preventDefault();
        setSubmittedOnce(true);

        if(!user) route.push('/auth/login')

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
            return route.push({ pathname: '/', query: { userID: auth.currentUser.uid, userName: auth.currentUser.displayName } });
        }

        // Make a new post
        const collectionRef = collection(db, 'posts');
        if(uploadedImage !== null) {
            const imageRef = ref(storage, `images/${uploadedImage.name}`);
            await uploadBytes(imageRef, uploadedImage)
                .then(async (res) => {
                    await getDownloadURL(res.ref)
                    .then((url) => {
                        post.imageUrl = url;
                        post.imageName = uploadedImage.name;
                    })
                    .catch(error => console.error(error))
                })
                .catch(error => console.error(error))
        }

        
        await addDoc(collectionRef, {
            ...post,
            user: user.uid,
            avatar: user.photoURL,
            userName: user.displayName,
            timestamp: Date.now()
        });

        // Change number of all posts
        const countsRef = doc(db, 'counts', 'posts');
        const countsSnap = await getDoc(countsRef);
        const count = countsSnap.data();
        const updatedCount = {count: count.count + 1 };
        await updateDoc(countsRef, updatedCount);

        //Succes notification
        toast.success('Post created succesfuly!', toastOptions);
        setPost(initialPost);
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
                        className={`dark:bg-background-dark dark:text-textColor-dark text-textColor-light text-lg shadow-md rounded p-2 placeholder:opacity-20 border-1 border-transparent dark:border-transparent focus:ring-0 focus:border-button-light dark:focus:border-button-dark dark:border-button-dark resize-none ${submittedOnce && (!post.description || post.description.length > 300) && '!border-delete focus:!border-delete'}`}
                        placeholder="Description"
                        value={post.description}
                        rows='9'
                        onChange={event => setPost({...post, description: event.target.value})}>
                    </textarea>
                    <div className="h-2 text-wrapperColor">
                        { post.description.length ? (<p className={`text-[8px] ${ post.description.length > 300 ? 'text-red-600' : '' }`}> {post.description.length}/300</p>) : '' }
                    </div>
                    <label className={`mt-3 mb-5 cursor-pointer bg-background-light dark:bg-background-dark text-textColor-light dark:text-textColor-dark rounded border  ${uploadedImage || post.imageName  ? 'border-green-500 border-double' : 'border-button-light dark:border-button-dark border-dashed'} py-5 px-2`} htmlFor="image">
                        <input 
                            type="file" 
                            id='image' 
                            className="hidden" 
                            accept={"image/png,.jpeg,.jpg,.webp"} 
                            multiple={false} 
                            onChange={(e)=>setUploadedImage(e.target.files[0])} 
                            disabled={!!routedPost.id}/>
                        { uploadedImage?.name || (post.imageName || 'Upload image') }
                    </label>
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