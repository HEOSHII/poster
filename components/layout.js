import Head from "next/head";
import Nav from "./nav";

export default function Layout({children}) {
    return (
        <div className="w-full h-screen font-mulish'">
            <Head>
                 <title>POSTERS</title>
            </Head>
            <Nav />
            <main className="container p-3">{children}</main>
        </div>
    );
}