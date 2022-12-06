import { useEffect, useState } from "react";
import Message from "../components/message";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { db, auth } from '../utils/firebase'
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth"
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";


export const variants = {
  ul: {
    hidden: false,
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  },
  li: {
    hidden: { y: 10, opacity: 0 },
    show: { y: 0, opacity: 1 }
  }
}

export default function Home() {
  //State with all posts
  const [allPosts, setAllPosts] = useState([]);
  const [user, loading] = useAuthState(auth);
  const route = useRouter();

  const checkUser = async () => {
    if(!user) return route.push('/auth/login');
  }
  
  useEffect(()=>{
      checkUser();
    },[user, loading]
  );

  const getPosts = async () => {
    const collectionRef = collection(db, 'posts');
    const q = query(collectionRef, orderBy('timestamp','desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllPosts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  }

  useEffect(()=>{
    getPosts();
  },[]);



  return (
    <AnimatePresence>
      <motion.ul 
        variants={variants.ul}
        initial="hidden"
        animate="show"
        className="flex flex-col space-y-3">
        {
          allPosts.length 
          ? allPosts.map((post, index) => (
            <motion.li variants={variants.li} transition={{ delay: index * 0.1 }}>
              <Link href={{ pathname:`/${post.id}`, query: {...post} }} key={post.id}>
                <Message {...post}  >
                    <button className="transition-all opacity-50 group-hover:underline group-hover:opacity-100">{post.comments ? post.comments.length : '0'} comments</button>
                </Message>
              </Link>
            </motion.li>
          )) 
          : <p className="p-3 shadow-sm text-center">
              { loading ? 'Loading...' : 'There are no posts yet, sorry 😭'}
            </p>
        }
      </motion.ul>
    </AnimatePresence>
  )
}
