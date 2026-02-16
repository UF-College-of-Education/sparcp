import React, { useEffect, useRef, useState, useCallback } from "react";

type UnityMessage =
  | { type: "UNITY_READY"; data: { ready: boolean; timestamp: string } }
  | { type: "UNITY_SESSION_EVENT"; data: any }
  | { type: "UNITY_ANALYTICS_EVENT"; data: { eventName: string; eventData: any } }
  | { type: "UNITY_ERROR"; data: { errorType: string; errorMessage: string } }
  | { type: "UNITY_REQUEST_DATA"; data: { requestType: string; requestId: string; parameters: any } }
  | { type: string; data: any }; // fallback

/** Request mic/camera in the parent so the same-origin Unity iframe can use them. */
async function requestMediaInParent(): Promise<{ ok: boolean; error?: string }> {
  if (!navigator.mediaDevices?.getUserMedia) {
    return { ok: false, error: "getUserMedia not supported" };
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    stream.getTracks().forEach((t) => t.stop());
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || String(e) };
  }
}

const SparcUnityPage: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [unityReady, setUnityReady] = useState(false);
  const [lastEvent, setLastEvent] = useState<string>("");
  const [mediaStatus, setMediaStatus] = useState<"idle" | "requesting" | "granted" | "denied">("idle");
  const [mediaError, setMediaError] = useState<string | null>(null);

  // Send a message TO Unity (inside the iframe)
  const postToUnity = useCallback((payload: any) => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) return;

    iframe.contentWindow.postMessage(payload, window.location.origin);
  }, []);

  // Example helpers for parent → Unity commands
  const pauseSession = () => {
    postToUnity({
      type: "REACT_TO_UNITY_COMMAND",
      data: { command: "PauseGame" },
    });
  };

  const resumeSession = () => {
    postToUnity({
      type: "REACT_TO_UNITY_COMMAND",
      data: { command: "ResumeGame" },
    });
  };

  const requestCurrentSession = () => {
    postToUnity({
      type: "REACT_TO_UNITY_COMMAND",
      data: { command: "GetSessionStatus" },
    });
  };

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

  // On load, check if we already have mic permission (e.g. user granted earlier)
  useEffect(() => {
    if (typeof navigator?.permissions?.query !== "function") return;
    navigator.permissions.query({ name: "microphone" as PermissionName }).then(
      (status) => {
        if (status.state === "granted") setMediaStatus("granted");
      },
      () => {}
    );
  }, []);

  // Handle messages FROM Unity (iframe → React)
  useEffect(() => {
    const handleMessage = (event: MessageEvent<UnityMessage>) => {
      // Security: only accept messages from same origin
      if (event.origin !== window.location.origin) return;
      if (!event.data || typeof event.data !== "object") return;

      const { type, data } = event.data;
      if (!type) return;

      switch (type) {
        case "UNITY_READY":
          setUnityReady(Boolean((data as any)?.ready));
          setLastEvent("UNITY_READY");
          break;

        case "UNITY_SESSION_EVENT":
          // Session progress / summary from Unity
          console.log("UNITY_SESSION_EVENT", data);
          setLastEvent("UNITY_SESSION_EVENT");
          // You can optionally push this to React-side Firebase if desired
          break;

        case "UNITY_ANALYTICS_EVENT":
          console.log("UNITY_ANALYTICS_EVENT", data);
          setLastEvent(`UNITY_ANALYTICS_EVENT: ${(data as any)?.eventName ?? ""}`);
          break;

        case "UNITY_ERROR":
          console.error("UNITY_ERROR", data);
          setLastEvent(`UNITY_ERROR: ${(data as any)?.errorType ?? ""}`);
          break;

        case "UNITY_REQUEST_DATA":
          // Unity asking React for extra data (e.g. SSO profile, Firebase token, etc.)
          console.log("UNITY_REQUEST_DATA", data);
          // Example: respond with minimal stub; wire up real data later
          if ((data as any)?.requestType === "USER_PROFILE") {
            postToUnity({
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
          console.log("Unknown Unity message", event.data);
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [postToUnity]);

  return (
    <div style={{ height: "100%", overflow: "hidden", background: "#111", display: "flex", flexDirection: "column" }}>
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
          {mediaStatus === "idle" && (
            <>
              <span>Unity needs microphone (and optionally camera) access. Click to allow for this site.</span>
              <button
                type="button"
                onClick={handleRequestMedia}
                style={{ padding: "6px 14px", cursor: "pointer", fontWeight: 600 }}
              >
                Enable microphone & camera
              </button>
            </>
          )}
          {mediaStatus === "requesting" && <span>Requesting access… Check the browser prompt.</span>}
          {mediaStatus === "denied" && (
            <>
              <span>Access denied or unavailable. {mediaError && `(${mediaError})`}</span>
              <button type="button" onClick={handleRequestMedia} style={{ padding: "6px 14px", cursor: "pointer" }}>
                Try again
              </button>
            </>
          )}
        </div>
      )}
      <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
        <iframe
          ref={iframeRef}
          src="/unity/index.html"
          title="SPARC Unity WebGL"
          style={{
            border: "none",
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: 0,
          }}
          allow="microphone; camera; fullscreen"
        />
      </div>
    </div>
  );
};

export default SparcUnityPage;