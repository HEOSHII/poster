import { useEffect, useState } from "react";
import Message from "../components/message";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore"
import { db, auth } from '../utils/firebase'
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth"
import { motion, AnimatePresence } from "framer-motion";
import Controlls from "../components/controlls";
import Comments from "../components/comments";

export default function Home() {
  //State with all posts
  const [allPosts, setAllPosts] = useState([]);
  const [user, loading] = useAuthState(auth);
  const route = useRouter();
  const { userID } = route.query;

  const checkUser = async () => {
    if(!user) return route.push('/auth/login');
  }

  useEffect(()=>{
      checkUser();
    },[user, loading]
  );

  const getPosts = async () => {
    const collectionRef = collection(db, 'posts');
    const q = 
    !userID
      ? query(collectionRef, orderBy('timestamp','desc')) 
      : query(collectionRef, where('user','==', userID), orderBy('timestamp','desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllPosts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  }

  useEffect(()=>{
    if(!route.isReady) return;
    getPosts();
  },[route.query]);

  return (
      <ul className="flex flex-col space-y-3">
        {!allPosts.length && (
          <p className="bg-wrapperColor rounded p-3 shadow-sm text-center text-textColor">
            { loading ? 'Loading...' : 'There are no posts yet, sorry 😭'}
          </p>
        )}
        <AnimatePresence>
          {!!allPosts.length && (
            allPosts.map((post, index) => (
              <motion.li  
                initial={ {y: 10, opacity: 0} }
                animate={ {y: 0, opacity: 1} }
                transition={{ 
                  delay: index * 0.1 
                }} 
                key={post.id}>
                  <Message {...post}  >
                      <Comments {...post} />
                      {post?.user === auth.currentUser.uid && <Controlls {...post} />}
                  </Message>
              </motion.li>
            )) 
          )}
        </AnimatePresence>
      </ul>
  )
}