import { FcGoogle } from "react-icons/fc"
import { signInWithPopup, GoogleAuthProvider, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"
import { auth } from "../../utils/firebase"
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth"
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";



export default function login() {

    const route = useRouter();
    const [registration, setRegistration] = useState(false);
    const [user, loading] = useAuthState(auth);

    useEffect(()=>{
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

    return (
        <div className="relative border w-2/3 mx-auto bg-wrapperColor border-gray-100 text-center rounded px-4 pt-20 pb-5 mt-10">
            <div className="flex w-full absolute top-0 left-0">
                <button className={`${registration && 'bg-white'} w-full transition-all p-2`} onClick={() => setRegistration(false)}>Login</button>
                <button className={`${!registration && 'bg-white'} w-full transition-all p-2`} onClick={() => setRegistration(true)}>Registration</button>
            </div>
                <form className="mb-10 flex flex-col text-left">
                    <AnimatePresence>
                        {registration && (
                                <motion.label initial={{height: 0}} animate={{height: 'auto'}} exit={{height: 0}} htmlFor="name" className="overflow-hidden">
                                    Name
                                    <input className="form-input w-full p-2 rounded" id="name" name="name" type="text" placeholder="Name" required />   
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
                    <button initial={{y:0}} animate={{y:5}} exit={{y:0}} className="w-1/3 py-2 rounded bg-buttonColor-main hover:bg-buttonColor-hover text-white mt-3">{registration ? 'Sign in' : 'Log in'}</button>
           
                </form>
            
            <h3 className="font-bold mb-2">Sign in with:</h3>
            <div className="flex flex-col justify-center bg-white rounded">
                <button onClick={GoogleLogin} className="w-full flex justify-center items-center shadow-md py-3 rounded text-xl transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]">
                    <FcGoogle size={30}/>oogle
                </button>
            </div>
        </div>
    )
}