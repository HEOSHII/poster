import { FcGoogle } from "react-icons/fc"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from "../../utils/firebase"
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth"
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from 'react-redux'
import { changePageName } from "../../redux/actions";
import ThemeChanger from "../../components/themeChanger";

export default function login() {
    const route = useRouter();
    const emptyForm = {name:'',email:'',password:''};
    const [form, setForm] = useState(emptyForm);
    const [isRegistration, setRegistration] = useState(false);
    const [user, loading] = useAuthState(auth);
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(changePageName(''));
        if(loading) return;
        if(user){
            route.push('/');
        } else {
            console.log('login')
        }
    },[user]);
        
    //SIGN IN WITH GOOGLE 
    const googleProvider = new GoogleAuthProvider();
    const GoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            route.push("/");
        } catch (error) {
            console.error(error)
        }
    }

    // STYLES
    const tabsStyles = {
        main: 'rounded-t font-bold border-2 border-t-2 border-textColor-light flex-1 p-2 hover:opacity-100 dark:border-textColor-dark',
        active: 'bg-container-light border-b-0 z-10 rounded-t dark:bg-container-dark',
        deactive: 'bg-backgdround-light translate-y-[3px] text-sm opacity-90',
        containerBefore: "before:absolute before:content-[''] before:h-[3px] before:w-3/4 before:bg-container-light dark:before:bg-container-dark before:z-50 before:bottom-[-2px] before:left-2 before:pointer-events-none",
    }

    return (
        <div className="relative w-3/4 mx-auto text-center shadow-lg rounded mt-10">
            <ThemeChanger />
                <div className={`flex w-full relative top-[3px] ${tabsStyles.containerBefore}`}>
                <button 
                    className={` ${tabsStyles.main} border-r-2 ${!isRegistration ? tabsStyles.active : `${tabsStyles.deactive} translate-x-[3px]`}`} 
                    onClick={() => setRegistration(false)}>
                    Login
                </button>
                <button 
                    className={` ${tabsStyles.main} border-l-2 ${isRegistration ? tabsStyles.active : `${tabsStyles.deactive} translate-x-[-3px]`}`} 
                    onClick={() => setRegistration(true)}>
                    Join now
                </button>
            </div>
            <div className="relative border-2 border-textColor-light bg-container-light py-10 px-4 rounded dark:border-textColor-dark dark:bg-container-dark">
                <form className="mb-10 flex flex-col text-left">
                    <AnimatePresence>
                        {isRegistration && (
                            <motion.label 
                                initial={{height: 0}} 
                                animate={{height: 'auto'}} 
                                exit={{height: 0}} 
                                htmlFor="name" 
                                className="overflow-hidden">
                                Name
                                <input 
                                    className="form-input w-full p-2 rounded placeholder:opacity-80" 
                                    value={form.name}
                                    onChange={(e) => setForm({...form, name: e.target.value})}
                                    id="name" 
                                    name="name" 
                                    type="text" 
                                    placeholder="Name" 
                                    required />   
                            </motion.label>
                            
                        )}
                    </AnimatePresence>
                    <label htmlFor="email">
                        Email
                        <input className="form-input w-full p-2 rounded" id="email" name="email" type="text" placeholder="Email" required /> 
                    </label>  
                    <label htmlFor="password">
                        Password
                        <input className="form-input w-full p-2 rounded" id="password" name="password" type="password" placeholder="Password" required />
                    </label >
                    <button initial={{y:0}} animate={{y:5}} exit={{y:0}} className="w-1/3 py-2 rounded bg-button-light dark:bg-button-dark transition-all hover:brightness-[105%] text-white mt-3">{isRegistration ? 'Sign in' : 'Log in'}</button>
            
                </form>
                <h3 className="font-bold mb-2">Sign in with:</h3>
                <div className="flex flex-col justify-center bg-white dark:bg-background-dark rounded">
                    <button onClick={GoogleLogin} className="w-full flex justify-center items-center shadow-md py-3 rounded text-xl transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]">
                        <FcGoogle size={30}/>oogle
                    </button>
                </div>
            </div>
        </div>
    )
}