import { useEffect, useRef } from "react";

const GOOGLE_SCRIPT_ID = "google-identity-services-script";

const loadGoogleScript = (onLoad) => {
  if (window.google?.accounts?.id) {
    onLoad();
    return;
  }

  const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);
  if (existingScript) {
    existingScript.addEventListener("load", onLoad, { once: true });
    return;
  }

  const script = document.createElement("script");
  script.id = GOOGLE_SCRIPT_ID;
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;
  script.onload = onLoad;
  document.body.appendChild(script);
};

const GoogleAuthButton = ({ flow = "signin", onSuccess, onError }) => {
  const buttonRef = useRef(null);
  const callbacksRef = useRef({ onSuccess, onError });

  useEffect(() => {
    callbacksRef.current = { onSuccess, onError };
  }, [onSuccess, onError]);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId || !buttonRef.current) {
      return undefined;
    }

    let mounted = true;

    const renderGoogleButton = () => {
      if (!mounted || !buttonRef.current || !window.google?.accounts?.id) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          try {
            await callbacksRef.current.onSuccess?.(response.credential);
          } catch (error) {
            callbacksRef.current.onError?.(error);
          }
        },
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        text: flow === "signup" ? "signup_with" : "signin_with",
        width: buttonRef.current.offsetWidth,
      });
    };

    loadGoogleScript(renderGoogleButton);

    return () => {
      mounted = false;
    };
  }, [flow]);

  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    return (
      <div className="p-3 text-sm text-center text-amber-700 bg-amber-50 rounded-xl border border-amber-200">
        Set VITE_GOOGLE_CLIENT_ID to enable Google sign in.
      </div>
    );
  }

  return <div ref={buttonRef} className="w-full overflow-hidden" />;
};

export default GoogleAuthButton;
