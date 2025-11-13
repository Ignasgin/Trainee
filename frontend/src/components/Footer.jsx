export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © 2025 Trainee - Nutrition & Workout Platform
          </p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition text-sm">
              About
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition text-sm">
              Contact
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition text-sm">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
