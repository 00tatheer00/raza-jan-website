'use client';

import { useState, useEffect, useRef } from 'react';

const languages = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'ur', label: 'Urdu', native: 'اردو', flag: '🇵🇰' },
  { code: 'ar', label: 'Arabic', native: 'العربية', flag: '🇦🇪' },
  { code: 'fr', label: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'German', native: 'Deutsch', flag: '🇩🇪' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  /* Close dropdown on outside click or Escape */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  /* Initialize language from storage/cookie and load Google Translate script */
  useEffect(() => {
    try {
      const getCookie = (name) => {
        const val = `; ${document.cookie}`;
        const parts = val.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
      };

      const googtrans = getCookie('googtrans');
      let lang = 'en';
      if (googtrans) {
        const parts = googtrans.split('/');
        if (parts.length >= 3 && parts[2]) {
          lang = parts[2];
        }
      } else {
        const saved = localStorage.getItem('user_selected_lang');
        if (saved) lang = saved;
      }

      if (lang) {
        setCurrentLang(lang);
        if (lang === 'ur' || lang === 'ar') {
          document.documentElement.setAttribute('dir', 'rtl');
          document.documentElement.classList.add('rtl-mode');
        }
      }
    } catch (e) {}

    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,ur,ar,fr,es,de',
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }

    /* Permanently suppress Google Translate top banner & body displacement */
    const removeGoogleBanner = () => {
      if (document.body.style.top && document.body.style.top !== '0px') {
        document.body.style.setProperty('top', '0px', 'important');
      }
      if (document.documentElement.style.top && document.documentElement.style.top !== '0px') {
        document.documentElement.style.setProperty('top', '0px', 'important');
      }
      const banners = document.querySelectorAll(
        '.goog-te-banner-frame, iframe.skiptranslate, body > .skiptranslate, iframe[id^=":"], #goog-gt-tt'
      );
      banners.forEach((el) => {
        el.style.setProperty('display', 'none', 'important');
        el.style.setProperty('visibility', 'hidden', 'important');
        el.style.setProperty('height', '0px', 'important');
        el.style.setProperty('opacity', '0', 'important');
        el.style.setProperty('pointer-events', 'none', 'important');
        el.style.setProperty('z-index', '-9999', 'important');
      });
    };

    removeGoogleBanner();
    const bannerInterval = setInterval(removeGoogleBanner, 200);

    const observer = new MutationObserver(() => {
      removeGoogleBanner();
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      childList: true,
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    return () => {
      clearInterval(bannerInterval);
      observer.disconnect();
    };
  }, []);

  const changeLanguage = (langCode) => {
    setCurrentLang(langCode);
    setDropdownOpen(false);

    // 1. Update cookies & storage immediately
    try {
      localStorage.setItem('user_selected_lang', langCode);
    } catch (e) {}

    if (langCode === 'en') {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${window.location.hostname}; path=/;`;
      document.cookie = 'googtrans=/en/en; path=/;';
      document.cookie = `googtrans=/en/en; domain=.${window.location.hostname}; path=/;`;
    } else {
      document.cookie = `googtrans=/en/${langCode}; path=/;`;
      document.cookie = `googtrans=/en/${langCode}; domain=.${window.location.hostname}; path=/;`;
    }

    // 2. Adjust RTL for Urdu / Arabic
    if (langCode === 'ur' || langCode === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.classList.add('rtl-mode');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.classList.remove('rtl-mode');
    }

    // 3. Trigger Google Translate combo select
    const triggerCombo = () => {
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event('change'));
        return true;
      }
      return false;
    };

    if (!triggerCombo()) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (triggerCombo() || attempts > 8) {
          clearInterval(interval);
          if (attempts > 8) {
            window.location.reload();
          }
        }
      }, 200);
    }
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      {/* Hidden Google Translate container */}
      <div id="google_translate_element" style={{ display: 'none' }} aria-hidden="true" />

      <div className="navbar__inner">
        {/* Logo */}
        <a href="#" className="navbar__logo">
          <span>SRJ Studio</span>
        </a>

        {/* Desktop Menu — Horizontal Row */}
        <div className="navbar__menu">
          <a href="#about" className="navbar__menu-item">About</a>
          <a href="#services" className="navbar__menu-item">Services</a>
          <a href="#projects" className="navbar__menu-item">Projects</a>
          <a href="#insights" className="navbar__menu-item">Insights</a>
          <a href="#team" className="navbar__menu-item">Process</a>
          <a href="#contact" className="navbar__menu-item">Contact Us</a>
        </div>

        {/* Language Switcher — Protected from Google Translate mutation */}
        <div className="navbar__lang notranslate" translate="no" ref={dropdownRef}>
          <button
            type="button"
            className="navbar__lang-btn notranslate"
            translate="no"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            aria-label={`Select language, currently ${currentLang.toUpperCase()}`}
          >
            <span className="navbar__lang-code-text notranslate" translate="no">
              {currentLang.toUpperCase()}
            </span>
            <svg
              className={`navbar__lang-arrow ${dropdownOpen ? 'navbar__lang-arrow--open' : ''}`}
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
            >
              <path
                d="M1 1L5 5L9 1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Luxury Dropdown Menu */}
          {dropdownOpen && (
            <div className="navbar__lang-dropdown notranslate" translate="no" role="menu">
              {languages.map((lang) => {
                const isActive = lang.code === currentLang;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    role="menuitem"
                    className={`navbar__lang-item notranslate ${isActive ? 'navbar__lang-item--active' : ''}`}
                    translate="no"
                    onClick={() => changeLanguage(lang.code)}
                  >
                    <div className="navbar__lang-item-left notranslate" translate="no">
                      <span className="navbar__lang-flag">{lang.flag}</span>
                      <span className="navbar__lang-native notranslate" translate="no">{lang.native}</span>
                      <span className="navbar__lang-code notranslate" translate="no">{lang.code.toUpperCase()}</span>
                    </div>
                    {isActive && (
                      <span className="navbar__lang-check">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M3 8.5L6.5 12L13 4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="navbar__hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span style={mobileOpen ? { transform: 'rotate(45deg) translate(5px, 5px)' } : {}} />
          <span style={mobileOpen ? { opacity: 0 } : {}} />
          <span style={mobileOpen ? { transform: 'rotate(-45deg) translate(5px, -5px)' } : {}} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="navbar__mobile-overlay">
          <div className="navbar__mobile-links">
            <a href="#about" onClick={closeMobile}>About</a>
            <a href="#services" onClick={closeMobile}>Services</a>
            <a href="#projects" onClick={closeMobile}>Projects</a>
            <a href="#team" onClick={closeMobile}>Process</a>
            <a href="#insights" onClick={closeMobile}>Insights</a>
            <a href="#contact" onClick={closeMobile}>Contact</a>
          </div>

          {/* Mobile Language Selector */}
          <div className="navbar__mobile-lang notranslate" translate="no">
            <span className="navbar__mobile-lang-title notranslate" translate="no">Language / زبان / لغة</span>
            <div className="navbar__mobile-lang-grid notranslate" translate="no">
              {languages.map((lang) => {
                const isActive = lang.code === currentLang;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    className={`navbar__mobile-lang-btn notranslate ${isActive ? 'navbar__mobile-lang-btn--active' : ''}`}
                    translate="no"
                    onClick={() => {
                      changeLanguage(lang.code);
                      closeMobile();
                    }}
                  >
                    <span className="navbar__lang-flag">{lang.flag}</span>
                    <span className="notranslate" translate="no">{lang.native}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="navbar__mobile-contact">
            <a
              href="https://wa.me/923465564074"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill"
              onClick={closeMobile}
            >
              <span>WhatsApp Direct</span>
              <span className="btn-arrow">→</span>
            </a>
            <p className="navbar__mobile-city">Islamabad, Pakistan · Global Practice</p>
          </div>
        </div>
      )}
    </nav>
  );
}
