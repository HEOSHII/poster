import Head from "next/head";
import Nav from "./nav";
import { useSelector } from 'react-redux'


export default function Layout({children}) {
    const currentPage = useSelector(state => state.page.name)
  
    return (
        <div className={`w-full h-full min-h-screen font-mulish flex justify-center item-center dark:bg-black`}>
            <Head>
                <title> {currentPage ? (`POSTERS | ${currentPage}`) : 'POSTERS'} </title>
            </Head>
            <Nav />
            
            <main className="relative container mt-20 dark:bg-black">
                { !!currentPage && (<h1 className="text-white font-bold text-2xl text-center uppercase mb-2">{currentPage}</h1>) }
                {children}
            </main>

            <div className="fixed bottom-0 left-0 w-full h-[150px] bg-gradient-to-t from-background-light dark:from-background-dark ackground-dark to-transparent">
            </div>
        </div>
    );
}