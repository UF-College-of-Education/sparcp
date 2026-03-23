/**
 * These are shortcuts to format messages to Unity in the correct format.
 * 
 * @usage  In SparcUnityPage you'd call postToUnityRef.current?.(pauseSession()); to pause the session
 */

import type { OutboundUnityMessage } from "../types";

export const pauseSession = (): OutboundUnityMessage => ({
    type: "REACT_TO_UNITY_COMMAND",
    data: { command: "PauseGame" },
});

export const resumeSession = (): OutboundUnityMessage => ({
    type: "REACT_TO_UNITY_COMMAND",
    data: { command: "ResumeGame" },
});

export const requestCurrentSession = (): OutboundUnityMessage => ({
    type: "REACT_TO_UNITY_COMMAND",
    data: { command: "GetSessionStatus" },
});