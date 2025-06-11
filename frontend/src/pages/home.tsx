import Navegate from "../components/navegate";
import LoginPopup from "../components/loginPopup";

function Home() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <LoginPopup />
            <Navegate />
        </div>
    );
}

export default Home;
