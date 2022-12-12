
import { useState } from "react";
import Dashboard from "./dashboard";

export default function User({ user }) {
    const [dashboardOpened, setDashboardOpened] = useState(false);
    const userName = user.displayName;

    //GET NAME
    const firstTwoLetters = (name) => {
        return name.substr(0, 2);
    }
    const firstLetersFullname = (name) => {
        return name.split(' ')[0][0] + name.split(' ')[1][0];
    }

    const displayName = userName.split(' ').length < 2 
        ? (firstTwoLetters(userName)).toUpperCase()
        : (firstLetersFullname(userName)).toUpperCase();

    return (
        <div>
            <div className="flex items-center gap-5 cursor-pointer" onClick={()=>setDashboardOpened(!dashboardOpened)}>
                <div className={`relative z-30 bg-slate-100 ${dashboardOpened ? 'rounded-t' : 'rounded'} flex items-center px-2 py-2 transition-shadow shadow-sm hover:shadow-md group h-button`}>
                    <img className="rounded-full h-full pointer-events-none" src={user.photoURL} />
                    <p className="min-w-[60px] w-full text-center leading-3 font-bold pointer-events-none text-lg text-textColor-light hidden sm:block">{displayName}</p>
                    <Dashboard isOpened={dashboardOpened} />
                </div>
            </div>
            {dashboardOpened && (
                    <div 
                        className="backdrop-blur-sm absolute top-0 left-0 bg-black bg-opacity-30 transition-all w-screen h-screen z-20" 
                        onClick={() => setDashboardOpened(false)}>
                    </div>
                )
            }            
        </div>
    )  
}