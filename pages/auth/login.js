import { FcGoogle } from "react-icons/fc"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from "../../utils/firebase"
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth"
import { useEffect } from "react";


export default function login() {

    const route = useRouter();
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
        <div className="border w-1/2 mx-auto bg-wrapperColor border-gray-100 text-center rounded p-4 mt-10">
            <div>
                <h3 className="text-xl font-bold mb-2">Sign in with:</h3>
                <div className="flex justify-center bg-white rounded">
                    <button onClick={GoogleLogin} className="w-full flex justify-center items-center shadow-md py-3 rounded text-xl transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]">
                        <FcGoogle size={30}/>oogle
                    </button>
                </div>
            </div>
        </div>
    )
}