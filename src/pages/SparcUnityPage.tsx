import React, { useEffect, useRef, useState, useCallback } from "react";
import type { InboundUnityMessage, OutboundUnityMessage } from "../types";
import useUnityBridge from "../hooks/useUnityBridge";
import { LoaderCircle } from "lucide-react";
// import { pauseSession, resumeSession, requestCurrentSession } from "../lib/unityUtils";

/** Request mic/camera in the parent so the same-origin Unity iframe can use them. */
async function requestMediaInParent(): Promise<{ ok: boolean; error?: string }> {
  if (!navigator.mediaDevices?.getUserMedia) {
    return { ok: false, error: "getUserMedia not supported" };
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => t.stop());
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || String(e) };
  }
}

const CACHE_BUST = Date.now().toString(36);

const SparcUnityPage: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const postToUnityRef = useRef<((payload: OutboundUnityMessage) => void) | null>(null);
  /** Cleared when UNITY_READY fires so the iframe can receive clicks for WebGL mic gestures. */
  const loaderFallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [unityReady, setUnityReady] = useState(false);
  const [mediaStatus, setMediaStatus] = useState<"idle" | "requesting" | "granted" | "denied">("idle");
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [loaderStatus, setLoaderStatus] = useState<"loading" | "complete">("loading");

  const handleRequestMedia = useCallback(async () => {
    setMediaStatus("requesting");
    setMediaError(null);
    const result = await requestMediaInParent();
    if (result.ok) {
      setMediaStatus("granted");
    } else {
      setMediaStatus("denied");
      setMediaError(result.error ?? "Permission denied");
    }
  }, []);

  // On load, check mic permission state and auto-request if not yet decided.
  useEffect(() => {
    async function initMic() {
      // Try the Permissions API first to avoid an unnecessary getUserMedia prompt.
      if (typeof navigator?.permissions?.query === "function") {
        try {
          const status = await navigator.permissions.query({ name: "microphone" as PermissionName });
          if (status.state === "granted") {
            setMediaStatus("granted");
            return;
          }
          if (status.state === "denied") {
            setMediaStatus("denied");
            setMediaError("Microphone access was denied. Allow it in browser settings and reload.");
            return;
          }
          // state === "prompt" — fall through to auto-request below.
        } catch {
          // Permissions API not supported — fall through to getUserMedia.
        }
      }
      // Automatically request permission (shows the browser prompt once).
      const result = await requestMediaInParent();
      if (result.ok) {
        setMediaStatus("granted");
      } else {
        setMediaStatus("denied");
        setMediaError(result.error ?? "Permission denied");
      }
    }
    initMic();
  }, []);

  useEffect(() => {
    loaderFallbackTimerRef.current = setTimeout(() => {
      setLoaderStatus("complete");
      loaderFallbackTimerRef.current = null;
    }, 15000);
    return () => {
      if (loaderFallbackTimerRef.current) {
        clearTimeout(loaderFallbackTimerRef.current);
        loaderFallbackTimerRef.current = null;
      }
    };
  }, []);

  // After React obtains mic permission, tell the Unity iframe to drop any stale stream only.
  // Actual getUserMedia in the iframe must follow a user gesture on the canvas (clicks pass
  // through the loading overlay via pointer-events: none).
  useEffect(() => {
    if (mediaStatus !== "granted") return;
    const id = window.setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage(
        { type: "REACT_MIC_GRANTED" },
        window.location.origin
      );
    }, 500);
    return () => window.clearTimeout(id);
  }, [mediaStatus, unityReady]);

  // Handle messages FROM Unity (iframe → React)
  const handleMessage = useCallback((msg: InboundUnityMessage) => {
    const { type, data } = msg;
    switch (type) {
      case "UNITY_READY":
        if (loaderFallbackTimerRef.current) {
          clearTimeout(loaderFallbackTimerRef.current);
          loaderFallbackTimerRef.current = null;
        }
        setLoaderStatus("complete");
        setUnityReady(Boolean((data as any)?.ready));
        break;

      case "UNITY_SESSION_EVENT":
        // Session progress / summary from Unity
        console.log("UNITY_SESSION_EVENT", data);
        // You can optionally push this to React-side Firebase if desired
        break;

      case "UNITY_ANALYTICS_EVENT":
        console.log("UNITY_ANALYTICS_EVENT", data);
        break;

      case "UNITY_ERROR":
        console.error("UNITY_ERROR", data);
        break;

      case "UNITY_REQUEST_DATA":
        // Unity asking React for extra data (e.g. SSO profile, Firebase token, etc.)
        console.log("UNITY_REQUEST_DATA", data);
        // Example: respond with minimal stub; wire up real data later
        if ((data as any)?.requestType === "USER_PROFILE") {
          postToUnityRef.current?.({
            type: "REACT_TO_UNITY_SESSION",
            data: {
              sessionData: {
                requestId: (data as any).requestId,
                profile: { role: "clinician", source: "react-stub" },
              },
            },
          });
        }
        break;

      default:
        // Unknown messages can be logged for debugging
        console.log("Unknown Unity message", msg);
        break;
    }
  }, []);

  const postToUnity = useUnityBridge(iframeRef, handleMessage);
  useEffect(() => {
    postToUnityRef.current = postToUnity;
  }, [postToUnity]);

  return (
    <div className="relative w-full h-page z-0">
      {loaderStatus === "loading" && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/70"
          style={{ pointerEvents: "none" }}
          aria-hidden
        >
          <p className="text-lg text-white font-900">Loading simulation...</p>
          <LoaderCircle className="w-12 h-12 text-yellow animate-spin m-4" />
        </div>
      )}
      <div
        className="absolute top-0 left-0 w-full" 
        style={{ height: "100%", overflow: "hidden", background: "#111", display: "flex", flexDirection: "column" }}>
        {/* Request mic/camera from parent so same-origin Unity iframe can use them */}
        {mediaStatus !== "granted" && (
          <div
            style={{
              flexShrink: 0,
              padding: "10px 16px",
              background: mediaStatus === "denied" ? "#4a1a1a" : "#1a2a3a",
              color: "#eee",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            {(mediaStatus === "idle" || mediaStatus === "requesting") && (
              <span>Requesting microphone access… Allow the browser prompt to enable speech recognition.</span>
            )}
            {mediaStatus === "denied" && (
              <>
                <span>⚠️ Microphone access denied — speech recognition will not work. {mediaError && `(${mediaError})`} Allow microphone in your browser settings and reload, or:</span>
                <button type="button" onClick={handleRequestMedia} style={{ padding: "6px 14px", cursor: "pointer", marginLeft: 8 }}>
                  Try again
                </button>
              </>
            )}
          </div>
        )}
        <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
          <iframe
            ref={iframeRef}
            src={`/unity/index.html?v=${CACHE_BUST}`}
            title="Interactive training session"
            style={{
              border: "none",
              width: "100%",
              height: "100vh",
              position: "absolute",
              inset: 0,
            }}
            allow="microphone; fullscreen; local-network"
          />
        </div>
      </div>
    </div>
  );
};

export default SparcUnityPage;
