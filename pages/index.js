import { useEffect, useState } from "react"
import Message from "../components/message"
import { collection, limit, onSnapshot, orderBy, query, startAt, where } from "firebase/firestore"
import { db, auth } from '../utils/firebase'
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth"
import { motion, AnimatePresence } from "framer-motion"
import Controlls from "../components/controlls"
import CommentsInfo from "../components/commentsInfo"
import Spinner from "../components/spinner"
import { useDispatch } from "react-redux"
import { changePageName } from "../redux/actions"

export default function Home() {
  const dispatch = useDispatch();

  //State with all posts
  const [allPosts, setAllPosts] = useState([]);
  const [user, loading] = useAuthState(auth);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsLimit, setLimit] = useState(4);
  const route = useRouter();
  const { userID, userName } = route.query;

  const getPosts = async () => {
    // CHECK USER
    if(!user) return route.push('/auth/login');

    // SET PAGE NAME
    if(!userID) {
      dispatch(changePageName('ALL POSTS'));
    } else {
      dispatch(changePageName(userID === auth.currentUser.uid ? auth.currentUser.displayName : userName));
    }

    //RENDER AND SUBSCRIBE TO POSTS
    const collectionRef = collection(db, 'posts');
    const q = 
    !userID
      ? query(collectionRef, orderBy('timestamp','desc'), limit(postsLimit)) 
      : query(collectionRef, where('user','==', userID), orderBy('timestamp','desc'), limit(postsLimit));
      const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllPosts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
    setPostsLoading(false);
    return unsubscribe;
  }

  useEffect(()=>{
    if(!route.isReady) return;
    getPosts();
  },[route.query, postsLimit]);

  useEffect(()=>{
    window.addEventListener('scroll', () => {
      if (window.pageYOffset + window.innerHeight === document.body.clientHeight && !postsLoading) {
        setPostsLoading(true);
        setLimit(prev => prev + 1);
      }
    });
  },[]);

  return (
        <>
          <ul className="flex flex-col space-y-3">
            <AnimatePresence>
              {allPosts.length ? (
                allPosts.map((post, index) => (
                  <motion.li  
                    initial={ {y: 10, opacity: 0} }
                    animate={ {y: 0, opacity: 1} }
                    transition={{ 
                      delay: index * 0.1 
                    }} 
                    key={post.id}
                    className="relative rounded border border-opacity-20 dark:border-opacity-20 border-textColor-light dark:border-textColor-dark">
                      <Message {...post}  >
                          <CommentsInfo {...post} />
                          {post?.user === auth.currentUser.uid && <Controlls {...post} />}
                      </Message>
                  </motion.li>
                )) 
              ) : (
                <p className="flex justify-center bg-container-light dark:bg-container-dark rounded p-3 shadow-sm text-center text-textColor-light">
                  { loading ? <Spinner /> : 'There are no posts yet, sorry 😭'}
                </p>
              )
            }
            </AnimatePresence>
          </ul>
           {postsLoading &&  <Spinner size={40}/> }
        </>
  )
}