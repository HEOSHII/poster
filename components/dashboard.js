import { auth } from "../utils/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { useRouter } from "next/router"
import { useEffect } from "react";
import Link from "next/link";
  

export default function Dashboard({isOpened}) {
    console.log(isOpened)

    const route = useRouter();
    const [user,loading] = useAuthState(auth);

    //Are user logged
    const checkUser = async () => {
        if(loading) return;
        if(!user) return route.push('/auth/login');
    }

    //Get users data
    useEffect(() => {
        checkUser();
        },[user,loading]
    );

    const signOut = () => {
        auth.signOut();
        route.push('/auth/login');
    }

    return(
        <div className={`${!isOpened && "hidden bg-wrapperColor"} absolute bg-white left-0 top-[calc(100%-5px)] w-full shadow-md rounded-b group-hover:bg-white`} id='dashboard'>
            <Link href="/post">
                <button className="w-full hover:bg-wrapperColor py-3 px-3 text-right text-lg">Add post</button>
            </Link>
            <Link href='/myPosts'>
                <h1 className="w-full hover:bg-wrapperColor py-3 px-3 text-right text-lg">My posts</h1>
            </Link>
            <button className="w-full hover:bg-wrapperColor py-3 px-3 text-right text-lg rounded-b " onClick={signOut}>Sign out</button>
        </div>
    )
}