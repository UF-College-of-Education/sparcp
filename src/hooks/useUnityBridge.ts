import { useCallback, useEffect, useRef } from "react";
import type { RefObject } from "react";
import type { InboundUnityMessage, OutboundUnityMessage } from "../types";

export default function useUnityBridge(
    iframeRef: RefObject<HTMLIFrameElement | null>,
    onMessage: (msg: InboundUnityMessage) => void
) {
    // LISTEN FOR MESSAGES FROM UNITY
    // Ref keeps the listener stable while always calling the latest onMessage
    const onMessageRef = useRef(onMessage);
    useEffect(() => { onMessageRef.current = onMessage; });

    useEffect(() => {
        const handler = (event: MessageEvent<InboundUnityMessage>) => {
            // Ensure messages come from same origin
            if (event.origin !== window.location.origin) return;
            if (!event.data || typeof event.data !== "object") return;
            if (!event.data.type) return;
            onMessageRef.current(event.data);
        };
        window.addEventListener("message", handler);
        return () => window.removeEventListener("message", handler);
    }, []);

    // SENDS EVENTS TO UNITY
    return useCallback((payload: OutboundUnityMessage) => {
        const iframe = iframeRef.current;
        if (!iframe?.contentWindow) return;
        iframe.contentWindow.postMessage(payload, window.location.origin);
    }, [iframeRef]);
}
