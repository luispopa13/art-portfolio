import { Instagram, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-100 py-16 border-t border-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-10">
          
          {/* Connect */}
          <div>
            <h3 className="text-xs font-normal mb-5 tracking-widest text-gray-400">
              CONNECT
            </h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://www.instagram.com/miissssaaaaa/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-white hover:text-gray-300 transition-colors group text-sm"
                >
                  <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="font-light">Personal</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.instagram.com/miisaaas.art/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-white hover:text-gray-300 transition-colors group text-sm"
                >
                  <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="font-light">Art Gallery</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-normal mb-5 tracking-widest text-gray-400">
              GET IN TOUCH
            </h3>
            <a 
              href="mailto:misaart@gmail.com"
              className="flex items-center gap-2.5 text-white hover:text-gray-300 transition-colors group text-sm"
            >
              <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="font-light">misaart@gmail.com</span>
            </a>
          </div>
          <div className="md:text-right">
            <h3 className="text-lg font-normal mb-3 text-white tracking-tight" style={{ fontFamily: 'Cinzel, serif' }}>
              Art by Maise
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed font-light">
              Creating beautiful art and bringing imagination to life through color and emotion.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-10 border-t border-gray-900 text-center">
          <p className="text-xs text-gray-400 tracking-wide font-light">
            © {new Date().getFullYear()} Art by Maise. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}