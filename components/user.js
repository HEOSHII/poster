
import { useState } from "react";
import Dashboard from "./dashboard";
import { motion, AnimatePresence } from "framer-motion";

export default function User({ user }) {
    const [dashboardOpened, setDashboardOpened] = useState(false);
    const userName = user.displayName.split(' ')[0];

    return (
        <div>
            <div className="flex items-center gap-5 cursor-pointer" onClick={()=>setDashboardOpened(!dashboardOpened)}>
                <div className={`relative z-20 bg-white ${dashboardOpened ? 'rounded-t' : 'rounded'} flex items-center space-x-2 px-2 py-2 transition-shadow shadow-sm hover:shadow-md group h-button`}>
                    <img className="rounded-full h-full pointer-events-none" src={user.photoURL} />
                    <p className="w-[min-content] leading-3 font-bold pointer-events-none text-lg">{userName}</p>
                    <Dashboard isOpened={dashboardOpened} />
                </div>
            </div>
            {/* <AnimatePresence> */}
                {dashboardOpened && (
                        <div 
                            className="backdrop-blur-sm absolute top-0 left-0 bg-backgropColor transition-all w-screen h-screen z-10" 
                            onClick={() => setDashboardOpened(false)}>
                        </div>
                    )
                }
            {/* </AnimatePresence> */}

            
        </div>
    )  
}