import { useRouter } from "next/router"
import { auth, db } from "../utils/firebase"
import { toast } from "react-toastify"
import { useAuthState } from "react-firebase-hooks/auth"
import { useState, useEffect } from "react"
import { updateProfile } from "firebase/auth"
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { toastOptions } from "../utils/variables"
import Loading from "../components/spinner"
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from 'react-redux'
import { changePageName } from "../redux/actions"

export default function Profile() {
    const dispatch = useDispatch();

    const [user, loading] = useAuthState(auth);
    const route = useRouter();

    const checkUser = async () => {
        if(!user) return route.push('/auth/login');
    } 

    useEffect(() => {
        dispatch(changePageName('PROFILE'))
        checkUser();
    },[user,loading]);

    const [newUserName, setNewUserName] = useState(user?.displayName || '');
    const [usersPosts, setUsersPosts] = useState([]);
    const [saving, setSaving] = useState(false);

    const getPosts = async () => {
        const collectionRef = collection(db, "posts");
        const q = query(collectionRef, where("user", "==", user?.uid || ''));
        const querySnapshot = await getDocs(q);
        setUsersPosts(querySnapshot.docs.map((doc) => doc.id));
    }

    const updatePosts = async (IDs) => {
        IDs.forEach(async id => {
            const docRef = doc(db, 'posts', id);
            const docSnap = await getDoc(docRef);
            const post = docSnap.data();
            const updatedPost = { ...post, userName: newUserName};
            await updateDoc(docRef, updatedPost);
        });
    }

    useEffect(()=>{
        getPosts();
      },[route.isReady]);

    const submitNewUserName = async () => {
        if(!newUserName.length) return toast.warning("Name shouldn't be empty!",{...toastOptions, position: toast.POSITION.TOP_CENTER});
        if(newUserName.length < 4) return toast.warning('Name should be longer that 4 symbols',{...toastOptions, position: toast.POSITION.TOP_CENTER});
        setSaving(true);
        await updateProfile(auth.currentUser, {displayName: newUserName});
        await updatePosts(usersPosts);
        route.push('/profile');
        toast.success('Profile updated!', toastOptions);
        setSaving(false);
    }

    const variants = {
        hidden: { y: 0, opacity: 1 },
        showen: { y:20, opacity: 0 }
    }
    
    return(
        <AnimatePresence>
            <motion.div 
                variants={variants}
                initial='showen'
                animate='hidden'
                transition={{staggerChildren:0.1}}
                className="shadow-md bg-container-light dark:bg-container-dark rounded p-5 flex flex-col items-center">
                    <motion.h2 key={'key1'} variants={variants} className="mb-5">Change your name:</motion.h2>
                    <motion.input key={'key12'} variants={variants} 
                                    maxLength={20} className=" bg-slate-100 shadow-md text-textColor-light rounded mb-5 p-2 placeholder:opacity-20 border-1 border-transparent focus:ring-0 focus:border-header-light text-center" 
                                    type="text" 
                                    value={newUserName} onChange={(e) => setNewUserName(e.target.value)} />
                    <motion.button key={'key13'} variants={variants} 
                                    className="shadow-md bg-button-light h-button px-5 rounded text-textColot-light font-bold transition-colors hover:brightness-105 dark:bg-button-dark disabled:opacity-50 disabled:cursor-not-allowed" 
                                    onClick={submitNewUserName}
                                    disabled={saving}>
                        {saving ? <p className="flex items-center">Saving...<Loading /></p> : 'Save'}
                    </motion.button>
            </motion.div>
        </AnimatePresence>
    )
}