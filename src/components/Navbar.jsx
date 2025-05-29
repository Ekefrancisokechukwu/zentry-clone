import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import Button from "./Button";
// import { useGSAP } from "@gsap/react";

const navItems = ["Nexus", "Vault", "Prologue", "About", "Contact"];

const Navbar = () => {
  // State for toggling audio and visual indicator
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);

  const navbarItemsContainer = useRef(null);
  const navbarItemsIndicatorRef = useRef(null);
  const navbarItemsRef = useRef([]);

  const { y: curentScrollY } = useWindowScroll();

  useEffect(() => {
    const items = navbarItemsRef.current;
    const nav = navbarItemsContainer.current;
    const indicator = navbarItemsIndicatorRef.current;

    gsap.set(indicator, { opacity: 0 });

    const cleanupFns = [];

    const setActiveItem = (activeItem) => {
      const itemRect = activeItem.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();

      items.forEach((item) => {
        if (item) item.style.color = "";
      });

      activeItem.style.color = "#000";

      gsap.to(indicator, {
        duration: 0.3,
        ease: "power2.out",
        x: itemRect.left - navRect.left,
        width: itemRect.width,
        opacity: 1,
      });
    };

    items.forEach((item) => {
      if (!item) return;

      const handleMouseEnter = () => setActiveItem(item);

      item.addEventListener("mouseenter", handleMouseEnter);
      cleanupFns.push(() => {
        item.removeEventListener("mouseenter", handleMouseEnter);
      });
    });

    const handleNavLeave = () => {
      items.forEach((item) => {
        if (item) item.style.color = "";
      });

      gsap.to(indicator, {
        duration: 0.2,
        ease: "power2.out",
        opacity: 0,
      });
    };

    nav.addEventListener("mouseleave", handleNavLeave);

    return () => {
      cleanupFns.forEach((fn) => fn());
      nav.removeEventListener("mouseleave", handleNavLeave);
    };
  }, []);

  useEffect(() => {
    if (curentScrollY === 0) {
      setIsNavVisible(true);
      navContainerRef.current.classList.remove("floating-nav");
    } else if (curentScrollY > lastScrollY) {
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
    } else if (curentScrollY < lastScrollY) {
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
    }

    setLastScrollY(curentScrollY);
  }, [curentScrollY, lastScrollY]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  useEffect(() => {
    if (isAudioPlaying) {
      audioElementRef.current.play();
    } else {
      audioElementRef.current.pause();
    }
  }, [isAudioPlaying]);

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
    >
      <header className="absolute top-1/2 w-full  -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          <div className="flex items-center gap-7">
            <img src="/img/logo.png" alt="logo" />
            <Button
              id="product-button"
              title="Products"
              rightIcon={<TiLocationArrow />}
              containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
            />
          </div>
          {/* Navigation Links and Audio Button */}
          <div className="flex h-full items-center relative z-10 ">
            <div ref={navbarItemsContainer} className="hidden md:block py-1.5">
              <div
                ref={navbarItemsIndicatorRef}
                className="absolute opacity-0 -z-10 bg-violet-50 top-0 w-14 rounded-full h-full"
              />
              {navItems.map((item, index) => (
                <a
                  ref={(el) => (navbarItemsRef.current[index] = el)}
                  key={index}
                  href={`#${item.toLowerCase()}`}
                  className="nav-hover-btn  relative z-10 hover:text-black py-1.5 px-3 text-violet-50  rounded-full"
                >
                  {item}
                </a>
              ))}
            </div>
            <button
              onClick={toggleAudioIndicator}
              className="ml-10 flex items-center space-x-0.5"
            >
              <audio
                ref={audioElementRef}
                className="hidden"
                src="/audio/loop.mp3"
                loop
              />
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={clsx("indicator-line", {
                    active: isIndicatorActive,
                  })}
                  style={{
                    animationDelay: `${bar * 0.1}s`,
                  }}
                />
              ))}
            </button>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
