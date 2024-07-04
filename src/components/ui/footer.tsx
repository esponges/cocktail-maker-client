export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white py-8 px-6 mt-10">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-2">AI Mixologist</h3>
            <p className="text-sm">
              Shaking up the future of cocktails, one AI-generated recipe at a
              time.
            </p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
            <ul className="text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-400 transition duration-300"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-400 transition duration-300"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-400 transition duration-300"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h4 className="text-lg font-semibold mb-2">Connect with Us</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-white hover:text-yellow-400 transition duration-300"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="#"
                className="text-white hover:text-yellow-400 transition duration-300"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="#"
                className="text-white hover:text-yellow-400 transition duration-300"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          © {new Date().getFullYear()} AI Mixologist. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
