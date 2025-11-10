import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-[#141414] text-gray-400 py-6 border-t border-gray-800">
            <div className="max-w-6xl mx-auto px-4 text-center">
                <p>
                    &copy; {new Date().getFullYear()} SpinningSpinning Dolimpan. All rights
                    reserved.
                </p>
                <div className="flex justify-center flex-wrap gap-6 mt-4 text-sm">
                    <Link to="#" className="hover:text-white transition-colors">
                        Privacy Policy
                    </Link>
                    <Link to="#" className="hover:text-white transition-colors">
                        Terms of Service
                    </Link>
                    <Link to="#" className="hover:text-white transition-colors">
                        Contact
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
