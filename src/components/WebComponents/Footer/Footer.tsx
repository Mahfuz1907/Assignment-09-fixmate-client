import type { SVGProps } from "react";
import Link from "next/link";
import {
  Clock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BackToTop, NewsletterForm } from "./FooterActions";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
] as const;

const CATEGORIES = [
  { label: "Plumbing", href: "/services?category=plumbing" },
  { label: "Electrical", href: "/services?category=electrical" },
  { label: "Appliance Repair", href: "/services?category=appliance-repair" },
  { label: "Carpentry", href: "/services?category=carpentry" },
  { label: "Painting", href: "/services?category=painting" },
  { label: "Cleaning", href: "/services?category=cleaning" },
] as const;

const CONTACT_ITEMS = [
  {
    label: "Email us",
    value: "hello@fixmate.com",
    href: "mailto:hello@fixmate.com",
    icon: Mail,
  },
  {
    label: "Call us",
    value: "+1 (555) 012-3456",
    href: "tel:+15550123456",
    icon: Phone,
  },
  {
    label: "Visit us",
    value: "1420 Cedar Avenue, Suite 210\nAustin, TX 78701",
    href: null,
    icon: MapPin,
  },
] as const;

function XLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
    </svg>
  );
}

function InstagramLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
    </svg>
  );
}

function LinkedInLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const SOCIALS = [
  { label: "X (formerly Twitter)", href: "https://x.com/fixmate", icon: XLogo },
  {
    label: "Instagram",
    href: "https://instagram.com/fixmate",
    icon: InstagramLogo,
  },
  {
    label: "Facebook",
    href: "https://facebook.com/fixmate",
    icon: FacebookLogo,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/fixmate",
    icon: LinkedInLogo,
  },
] as const;

function FooterBrand() {
  return (
    <Link
      href="/"
      aria-label="FixMate home"
      className="group inline-flex w-fit items-center gap-2.5 rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-amber-500/40"
    >
      <span className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-amber-400 via-amber-500 to-orange-500 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_6px_16px_-8px_rgba(245,158,11,0.9)] transition-transform duration-300 group-hover:-rotate-6">
        <Wrench className="size-5" strokeWidth={2.4} aria-hidden="true" />
        <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-zinc-950 bg-emerald-500" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[1.3rem] font-extrabold tracking-tight text-white">
          Fix<span className="text-amber-400">Mate</span>
        </span>
        <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-zinc-500">
          Home repair pros
        </span>
      </span>
    </Link>
  );
}

function FooterLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="group flex w-fit items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
    >
      <span
        className="h-px w-0 bg-amber-400 transition-all duration-200 group-hover:w-3"
        aria-hidden="true"
      />
      {children}
    </Link>
  );
}

function ColumnHeading({ children }: { children: string }) {
  return (
    <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
      {children}
    </h3>
  );
}

function getCopyrightYear() {
  return new Date().getFullYear();
}

const Footer = () => {
  const year = getCopyrightYear();

  return (
    <footer className="relative mt-24 overflow-hidden rounded-t-[2rem] border-t border-white/10 bg-zinc-950 text-zinc-300 sm:rounded-t-[2.5rem]">
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 left-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-orange-500/5 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-500/60 to-transparent"
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-8 pt-10 sm:px-8 sm:pt-12 lg:px-10 lg:pt-14">
        {/* Newsletter */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-24 size-56 rounded-full bg-amber-500/10 blur-3xl"
          />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-400">
                <Sparkles className="size-3.5" aria-hidden="true" />
                The FixMate dispatch
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Good fixes start with good advice.
              </h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-zinc-400">
                Monthly maintenance tips and seasonal checklists. No spam — just
                the useful stuff.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>

        {/* Main footer */}
        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-4 lg:pr-8">
            <FooterBrand />
            <p className="mt-5 max-w-xs text-sm leading-6 text-zinc-400">
              Trusted local pros for every fix — big or small. Upfront pricing,
              work that lasts.
            </p>
            <Badge
              variant="outline"
              className="mt-5 h-6 gap-1.5 rounded-full border-emerald-500/20 bg-emerald-500/10 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300"
            >
              <ShieldCheck className="size-3" aria-hidden="true" />
              Licensed &amp; insured
            </Badge>

            <div className="mt-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                Follow along
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {SOCIALS.map((social) => {
                  const SocialIcon = social.icon;

                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-300 focus-visible:border-amber-500/60 focus-visible:ring-3 focus-visible:ring-amber-500/30 focus-visible:outline-none"
                    >
                      <SocialIcon className="size-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2">
            <ColumnHeading>Quick links</ColumnHeading>
            <nav aria-label="Footer" className="mt-4 flex flex-col gap-3">
              {QUICK_LINKS.map((link) => (
                <FooterLink key={link.label} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </nav>
          </div>

          {/* Categories */}
          <div className="lg:col-span-3">
            <ColumnHeading>Popular categories</ColumnHeading>
            <div className="mt-4 flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <Link
                  key={category.label}
                  href={category.href}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-400 transition-all duration-200 hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-300 focus-visible:border-amber-500/60 focus-visible:ring-3 focus-visible:ring-amber-500/30 focus-visible:outline-none"
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="sm:col-span-2 lg:col-span-3">
            <ColumnHeading>Get in touch</ColumnHeading>
            <address className="mt-4 flex flex-col gap-4 not-italic">
              {CONTACT_ITEMS.map((item) => {
                const ContactIcon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="group flex items-start gap-3"
                  >
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-amber-400 transition-colors group-hover:border-amber-500/40">
                      <ContactIcon className="size-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="mt-0.5 block text-sm text-zinc-300 transition-colors hover:text-amber-300 focus-visible:text-amber-300 focus-visible:outline-none"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="mt-0.5 whitespace-pre-line text-sm leading-5 text-zinc-300">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </address>
            <p className="mt-5 flex items-center gap-1.5 text-xs text-zinc-500">
              <Clock className="size-3.5" aria-hidden="true" />
              Mon–Sat, 8:00 AM – 8:00 PM
            </p>
          </div>
        </div>

        <Separator className="my-9 bg-white/10" />

        {/* Bottom bar */}
        <div className="flex flex-col gap-5 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <p className="text-xs text-zinc-500">
              © {year} FixMate. All rights reserved.
            </p>
            <nav
              aria-label="Legal"
              className="flex flex-wrap items-center gap-x-5 gap-y-2"
            >
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Cookies", href: "/cookies" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs text-zinc-500 transition-colors hover:text-zinc-200 focus-visible:text-zinc-200 focus-visible:outline-none"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <BackToTop />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
