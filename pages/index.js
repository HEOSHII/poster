import { useEffect, useState } from "react"
import Message from "../components/message"
import { collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, startAfter, where } from "firebase/firestore"
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
  const [postsLoading,  setPostsLoading] = useState(true);
  const route = useRouter();
  const { userID, userName } = route.query;
  const [lastDoc, setLastDoc] = useState(0);
  const [docsCount, setDocsCount] = useState(0);
  const postsViewLimit = 4;


  const getPosts = async (last) => {
    if(loading) return;
    if(!user) {
      route.push('/auth/login');
      return;
    }
    setPostsLoading(true);

    //Coolection of posts
    const postsCollection = collection(db, 'posts');

    //Selected user posts
      if(userID) {
        dispatch(changePageName(userName));
        const q = query(postsCollection, where('user','==', userID), orderBy('timestamp','desc'));
        const snaps = await getDocs(q);
        const docsToRender = snaps.docs.map( doc => ({ ...doc.data(), id: doc.id }) );
        setAllPosts(docsToRender);
        setPostsLoading(false)
        return;
      }

    //All users posts
    dispatch(changePageName("All posts"));

    //Get count of all posts
    const docsCountRef = doc(db, 'counts', 'posts'); 
    const docsCount = await getDoc(docsCountRef);
    setDocsCount(docsCount.data().count);

    const q = query(postsCollection, orderBy('timestamp','desc'), startAfter(last || '') , limit(postsViewLimit));
    const snaps = await getDocs(q);
    const docsToRender = snaps.docs.map( doc => ({ ...doc.data(), id: doc.id }) );

    setLastDoc(snaps.docs[snaps.docs.length - 1]); // Marker where the next render starts

    if(!last) {
      setAllPosts(docsToRender);
      setPostsLoading(false);
      return;
    }

    setAllPosts(() => 
       [ 
        ...allPosts, 
        ...docsToRender
    ]);
    setPostsLoading(false);
  }

  useEffect(()=>{
    if(route.isReady && !loading) {
      getPosts();
    } 
  }, [route.query, user, loading]);

  useEffect(() => {
    window.addEventListener('scroll', function scrollingListener() {
      if(userID) {
        this.removeEventListener('scroll', scrollingListener);
        return;
      }
      if(allPosts.length === docsCount) {
        this.removeEventListener('scroll', scrollingListener);
        return;
      }
      if (window.innerHeight + window.scrollY === document.body.clientHeight) {
        getPosts(lastDoc);    
        this.removeEventListener('scroll', scrollingListener);
      }
    });
  },[lastDoc]);


  if(loading || postsLoading && !lastDoc) return <Spinner />

  if(!allPosts.length) return (
      <p className="flex justify-center bg-container-light dark:bg-container-dark text-textColor-light rounded p-3 shadow-sm text-center dark:text-textColor-dark">
        Sorry, but there are no posts, yet!
      </p>
  )

  return (
      <div>
        <ul className="flex flex-col space-y-3 relative z-0 mb-4">
          <AnimatePresence>
            { allPosts.map((post) => (
              <li key={post.id}>
                <Message {...post}>
                    <CommentsInfo {...post}  />
                    { 
                      post.user === auth.currentUser?.uid && 
                      <Controlls {...post} />
                    }
                </Message>
              </li>
            )) 
            }
          </AnimatePresence>
        </ul>
        {!userID && postsLoading && <Spinner />}
        {!userID && allPosts.length === docsCount && <p className="mt-5 font-bold text-center text-lg">That's all, folks!</p>}
      </div>
  )
}