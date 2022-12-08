import { useRouter } from "next/router"
import { auth, db } from "../utils/firebase"
import { toast } from "react-toastify"
import { useAuthState } from "react-firebase-hooks/auth"
import { useState, useEffect } from "react"
import { updateProfile } from "firebase/auth"
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { toastOptions } from "../utils/variables"
import { CgSpinnerTwoAlt } from 'react-icons/cg'

import { motion, AnimatePresence } from "framer-motion";

export default function Profile() {
    const [user, loading] = useAuthState(auth);
    const route = useRouter();

    const checkUser = async () => {
        if(!user) return route.push('/auth/login');
    } 

    useEffect(() => {
        checkUser();
    },[user,loading]);

    const [newUserName, setNewUserName] = useState(user?.displayName || '');
    const [usersPosts, setUsersPosts] = useState([]);
    const [saving, setSaving] = useState(false);

    const getPosts = async () => {
        const collectionRef = collection(db, "posts");
        const q = query(collectionRef, where("user", "==", user?.uid || ''));
        const querySnapshot = await getDocs(q);
        const posts = []
        querySnapshot.forEach((doc) => {
            posts.push(doc.id)
        });
        setUsersPosts(posts);
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
        setSaving(true);
        await updateProfile(auth.currentUser, {displayName: newUserName});
        await updatePosts(usersPosts);
        route.push('/profile');
        toast.success('Profile updated!', toastOptions);
        setTimeout(()=>{
            setSaving(false);
        },1000);
    }
    
    return(
        <AnimatePresence>
            <motion.div 
                initial={{ y:10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="shadow-md bg-wrapperColor rounded p-5 flex flex-col items-center">
                    <motion.h2 
                    initial={{ y:20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    // transition={{ delay: 0.1 }}
                    className="mb-5">Change your name:</motion.h2>
                    <motion.input 
                    initial={{ y:30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className=" shadow-md mb-4 rounded text-center " type="text" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} />
                    <motion.button 
                    initial={{ y:40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="shadow-md bg-buttonColor-main h-button px-5 rounded text-white font-bold transition-colors hover:bg-buttonColor-hover disabled:opacity-50 disabled:cursor-not-allowed" 
                    onClick={submitNewUserName}
                    disabled={saving}>
                        {saving ? <p className="flex items-center">Saving...<CgSpinnerTwoAlt className=" animate-spin" size={20} /></p> : 'Save'}
                    </motion.button>
            
            </motion.div>
        </AnimatePresence>
    )
}