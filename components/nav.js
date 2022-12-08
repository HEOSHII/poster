import Link from "next/link";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import User from "./user";

export default function Nav({ inTop }) {
    const [user, loading] = useAuthState(auth);
    if(!user) return;
    return ( 
            <div className={`w-screen bg-headerColor py-3 shadow-md transition-all fixed z-50 hover:opacity-100`}>
                <nav className={`flex justify-between items-center container`}>
                    <Link href="/">
                        <button className={`bg-buttonColor-main px-5 rounded shadow-md text-xl font-bold h-button transition-all  text-white hover:bg-buttonColor-hover`}>
                            POSTS
                        </button>
                    </Link>
                    <User user={user} />
                </nav>
            </div> 
            )
}