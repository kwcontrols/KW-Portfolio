"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [authenticated, setAuthenticated] = useState(pathname === "/statistics");
  const [loginError, setLoginError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigation = [
    { href: "/", label: "About" },
    { href: "/resume", label: "Resume" },
    { href: "/experience", label: "Projects" },
    { href: "/contact", label: "Contact" },
  ];

  useEffect(() => {
    let active = true;
    fetch("/api/statistics-session", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (active) setAuthenticated(Boolean(data.authenticated));
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [pathname]);

  function openLogin() {
    setLoginError("");
    dialogRef.current?.showModal();
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setLoginError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("return_to", "/statistics");

    try {
      const response = await fetch("/api/statistics-login", {
        method: "POST",
        body: formData,
        redirect: "manual",
      });

      const sessionResponse = await fetch("/api/statistics-session", { cache: "no-store" });
      const session = await sessionResponse.json();
      if (session.authenticated) {
        setAuthenticated(true);
        dialogRef.current?.close();
        window.location.assign("/statistics");
        return;
      }

      if (response.type === "opaqueredirect" || response.status === 0) {
        window.location.assign("/statistics");
        return;
      }
      setLoginError("That access code is invalid or has expired. Please try again.");
    } catch {
      setLoginError("Sign in could not be completed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Kui Wu home">
        Kui Wu
      </a>
      <nav aria-label="Primary navigation">
        {navigation.map((item) => (
          <a
            href={item.href}
            key={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
          >
            {item.label}
          </a>
        ))}
        {authenticated ? (
          <>
            <a href="/statistics" aria-current={pathname === "/statistics" ? "page" : undefined}>
              Private Portal
            </a>
            <form action="/api/statistics-logout" method="post" className="header-auth-form">
              <button type="submit" className="header-auth-button">Sign out</button>
            </form>
          </>
        ) : (
          <button type="button" className="header-auth-button" onClick={openLogin}>
            Sign in
          </button>
        )}
      </nav>

      <dialog ref={dialogRef} className="portal-dialog" onClose={() => setLoginError("")}>
        <button
          type="button"
          className="portal-dialog-close"
          aria-label="Close sign in"
          onClick={() => dialogRef.current?.close()}
        >
          ×
        </button>
        <p className="portal-dialog-eyebrow">Private Portal</p>
        <h2>Administrator Access</h2>
        <p>Sign in to access the private portal. Authorized users can access the tools available to their account.</p>
        {loginError ? <p className="portal-dialog-error" role="alert">{loginError}</p> : null}
        <form onSubmit={handleLogin}>
          <label htmlFor="header-access-code">Access code</label>
          <input
            id="header-access-code"
            name="access_code"
            type="password"
            autoComplete="one-time-code"
            required
          />
          <button type="submit" className="portal-dialog-submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Continue"}
          </button>
        </form>
        <a className="portal-dialog-fallback" href="/statistics-login">Open full sign-in page</a>
      </dialog>
    </header>
  );
}
