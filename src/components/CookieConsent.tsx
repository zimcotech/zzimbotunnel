import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X } from 'lucide-react';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Small delay before showing
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 pointer-events-none"
        >
          <div className="max-w-4xl mx-auto bg-white border border-gray-200 shadow-2xl rounded-2xl p-5 sm:p-6 pointer-events-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0 hidden sm:flex">
                <Cookie className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Cookie className="w-4 h-4 text-blue-600 sm:hidden" />
                  <h4 className="text-gray-900 font-semibold">We value your privacy</h4>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
              <button
                onClick={declineCookies}
                className="flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Decline
              </button>
              <button
                onClick={acceptCookies}
                className="flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200"
              >
                Accept All
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
