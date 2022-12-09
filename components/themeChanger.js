import { useTheme } from 'next-themes'
import { MdLightMode, MdDarkMode } from 'react-icons/md'


export default function ThemeChanger () {
    const {theme, setTheme} = useTheme();
    return (
            <label htmlFor="changer" className={`p-[2px] relative flex items-center w-12 h-6 bg-white mx-auto my-3 cursor-pointer rounded-full`}>
                <input className='hidden' type="checkbox" id='changer' onChange={()=>setTheme(theme === 'dark' ? 'light' : 'dark')}/>
                <div className={`${theme === 'dark' ? 'translate-x-[23px] bg-button-dark' : 'translate-x-[1px]'} z-20 absolute ease-in  transition w-5 h-5 bg-button-light rounded-full`} /> 
                <MdDarkMode className='absolute left-1.5 z-10 text-textColor-light'/>
                <MdLightMode className='absolute right-1.5 z-10 text-yellow-400'/>
                {/* DARK MODE */}
            </label>
    )
}