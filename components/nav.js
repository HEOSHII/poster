import Link from "next/link";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import User from "./user";

export default function Nav() {
    const [user, loading] = useAuthState(auth);
    return ( <header className="w-screen bg-gradient-to-r from-slate-200 to-zinc-400 py-3 shadow-sm">
                <nav className={`flex ${user ? 'justify-between' : 'justify-center'} items-center container`}>
                    <Link href="/">
                        <button className="bg-white px-2 rounded shadow-sm text-xl font-bold h-button">POSTERS</button>
                    </Link>
                    {user && (<User user={user} />)}
                </nav>
            </header> );
}