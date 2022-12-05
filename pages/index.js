import { useEffect, useState } from "react";
import Message from "../components/message";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { db, auth } from '../utils/firebase'
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth"
import Link from "next/link";


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
    <div className="py-5">
      <ul className="flex flex-col space-y-3">
        {
          allPosts.length 
          ? allPosts.map((post) => (
          <Message {...post} key={post.id}>
            <Link href={{ pathname:`/${post.id}`, query: {...post} }}>
              
              <button className="w-full text-right transition-all text-slate-400 hover:text-slate-500 hover:underline">{post.comments ? post.comments.length : '0'} comments</button>
              
            </Link>
          </Message>
          )) 
          : <p className="p-3 shadow-sm text-center">
              { loading ? 'Loading...' : 'There are no posts yet, sorry 😭'}
            </p>
        }
      </ul>
    </div>
  )
}
