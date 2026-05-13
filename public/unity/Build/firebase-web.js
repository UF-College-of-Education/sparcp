// Import Firebase SDKs
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";
  import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
  import { 
    initializeFirestore,
    getFirestore, 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    getDocs,
    addDoc,
    arrayUnion,
    updateDoc,
    deleteDoc,
    onSnapshot,
    connectFirestoreEmulator
  } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
  import { getStorage, ref, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-storage.js";
  import { getPerformance } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-performance.js";
  import { logEvent } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";

  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCWATbkuX7bEZCdFgMEeMHPa_Z0cDn3Wus",
    authDomain: "coe-med-sparc.firebaseapp.com",
    projectId: "coe-med-sparc",
    storageBucket: "coe-med-sparc.firebasestorage.app",
    messagingSenderId: "493414426893",
    appId: "1:493414426893:web:9f0e64dc0de5f01376a844",
    measurementId: "G-1Z7YE6X3JB"
  };

  // Browser compatibility check
  const isWebGLBuild = () => {
    return typeof window !== 'undefined' && window.location.protocol !== 'file:';
  };

  // Initialize Firebase services
  let app, auth, db, storage, analytics, performance;
  let isInitialized = false;
  let currentUser = null;
  // UID received from the React parent frame (used as userId in Firestore docs when set)
  let _parentUid = null;

  const initializeFirebaseServices = async () => {
    try {
      if (isInitialized) return;
      
      console.log('Initializing Firebase services...');
      
      // Initialize Firebase app
      app = initializeApp(firebaseConfig);
      
      // Initialize services with error handling
      if (isWebGLBuild()) {
        try {
          analytics = getAnalytics(app);
          console.log('Analytics initialized');
        } catch (error) {
          console.warn('Analytics initialization failed:', error.message);
        }

        try {
          performance = getPerformance(app);
          console.log('Performance monitoring initialized');
        } catch (error) {
          console.warn('Performance monitoring initialization failed:', error.message);
        }
      }

      // Initialize Auth
      try {
        auth = getAuth(app);
        console.log('Auth initialized');
        
        // Listen for auth state changes
        onAuthStateChanged(auth, (user) => {
          currentUser = user;
          if (user) {
            console.log('User signed in anonymously:', user.uid);
            // Notify Unity if callback exists
            if (window.unityInstance && window.firebaseAuthCallback) {
              window.firebaseAuthCallback(user.uid, 'signed_in');
            }
            // Notify React parent frame of Unity's Firebase user so it can track the session
            if (window.parent !== window) {
              window.parent.postMessage(
                { type: 'UNITY_FIREBASE_USER', uid: user.uid, isAnonymous: user.isAnonymous },
                window.location.origin || '*'
              );
            }
          } else {
            console.log('User signed out');
            if (window.unityInstance && window.firebaseAuthCallback) {
              window.firebaseAuthCallback('', 'signed_out');
            }
          }
        });
      } catch (error) {
        console.error('Auth initialization failed:', error);
      }

      // Initialize Firestore
      try {
        // Unity WebGL deployments behind certain proxies/load balancers can fail
        // Firestore WebChannel writes with credentialed CORS. Long-polling avoids that path.
        db = initializeFirestore(app, {
          experimentalForceLongPolling: true,
          useFetchStreams: false
        });
        console.log('Firestore initialized (long-polling mode)');
      } catch (error) {
        // If Firestore was already initialized elsewhere, fall back to existing instance.
        db = getFirestore(app);
        console.warn('Firestore reused existing instance:', error?.message || error);
      }

      // Initialize Storage
      try {
        storage = getStorage(app);
        console.log('Storage initialized');
      } catch (error) {
        console.warn('Storage initialization failed:', error?.message || error);
      }

      isInitialized = true;
      console.log('Firebase initialization complete');
      
      // Notify Unity that Firebase is ready
      if (window.unityInstance && window.firebaseReadyCallback) {
        window.firebaseReadyCallback();
      }

    } catch (error) {
      console.error('Firebase initialization failed:', error);
      throw error;
    }
  };

  // Global functions for Unity WebGL communication
  window.firebaseSignInAnonymously = async () => {
    try {
      if (!auth) throw new Error('Firebase Auth not initialized');
      
      const result = await signInAnonymously(auth);
      console.log('Anonymous sign-in successful:', result.user.uid);
      return result.user.uid;
    } catch (error) {
      console.error('Anonymous sign-in failed:', error);
      throw error;
    }
  };

  window.firebaseGetCurrentUser = () => {
    return currentUser ? currentUser.uid : null;
  };

  /**
   * Unity JsonUtility encodes Dictionary payloads as { items: [{ key, value }, ...] }.
   * Firestore bridge code expects flat keys (userInput, turnCount, etc.).
   */
  function expandUnityKeyedPayload(data) {
    if (data == null || typeof data !== 'object' || Array.isArray(data)) {
      return data;
    }
    const items = data.items;
    if (!Array.isArray(items) || items.length === 0) {
      return data;
    }
    const first = items[0];
    if (!first || typeof first !== 'object' || first.key === undefined) {
      return data;
    }
    const flat = { ...data };
    for (const it of items) {
      if (it && typeof it.key === 'string' && it.key.length > 0) {
        flat[it.key] = it.value;
      }
    }
    return flat;
  }

  // Firestore operations
  window.firebaseSetDocument = async (collectionPath, docId, data) => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      
      const docRef = doc(db, collectionPath, docId);
      const parsed = JSON.parse(data);
      // Session docs are also updated from JS (phaseCompletions, lastSeenAt, etc.).
      // A non-merge setDoc from Unity would wipe those fields — merge keeps them.
      if (collectionPath === 'sessions') {
        await setDoc(docRef, parsed, { merge: true });
      } else {
        await setDoc(docRef, parsed);
      }
      console.log('Document set successfully');
      return true;
    } catch (error) {
      console.error('Error setting document:', error);
      return false;
    }
  };

  window.firebaseGetDocument = async (collectionPath, docId) => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      
      const docRef = doc(db, collectionPath, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return JSON.stringify(docSnap.data());
      } else {
        console.log('No such document!');
        return null;
      }
    } catch (error) {
      console.error('Error getting document:', error);
      return null;
    }
  };

  window.firebaseAddDocument = async (collectionPath, data) => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      
      const collectionRef = collection(db, collectionPath);
      const docRef = await addDoc(collectionRef, JSON.parse(data));
      console.log('Document added with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding document:', error);
      return null;
    }
  };

  window.firebaseUpdateDocument = async (collectionPath, docId, data) => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      
      const docRef = doc(db, collectionPath, docId);
      await updateDoc(docRef, JSON.parse(data));
      console.log('Document updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating document:', error);
      return false;
    }
  };

  window.firebaseDeleteDocument = async (collectionPath, docId) => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      
      const docRef = doc(db, collectionPath, docId);
      await deleteDoc(docRef);
      console.log('Document deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      return false;
    }
  };

  window.firebaseGetCollection = async (collectionPath) => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      
      const querySnapshot = await getDocs(collection(db, collectionPath));
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({
          id: doc.id,
          data: doc.data()
        });
      });
      
      return JSON.stringify({ documents: documents });
    } catch (error) {
      console.error('Error getting collection:', error);
      return null;
    }
  };

  // Analytics functions
  window.firebaseLogEvent = (eventName, parameters = {}) => {
    try {
      if (typeof eventName === 'string' && eventName.toLowerCase() === 'mic_status') {
        return false;
      }
      if (analytics) {
        let parsedParameters = parameters;
        if (typeof parameters === 'string') {
          try {
            parsedParameters = JSON.parse(parameters);
          } catch (_error) {
            parsedParameters = {};
          }
        }

        // Unity JsonUtility often encodes dictionaries as { items: [{ key, value }, ...] }.
        // GA4 logEvent expects a flat map of string/number/boolean values.
        parsedParameters = expandUnityKeyedPayload(parsedParameters) || parsedParameters || {};

        logEvent(analytics, eventName, parsedParameters || {});
        console.log('Event logged:', eventName);
        return true;
      } else {
        console.warn('Analytics not available');
        return false;
      }
    } catch (error) {
      console.error('Error logging event:', error);
      return false;
    }
  };

  // Enhanced session analytics - stores rich structured data to Firestore
  // Used for capturing multi-turn conversations, scores, feedback, and complex session state
  const ensureSessionDocument = async (sessionId) => {
    if (!db) throw new Error('Firestore not initialized');
    if (!sessionId) throw new Error('Session ID required');

    const sessionRef = doc(db, 'sessions', sessionId);
    const existing = await getDoc(sessionRef);
    if (!existing.exists()) {
      await setDoc(sessionRef, {
        sessionId: sessionId,
        userId: _parentUid || currentUser?.uid || 'anonymous',
        status: 'active',
        createdAt: new Date().toISOString(),
        createdAtMs: Date.now(),
        startTime: new Date().toISOString()
      });
    } else {
      // Keep immutable fields (e.g. createdAt/userId) untouched to satisfy rules.
      await setDoc(sessionRef, {
        status: 'active',
        lastSeenAt: new Date().toISOString(),
        lastSeenAtMs: Date.now()
      }, { merge: true });
    }

    return sessionRef;
  };

  /** Merge arbitrary top-level fields into sessions/{id} (coach export, timestamps, etc.). */
  window.firebaseMergeSessionFields = async (sessionId, fieldsJson) => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      if (!sessionId) throw new Error('Session ID required');

      const parsed = typeof fieldsJson === 'string' ? JSON.parse(fieldsJson) : fieldsJson;
      const sessionRef = await ensureSessionDocument(sessionId);
      await setDoc(sessionRef, parsed, { merge: true });
      console.log('Session fields merged');
      return true;
    } catch (error) {
      console.error('Error merging session fields:', error);
      return false;
    }
  };

  /** Upload graded session JSON to Firebase Storage: graded_sessions/<fileName> */
  window.firebaseUploadSessionJson = async (sessionId, fileName, jsonPayload) => {
    try {
      if (!storage) throw new Error('Storage not initialized');
      if (!auth) throw new Error('Firebase Auth not initialized');
      if (!sessionId) throw new Error('Session ID required');
      if (!fileName) throw new Error('File name required');
      if (jsonPayload == null) throw new Error('JSON payload required');

      if (!auth.currentUser) {
        await signInAnonymously(auth);
      }

      const safeName = String(fileName).replace(/[^\w.\-]/g, "_");
      const objectPath = `graded_sessions/${safeName}`;
      const objectRef = ref(storage, objectPath);
      await uploadString(objectRef, String(jsonPayload), 'raw', { contentType: 'application/json' });

      let downloadUrl = '';
      try {
        downloadUrl = await getDownloadURL(objectRef);
      } catch (_urlErr) {
        downloadUrl = '';
      }

      console.log('Session JSON uploaded to Storage:', objectPath);
      return JSON.stringify({
        ok: true,
        path: objectPath,
        downloadUrl: downloadUrl,
        uploadedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error uploading session JSON:', error);
      return JSON.stringify({
        ok: false,
        error: error?.message || String(error)
      });
    }
  };

  /** Browser / device context for UX debugging (WebGL only; reads window/navigator/screen). */
  function collectClientTelemetry() {
    const nav = typeof navigator !== 'undefined' ? navigator : {};
    const win = typeof window !== 'undefined' ? window : {};
    const scr = typeof screen !== 'undefined' ? screen : {};
    let timeZone = '';
    try {
      timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    } catch (_e) {
      timeZone = '';
    }
    let connection = null;
    try {
      const c = nav.connection || nav.mozConnection || nav.webkitConnection;
      if (c) {
        connection = {
          effectiveType: c.effectiveType || null,
          downlink: typeof c.downlink === 'number' ? c.downlink : null,
          rtt: typeof c.rtt === 'number' ? c.rtt : null,
          saveData: !!c.saveData
        };
      }
    } catch (_e) {
      connection = null;
    }
    return {
      collectedAt: new Date().toISOString(),
      collectedAtMs: Date.now(),
      userAgent: nav.userAgent || '',
      platform: nav.platform || '',
      language: nav.language || '',
      languages: Array.isArray(nav.languages) ? [...nav.languages] : [],
      hardwareConcurrency: typeof nav.hardwareConcurrency === 'number' ? nav.hardwareConcurrency : null,
      deviceMemory: typeof nav.deviceMemory === 'number' ? nav.deviceMemory : null,
      maxTouchPoints: typeof nav.maxTouchPoints === 'number' ? nav.maxTouchPoints : null,
      cookieEnabled: typeof nav.cookieEnabled === 'boolean' ? nav.cookieEnabled : null,
      onLine: typeof nav.onLine === 'boolean' ? nav.onLine : null,
      pdfViewerEnabled: typeof nav.pdfViewerEnabled === 'boolean' ? nav.pdfViewerEnabled : null,
      screenWidth: typeof scr.width === 'number' ? scr.width : null,
      screenHeight: typeof scr.height === 'number' ? scr.height : null,
      screenAvailWidth: typeof scr.availWidth === 'number' ? scr.availWidth : null,
      screenAvailHeight: typeof scr.availHeight === 'number' ? scr.availHeight : null,
      screenColorDepth: typeof scr.colorDepth === 'number' ? scr.colorDepth : null,
      screenPixelDepth: typeof scr.pixelDepth === 'number' ? scr.pixelDepth : null,
      devicePixelRatio: typeof win.devicePixelRatio === 'number' ? win.devicePixelRatio : null,
      innerWidth: typeof win.innerWidth === 'number' ? win.innerWidth : null,
      innerHeight: typeof win.innerHeight === 'number' ? win.innerHeight : null,
      outerWidth: typeof win.outerWidth === 'number' ? win.outerWidth : null,
      outerHeight: typeof win.outerHeight === 'number' ? win.outerHeight : null,
      visualViewportWidth: win.visualViewport && typeof win.visualViewport.width === 'number' ? win.visualViewport.width : null,
      visualViewportHeight: win.visualViewport && typeof win.visualViewport.height === 'number' ? win.visualViewport.height : null,
      visualViewportScale: win.visualViewport && typeof win.visualViewport.scale === 'number' ? win.visualViewport.scale : null,
      timezone: timeZone,
      timezoneOffsetMinutes: new Date().getTimezoneOffset(),
      referrer: typeof document !== 'undefined' && document.referrer ? document.referrer : '',
      documentWidth: typeof document !== 'undefined' && document.documentElement ? document.documentElement.clientWidth : null,
      documentHeight: typeof document !== 'undefined' && document.documentElement ? document.documentElement.clientHeight : null,
      connection
    };
  }

  /** Merge client/browser/screen telemetry into sessions/{sessionId} (merge-safe). */
  window.firebaseMergeClientTelemetry = async (sessionId) => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      if (!sessionId) throw new Error('Session ID required');

      const sessionRef = await ensureSessionDocument(sessionId);
      const telemetry = collectClientTelemetry();
      await setDoc(sessionRef, {
        clientTelemetry: telemetry,
        clientTelemetryUpdatedAt: new Date().toISOString(),
        clientTelemetryUpdatedAtMs: Date.now()
      }, { merge: true });
      console.log('Client telemetry merged for session', sessionId);
      return true;
    } catch (error) {
      console.error('Error merging client telemetry:', error);
      return false;
    }
  };

  /** Append one agent / navigator console line (arrayUnion — survives Unity JsonUtility snapshot gaps). */
  window.firebaseAppendAgentConsoleDiagnostic = async (sessionId, message, severity, createdAtMs) => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      if (!sessionId) throw new Error('Session ID required');

      const sessionRef = await ensureSessionDocument(sessionId);
      const ms = Number(createdAtMs);
      const entry = {
        message: String(message ?? ''),
        severity: String(severity ?? 'Log'),
        createdAt: Number.isFinite(ms) ? ms : Date.now()
      };
      await setDoc(sessionRef, {
        agentConsoleDiagnostics: arrayUnion(entry)
      }, { merge: true });
      console.log('Agent console diagnostic appended');
      return true;
    } catch (error) {
      console.error('Error appending agent console diagnostic:', error);
      return false;
    }
  };

  window.firebaseLogSessionAnalytics = async (sessionId, eventName, eventData = {}) => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      if (!sessionId) throw new Error('Session ID required');

      // Parse eventData if it's a string
      let parsedData = eventData;
      if (typeof eventData === 'string') {
        try {
          parsedData = JSON.parse(eventData);
        } catch (_error) {
          console.warn('Could not parse event data as JSON, storing as string');
          parsedData = { rawData: eventData };
        }
      }
      parsedData = expandUnityKeyedPayload(parsedData);

      const eventDocument = {
        eventName: eventName,
        timestamp: new Date().toISOString(),
        timestampMs: Date.now(),
        data: parsedData
      };

      const sessionRef = await ensureSessionDocument(sessionId);
      await setDoc(sessionRef, { sessionEvents: arrayUnion(eventDocument) }, { merge: true });
      console.log(`Session event logged: ${eventName}`);
      return true;
    } catch (error) {
      console.error('Error logging session analytics:', error);
      return null;
    }
  };

  // Log a complete practice turn (for rich turn-by-turn tracking)
  // Captures user input, agent response, scores, and feedback in one document
  window.firebaseLogPracticeTurn = async (sessionId, turnNumber, turnData = {}) => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      if (!sessionId) throw new Error('Session ID required');

      let parsedData = turnData;
      if (typeof turnData === 'string') {
        try {
          parsedData = JSON.parse(turnData);
        } catch (_error) {
          parsedData = { rawData: turnData };
        }
      }
      parsedData = expandUnityKeyedPayload(parsedData) || parsedData;

      const userInputRaw = parsedData.userInput || parsedData.userTranscript || '';
      const agentResponseRaw = parsedData.agentResponse || '';

      const turnDocument = {
        turnNumber: turnNumber,
        timestamp: new Date().toISOString(),
        timestampMs: Date.now(),
        userInput: userInputRaw || '',
        agentResponse: agentResponseRaw || '',
        scores: parsedData.scores || {},
        feedback: parsedData.feedback || {},
        phaseInfo: parsedData.phaseInfo || {},
        additionalData: parsedData
      };
      
      const sessionRef = await ensureSessionDocument(sessionId);

      const historyAdds = [];
      const userInput = userInputRaw || '';
      const agentResponse = agentResponseRaw || '';
      if (userInput && String(userInput).trim().length > 0) {
        historyAdds.push({ role: 'user', content: String(userInput) });
      }
      if (agentResponse && String(agentResponse).trim().length > 0) {
        historyAdds.push({ role: 'assistant', content: String(agentResponse) });
      }

      const updateData = {
        practiceTurns: arrayUnion(turnDocument)
      };
      if (historyAdds.length > 0) {
        updateData.conversationHistory = arrayUnion(...historyAdds);
      }

      await setDoc(sessionRef, updateData, { merge: true });
      console.log(`Practice turn logged: Turn ${turnNumber}`);
      return true;
    } catch (error) {
      console.error('Error logging practice turn:', error);
      return null;
    }
  };

  // Log phase completion with comprehensive metrics
  window.firebaseLogPhaseCompletion = async (sessionId, phaseName, phaseData = {}) => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      if (!sessionId) throw new Error('Session ID required');

      let parsedData = phaseData;
      if (typeof phaseData === 'string') {
        try {
          parsedData = JSON.parse(phaseData);
        } catch (_error) {
          parsedData = { rawData: phaseData };
        }
      }
      parsedData = expandUnityKeyedPayload(parsedData) || parsedData;

      const turnCountRaw = parsedData.turnCount;
      const turnCountNum =
        typeof turnCountRaw === 'string' ? parseInt(turnCountRaw, 10) : Number(turnCountRaw);
      const overallRaw = parsedData.overallScore ?? parsedData.score;
      const overallNum =
        typeof overallRaw === 'string' ? parseFloat(overallRaw) : Number(overallRaw);

      let cLear = parsedData.cLearScores;
      if (cLear == null || cLear === '') {
        cLear = {};
      } else if (typeof cLear === 'string') {
        try {
          cLear = JSON.parse(cLear);
        } catch (_e) {
          cLear = { raw: cLear };
        }
      }
      if (typeof cLear !== 'object' || cLear === null || Array.isArray(cLear)) {
        cLear = {};
      }

      // Unity rubric JSON uses "summary" for coach prose; dashboards often read "feedback".
      if (!Array.isArray(cLear)) {
        const rubricSummary = typeof cLear.summary === 'string' ? cLear.summary.trim() : '';
        if (rubricSummary) {
          const existingFb = typeof cLear.feedback === 'string' ? cLear.feedback.trim() : '';
          cLear.feedback = existingFb || rubricSummary;
        }
      }

      const summaryFromClears =
        cLear && typeof cLear.summary === 'string' ? cLear.summary.trim() : '';
      const topFeedback =
        (typeof parsedData.feedback === 'string' && parsedData.feedback.trim()) ||
        (typeof parsedData.summary === 'string' && parsedData.summary.trim()) ||
        summaryFromClears ||
        '';

      const phaseDocument = {
        phaseName: phaseName,
        timestamp: new Date().toISOString(),
        timestampMs: Date.now(),
        completedAt: new Date().toISOString(),
        turnCount: Number.isFinite(turnCountNum) ? turnCountNum : 0,
        overallScore: Number.isFinite(overallNum) ? overallNum : 0,
        cLearScores: cLear,
        feedback: topFeedback,
        conversationHistory: parsedData.conversationHistory || [],
        additionalMetrics: parsedData
      };
      
      // Normalize conversationHistory into the same {role, content} shape as Unity.
      const rawPhaseConversation = Array.isArray(parsedData.conversationHistory)
        ? parsedData.conversationHistory
        : [];
      const normalizedConversation = rawPhaseConversation
        .map((entry) => {
          if (!entry) return null;
          if (typeof entry === 'string') {
            return { role: 'user', content: entry };
          }
          const role = entry.role ?? entry.sender ?? 'user';
          const content = entry.content ?? entry.text ?? entry.message ?? '';
          if (!content && content !== '') return null;
          return { role, content: String(content) };
        })
        .filter(Boolean);

      // Avoid duplicating large blobs twice inside additionalMetrics.
      const additionalMetrics = { ...parsedData };
      delete additionalMetrics.conversationHistory;
      delete additionalMetrics.cLearScores;
      delete additionalMetrics.summary;

      const sessionRef = await ensureSessionDocument(sessionId);
      const updateData = {
        phaseCompletions: arrayUnion({
          ...phaseDocument,
          additionalMetrics
        })
      };
      if (normalizedConversation.length > 0) {
        updateData.conversationHistory = arrayUnion(...normalizedConversation);
      }

      await setDoc(sessionRef, updateData, { merge: true });

      console.log(`Phase completion logged: ${phaseName}`);
      return true;
    } catch (error) {
      console.error('Error logging phase completion:', error);
      return null;
    }
  };

  // Update session metadata (high-level session info)
  window.firebaseUpdateSessionMetadata = async (sessionId, metadataData = {}) => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      if (!sessionId) throw new Error('Session ID required');

      let parsedData = metadataData;
      if (typeof metadataData === 'string') {
        try {
          parsedData = JSON.parse(metadataData);
        } catch (_error) {
          parsedData = { rawData: metadataData };
        }
      }
      parsedData = expandUnityKeyedPayload(parsedData) || parsedData;

      const sessionRef = await ensureSessionDocument(sessionId);
      
      const updateData = {
        lastUpdated: new Date().toISOString(),
        lastUpdatedMs: Date.now(),
        ...parsedData
      };

      await setDoc(sessionRef, updateData, { merge: true });
      console.log(`Session metadata updated for ${sessionId}`);
      return true;
    } catch (error) {
      console.error('Error updating session metadata:', error);
      return false;
    }
  };

  // Connection monitoring
  window.firebaseIsOnline = () => {
    return navigator.onLine;
  };

  // Create a new session document with initial metadata
  window.firebaseCreateSession = async (sessionId, sessionData = {}) => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      if (!sessionId) throw new Error('Session ID required');

      let parsedData = sessionData;
      if (typeof sessionData === 'string') {
        try {
          parsedData = JSON.parse(sessionData);
        } catch (_error) {
          parsedData = {};
        }
      }

      const sessionRef = doc(db, 'sessions', sessionId);
      
      const sessionDocument = {
        sessionId: sessionId,
        createdAt: new Date().toISOString(),
        createdAtMs: Date.now(),
        startTime: new Date().toISOString(),
        status: 'active',
        userId: currentUser?.uid || 'anonymous',
        ...parsedData
      };

      await setDoc(sessionRef, sessionDocument);
      console.log(`Session created: ${sessionId}`);
      // Notify React parent frame of the newly created Unity session ID
      if (window.parent !== window) {
        window.parent.postMessage(
          { type: 'UNITY_SESSION_CREATED', sessionId, uid: currentUser?.uid },
          window.location.origin || '*'
        );
      }
      return true;
    } catch (error) {
      console.error('Error creating session:', error);
      return false;
    }
  };

  // Close/complete a session
  window.firebaseCompleteSession = async (sessionId, completionData = {}) => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      if (!sessionId) throw new Error('Session ID required');

      let parsedData = completionData;
      if (typeof completionData === 'string') {
        try {
          parsedData = JSON.parse(completionData);
        } catch (_error) {
          parsedData = {};
        }
      }

      const sessionRef = await ensureSessionDocument(sessionId);
      
      const updateData = {
        status: 'completed',
        completedAt: new Date().toISOString(),
        completedAtMs: Date.now(),
        ...parsedData
      };

      await setDoc(sessionRef, updateData, { merge: true });
      console.log(`Session completed: ${sessionId}`);
      return true;
    } catch (error) {
      console.error('Error completing session:', error);
      return false;
    }
  };

  // Cleanup function
  window.firebaseCleanup = () => {
    try {
      // Clear auth listeners and reset state
      currentUser = null;
      isInitialized = false;
      console.log('Firebase cleanup completed');
    } catch (error) {
      console.error('Firebase cleanup failed:', error);
    }
  };

  // Auto-initialize when script loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFirebaseServices);
  } else {
    initializeFirebaseServices();
  }

  // Handle page visibility changes for performance optimization
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      console.log('Page hidden - Firebase services may throttle');
    } else {
      console.log('Page visible - Firebase services active');
    }
  });

  // Export for debugging (if needed)
  window.firebaseDebug = {
    app: () => app,
    auth: () => auth,
    db: () => db,
    analytics: () => analytics,
    performance: () => performance,
    isInitialized: () => isInitialized,
    currentUser: () => currentUser
  };

  // =============================================================================
  // REACT COMMUNICATION BRIDGE EXTENSIONS
  // =============================================================================

  // Bridge functions for Unity-React communication
  window.unityReactBridge = {
    // Forward Unity session events to React
    forwardSessionEvent: (eventType, eventData) => {
      if (window.ReactUnityBridge) {
        switch (eventType) {
          case 'session_start':
            window.ReactUnityBridge.onSessionStart(JSON.stringify(eventData));
            break;
          case 'session_end':
            window.ReactUnityBridge.onSessionEnd(JSON.stringify(eventData));
            break;
          case 'session_update':
            window.ReactUnityBridge.onSessionUpdate(JSON.stringify(eventData));
            break;
          default:
            console.warn('Unknown session event type:', eventType);
        }
      }
    },

    // Forward Unity analytics events to React and Firebase
    forwardAnalyticsEvent: (eventName, eventData) => {
      try {
        if (typeof eventName === 'string' && eventName.toLowerCase() === 'mic_status') {
          return;
        }
        let payload = eventData || {};
        if (typeof payload === 'string') {
          try {
            payload = JSON.parse(payload);
          } catch (_e) {
            payload = {};
          }
        }
        payload = expandUnityKeyedPayload(payload) || payload;

        // Log to Firebase Analytics
        if (analytics) {
          logEvent(analytics, eventName, payload);
        }

        // Forward to React
        if (window.ReactUnityBridge && window.ReactUnityBridge.onAnalyticsEvent) {
          window.ReactUnityBridge.onAnalyticsEvent(eventName, JSON.stringify(payload));
        }
      } catch (error) {
        console.error('Error forwarding analytics event:', error);
      }
    },

    // Handle data requests from Unity
    handleDataRequest: (requestType, requestId, parameters) => {
      if (window.ReactUnityBridge) {
        // Forward request to React
        const requestData = {
          requestType: requestType,
          requestId: requestId,
          parameters: parameters
        };

        if (window.parent !== window) {
          window.parent.postMessage({
            type: 'UNITY_REQUEST_DATA',
            data: requestData
          }, '*');
        }
      }
    },

    // Provide Firebase data directly to Unity
    getFirebaseData: async (dataType, parameters) => {
      try {
        switch (dataType) {
          case 'current_user':
            return currentUser ? currentUser.uid : null;

          case 'auth_token':
            if (currentUser) {
              return await currentUser.getIdToken();
            }
            return null;

          case 'user_document':
            if (db && currentUser) {
              const userDoc = await firebaseGetDocument('users', currentUser.uid);
              return userDoc;
            }
            return null;

          default:
            console.warn('Unknown Firebase data type requested:', dataType);
            return null;
        }
      } catch (error) {
        console.error('Error getting Firebase data:', error);
        return null;
      }
    }
  };

  // Enhanced callback functions for Unity
  window.firebaseAuthCallback = (userId, authState) => {
    console.log('Firebase auth state changed:', authState, userId);
    
    // Notify React if available
    if (window.ReactUnityBridge && window.ReactUnityBridge.onAuthStateChange) {
      window.ReactUnityBridge.onAuthStateChange({
        userId: userId,
        authState: authState,
        timestamp: new Date().toISOString()
      });
    }
  };

  window.firebaseReadyCallback = () => {
    console.log('Firebase is ready');
    
    // Notify React if available
    if (window.ReactUnityBridge && window.ReactUnityBridge.onFirebaseReady) {
      window.ReactUnityBridge.onFirebaseReady();
    }
  };

  // Listen for messages from React to Unity
  window.addEventListener('message', (event) => {
    // Validate origin for security
    if (event.origin !== window.location.origin) {
      return;
    }

    try {
      const { type, data } = event.data;

      switch (type) {
        case 'REACT_TO_UNITY_AUTH':
          // Store React parent's UID so Firestore session docs use the correct userId
          if (data && data.uid) {
            _parentUid = data.uid;
            console.log('[Firebase-Bridge] Parent UID received:', _parentUid);
          }
          break;

        case 'FIREBASE_PARENT_AUTH_TOKEN':
          // React parent sends its Firebase UID and optionally a custom token to sign in as same user
          if (data && data.uid) {
            _parentUid = data.uid;
            console.log('[Firebase-Bridge] Parent auth token received, uid:', _parentUid);
          }
          if (data && data.customToken && auth) {
            signInWithCustomToken(auth, data.customToken)
              .then((cred) => console.log('[Firebase-Bridge] Signed in with parent custom token:', cred.user.uid))
              .catch((err) => console.warn('[Firebase-Bridge] Custom token sign-in failed (non-critical):', err.message));
          }
          break;

        case 'REACT_TO_UNITY_SESSION':
          // Handle session data from React to Unity
          if (window.unityInstance && data.sessionData) {
            // Forward to Unity via SendMessage if instance is available
          }
          break;

        case 'REACT_TO_UNITY_COMMAND':
          // Handle commands from React to Unity (pause, resume, etc.)
          if (window.unityInstance && data.command) {
            // Forward command to Unity
          }
          break;

        default:
          // Ignore unknown message types
          break;
      }
    } catch (error) {
      console.error('Error processing message from React:', error);
    }
  });

  // Enhanced Firebase operations with React integration
  window.firebaseSetDocumentWithCallback = async (collectionPath, docId, data, callback) => {
    try {
      const success = await window.firebaseSetDocument(collectionPath, docId, data);
      
      // Notify React of the operation result
      if (window.ReactUnityBridge && window.ReactUnityBridge.onFirestoreOperation) {
        window.ReactUnityBridge.onFirestoreOperation({
          operation: 'set',
          collection: collectionPath,
          document: docId,
          success: success,
          timestamp: new Date().toISOString()
        });
      }
      
      if (callback) callback(success);
      return success;
    } catch (error) {
      console.error('Enhanced set document failed:', error);
      if (callback) callback(false);
      return false;
    }
  };

  window.firebaseGetDocumentWithCallback = async (collectionPath, docId, callback) => {
    try {
      const result = await window.firebaseGetDocument(collectionPath, docId);
      
      // Notify React of the operation result
      if (window.ReactUnityBridge && window.ReactUnityBridge.onFirestoreOperation) {
        window.ReactUnityBridge.onFirestoreOperation({
          operation: 'get',
          collection: collectionPath,
          document: docId,
          success: !!result,
          timestamp: new Date().toISOString()
        });
      }
      
      if (callback) callback(result);
      return result;
    } catch (error) {
      console.error('Enhanced get document failed:', error);
      if (callback) callback(null);
      return null;
    }
  };

  // Initialize React bridge when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('Firebase-React bridge initialized');
    });
  } else {
    console.log('Firebase-React bridge initialized');
  }