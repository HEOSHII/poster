
import Dashboard from "./dashboard";

export default function User({ user }) {
   
    const toggleDashboard = () => {
        const dashboard = document.getElementById('dashboard');
        dashboard.classList.toggle('hidden');
        dashboard.classList.contains('hidden') ? backDropOff() : backDropOn();
    };
    const backDropOn = () => {
        const backdrop = document.getElementById('backdropBlack');
        backdrop.classList.remove('opacity-0', 'pointer-events-none');
        backdrop.classList.add('pointer-events-auto', 'backdrop-blur-sm');
    }
    const backDropOff = () => {
        const backdrop = document.getElementById('backdropBlack');
        backdrop.classList.remove('pointer-events-auto', 'backdrop-blur-sm');
        backdrop.classList.add('opacity-0', 'pointer-events-none');
    }

    const userName = user.displayName.split(' ')[0];

    return (
        <div>
            <div className="flex items-center gap-5 cursor-pointer" onClick={toggleDashboard}>
                <div className="relative z-20 bg-white rounded flex items-center gap-3 px-2 transition-shadow shadow-sm hover:shadow-md group h-button">
                    <p className="w-[min-content] leading-3 font-bold pointer-events-none">{userName}</p>
                    <img className="rounded-full h-9 pointer-events-none" src={user.photoURL} />
                    <Dashboard />
                </div>
            </div>
            <div className="pointer-events-none opacity-0 absolute top-0 left-0 bg-backgrop transition-all w-screen h-screen z-10" onClick={toggleDashboard} id="backdropBlack"></div>
        </div>
    )
}