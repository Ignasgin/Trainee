import { HiHeart, HiInformationCircle, HiMail, HiShieldCheck } from 'react-icons/hi';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-300 flex items-center gap-2">
              Made with <HiHeart className="text-red-500 animate-pulse" /> by Trainee Team
            </p>
          </div>
          
          <p className="text-sm text-gray-400">
            © 2025 Trainee - Nutrition & Workout Platform
          </p>
          
          <div className="flex space-x-6 mt-2 md:mt-0">
            <a 
              href="#" 
              className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 text-sm group"
            >
              <HiInformationCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              About
            </a>
            <a 
              href="#" 
              className="text-gray-400 hover:text-secondary transition-colors flex items-center gap-2 text-sm group"
            >
              <HiMail className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Contact
            </a>
            <a 
              href="#" 
              className="text-gray-400 hover:text-accent transition-colors flex items-center gap-2 text-sm group"
            >
              <HiShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
