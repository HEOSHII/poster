import Link from "next/link";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import User from "./user";

export default function Nav() {
    const [user, loading] = useAuthState(auth);
    return ( <header className="w-screen bg-headerColor py-3 shadow-sm">
                <nav className={`flex ${user ? 'justify-between' : 'justify-center'} items-center container`}>
                    <Link href="/">
                        <button className="bg-buttonColor-main px-5 rounded shadow-sm text-xl font-bold h-button text-white hover:bg-buttonColor-hover">POSTS</button>
                    </Link>
                    {user && (<User user={user} />)}
                </nav>
            </header> );
}