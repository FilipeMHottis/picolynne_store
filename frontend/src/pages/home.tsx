import StorageUtil from "../utils/storageUtil";
import Navegate from "../components/navegate";


function Home() {
    const user = StorageUtil.getItem("user");
    
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <Navegate />
        </div>
    );
}

export default Home;
