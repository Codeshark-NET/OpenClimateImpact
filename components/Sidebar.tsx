"use client";

import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { usePathPrefix } from "hooks/usePathData";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppData } from "../hooks/useAppData";
import { AboutSection } from "./AboutSection";
import { LinkButton } from "./Button/LinkButton";
import { LanguagePicker } from "./Picker/LanguagePicker";
import { TagPicker } from "./Picker/TagPicker";
import ScrollToTop from "./ScrollToTop";

export const Sidebar = () => {
  const pageType = usePathPrefix();
  const { tag: activeTagId, language: activeLanguageId } = useParams();

  const { languages, tags } = useAppData();

  // State variable to track whether the user has scrolled to a minimum height of 702 pixels vertically.
  const [scrollHeightReached, setScrollHeightReached] = useState(false);
  const [showUpArrow, setShowUpArrow] = useState(false);

  useEffect(() => {
    const scrollTarget = document.getElementById("repositories-list");
    const isMobile = window.innerWidth <= 640;
    if (isMobile && (pageType === "language" || pageType === "tag")) {
      scrollTarget?.scrollIntoView({ behavior: "smooth" });
    }

    // Handle scroll events and set "scrollHeightReached" & "showUpArrow" to True,  when the user scrolls to 702 pixels vertically.
    const handleScroll = () => {
      setScrollHeightReached(window.scrollY >= 702);
      setShowUpArrow(window.scrollY > 702);
    };

    // Add the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Remove the scroll event listener when the component unmounts
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pageType]);

  // Function to scroll to the top of the page
  const handleScrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <section
      className={`w-full flex-none px-6 font-sans text-silver-500 md:relative md:max-w-sm ${
        pageType === "auth" && "hidden md:block"
      }`}
    >
      <AboutSection />
      <div className="pt-4">
        <LinkButton title="Star it on GitHub" href="https://github.com/lucavallin/verto" secondary>
          <FontAwesomeIcon icon={faGithub} className="mr-2" />
          Star it on GitHub 🌟
        </LinkButton>
      </div>
      <div className="pt-2">
        <LinkButton
          title="Add your project"
          href="https://github.com/lucavallin/verto#adding-a-new-project"
        >
          Add your project
        </LinkButton>
      </div>

      {pageType === "auth" ? (
        <div className="m-20" />
      ) : (
        <div
          className={` z-50 bg-black-400 transition-all duration-300 md:sticky md:top-4 ${
            scrollHeightReached ? "fixed top-0 " : "sticky top-0"
          }`}
        >
          <LanguagePicker
            languages={languages}
            activeTagId={activeLanguageId}
            onLanguagePage={pageType == "language"}
          />
          <TagPicker tags={tags} activeTagId={activeTagId} onTagPage={pageType == "tag"} />
        </div>
      )}
      {showUpArrow && <ScrollToTop handleOnClick={handleScrollToTop} />}
    </section>
  );
};
