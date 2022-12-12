import { useTheme } from 'next-themes'
import { MdLightMode, MdDarkMode } from 'react-icons/md'
import { motion, AnimatePresence } from "framer-motion"


export default function ThemeChanger () {
    const {theme, setTheme} = useTheme();

    const positions = {
        right: {x:23},
        left: {x:0},
    }

    return (
        <AnimatePresence>
            <label htmlFor="changer" className={`p-[2px] border border-button-light dark:border-button-dark  relative flex items-center w-12 h-6 bg-background-light dark:bg-background-dark transition-all mx-auto my-3 cursor-pointer rounded-full shadow-md opacity-80 hover:opacity-100`}>
                <input className='hidden' type="checkbox" id='changer' onChange={()=>setTheme(theme === 'dark' ? 'light' : 'dark')}/>
                <motion.div animate={theme === 'dark' ? 'right' : 'left'} variants={positions} transition={{duration:0.1, delay:0}} className={`${theme === 'dark' ? ' bg-button-dark' : ''} z-20 absolute ease-in  transition w-5 h-5 bg-button-light rounded-full`} /> 
                <MdDarkMode className='absolute left-1 z-10 text-button-light'/>
                <MdLightMode className='absolute right-1 z-10 text-button-dark'/>
            </label>
        </AnimatePresence>
            
    )
}