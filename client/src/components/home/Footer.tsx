/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChartNoAxesColumnIcon } from "lucide-react";
import { homefooterLinks } from "../../assets/assets";
import { SiX, SiLinkerd, SiGithub } from "@icons-pack/react-simple-icons";
import { FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
      <footer className="border-t border-border py-12 bg-card text-foreground">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <ChartNoAxesColumnIcon className="text-primary" />
                <span className="text-xl">Seo Ranker</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6 w-5/6">
                Optimize your website for search engines with AI-powered
                insights and real-time tracking.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  to="https://x.com/charles_osango"
                  target="_blank"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <SiX size={20} />
                </Link>
                <Link
                  to="https://github.com/CharlesOsang017"
                  target="_blank"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <SiGithub size={20} />
                </Link>
                <Link
                  to="https://www.linkedin.com/in/charles-osango-225a911b4"
                  target="_blank"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <FaLinkedin size={20} />
                </Link>
              </div>
            </div>

            {homefooterLinks.map((section: any) => (
              <div key={section.title}>
                <h3 className="mb-4">{section.title}</h3>
                <ul className="space-y-1">
                  {section.links.map((link: any) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SeoRanker. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-muted-foreground">
                Status: All Systems Operational
              </span>
            </div>
          </div>
        </div>
      </footer>
    );
}
