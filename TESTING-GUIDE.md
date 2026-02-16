# Unity WebGL React Integration Testing Guide

## Prerequisites

Before testing, ensure you have completed:

1. ✅ Created `.jslib` files in Unity project
2. ✅ Built Unity WebGL (or will rebuild with API keys)
3. ✅ Copied build to `public/unity/` folder
4. ✅ Added Unity navigation button to React app
5. ✅ Configured API keys in Unity (see `SETUP-API-KEYS.md`)

## Testing Checklist

### Phase 1: Basic Integration

#### 1.1 Start the React Development Server

```powershell
cd "C:\Users\jayrosen\Desktop\Unity\SPARC-P Builds\sparcp-main"
npm run dev
```

Expected output:
```
VITE v5.x.x ready in xxx ms
➜ Local:   http://localhost:5173/
```

#### 1.2 Open the Application

1. Open Chrome or Edge browser
2. Navigate to `http://localhost:5173`
3. ✅ Verify: React app loads without errors
4. ✅ Verify: Navigation sidebar appears on the left

#### 1.3 Navigate to Unity Practice

1. Click "Unity Practice" button in the navigation (Gamepad icon)
2. ✅ Verify: Page transitions to Unity view
3. ✅ Verify: Iframe loads Unity WebGL app
4. ✅ Verify: Unity canvas appears (black background with 3D scene)
5. ✅ Verify: No console errors (press F12 to open DevTools)

**Common Issues:**

- **Iframe shows 404**: Build not copied to `public/unity/` correctly
  - Run: `.\copy-build-to-react.ps1` from SPARC-P Builds folder
- **Blank iframe**: Check browser console for errors
  - Look for CORS, file not found, or MIME type errors

### Phase 2: Unity Initialization

#### 2.1 Unity Loading

1. Watch the Unity loading progress
2. ✅ Verify: Loading bar appears and progresses
3. ✅ Verify: Loading completes without errors
4. ✅ Verify: 3D scene becomes interactive

**Expected Console Messages:**

```
[PostMessageBridge] Initialized. In iframe: true
[PostMessageBridge] Sending to React: {type: "UNITY_READY", data: {...}}
```

#### 2.2 React Communication

1. Open browser DevTools (F12)
2. Check Console tab
3. ✅ Verify: `UNITY_READY` message received by React
4. ✅ Verify: Status shows "Unity ready: yes" in sidebar

**Expected in React Console:**

```javascript
UNITY_READY {ready: true, timestamp: "..."}
```

### Phase 3: Microphone Access

#### 3.1 Microphone Permission

1. Wait for Unity to fully load
2. ✅ Verify: Browser prompts for microphone permission
3. Click "Allow" on the permission prompt
4. ✅ Verify: No errors in console after granting permission

**If no prompt appears:**

- Check if permission was already granted/denied
- Chrome: Click padlock icon → Site settings → Microphone
- Reset permission and reload page

#### 3.2 Microphone Capture

**Expected Console Messages:**

```
[WebGLMic] Starting microphone with sample rate: 16000
[WebGLMic] Microphone access granted
```

**If microphone fails:**

- Check browser console for error messages
- Verify `WebGLMicrophone.jslib` exists in Unity project
- Rebuild Unity if `.jslib` was added after last build
- Try a different browser (Chrome recommended)

### Phase 4: Speech Recognition (Recognissimo)

#### 4.1 Test Speech-to-Text

1. Speak clearly into the microphone
2. Say: "Hello, my name is [your name]"
3. ✅ Verify: Transcription appears in Unity UI
4. ✅ Verify: Text updates in real-time (partial results)
5. ✅ Verify: Final transcript is accurate

**Expected Behavior:**

- Partial transcripts update as you speak
- Final transcript appears after silence pause
- Recognissimo processes speech locally (no network calls)

**Troubleshooting:**

- **No transcription**: Check microphone is working (test in Windows settings)
- **Garbled text**: Speak more clearly, reduce background noise
- **Slow processing**: Increase Unity memory size in Player Settings
- **Missing files**: Verify `StreamingAssets/` folder copied correctly

### Phase 5: AI Chat (Navigator API)

#### 5.1 Test LLM Response

1. Complete a full spoken input (wait for final transcript)
2. ✅ Verify: Loading indicator appears in Unity
3. ✅ Verify: Network request to `api.ai.it.ufl.edu` appears in DevTools Network tab
4. ✅ Verify: AI response appears as text in Unity UI
5. ✅ Verify: Response is contextually appropriate

**Check Network Tab:**

1. Open DevTools → Network tab
2. Filter by "api.ai.it.ufl.edu"
3. ✅ Verify: Request shows status 200 (success)
4. ✅ Verify: Response contains "choices" array with content

**If API call fails:**

- **401 Unauthorized**: API key not configured or invalid
  - Open Unity → Create/update ApiKeys asset → Rebuild
- **403 Forbidden**: API key lacks permissions
  - Regenerate key at https://api.ai.it.ufl.edu
- **Network error**: Check internet connection
- **CORS error**: Should NOT occur (api.ai.it.ufl.edu has CORS enabled)

#### 5.2 Verify API Key Configuration

**In Unity Editor** (before building):

1. Navigate to `Assets/Resources/Secrets/`
2. Select `ApiKeys.asset`
3. ✅ Verify: Keys are filled (not placeholders)
4. ✅ Verify: Keys match your real API keys

### Phase 6: Text-to-Speech (ElevenLabs)

#### 6.1 Test Audio Playback

1. Wait for AI response to appear
2. ✅ Verify: Audio automatically plays
3. ✅ Verify: Voice matches agent persona (Anne/Maya)
4. ✅ Verify: Audio is clear and natural
5. ✅ Verify: Lip sync animation matches audio (if implemented)

**Check Network Tab:**

1. Filter by "api.elevenlabs.io"
2. ✅ Verify: TTS request shows status 200
3. ✅ Verify: Response is audio data (content-type: audio/mpeg)

**If audio fails:**

- **No audio**: Check volume, browser audio not muted
- **401 error**: ElevenLabs API key invalid
  - Update ApiKeys.asset → Rebuild Unity
- **429 error**: Rate limit exceeded
  - Wait or upgrade ElevenLabs plan
- **Audio stutters**: Increase browser memory or close other tabs

### Phase 7: React Controls (Optional)

#### 7.1 Test React → Unity Communication

1. Use buttons in React sidebar (Pause, Resume, Get Status)
2. ✅ Verify: Unity responds to commands
3. ✅ Verify: Console shows postMessage events

**Expected Console Output:**

```javascript
// When clicking "Pause Session"
[PostMessageBridge] Received from React: {"type":"REACT_TO_UNITY_COMMAND","data":{"command":"PauseGame"}}
```

#### 7.2 Test Unity → React Events

1. Perform actions in Unity (complete dialogue, errors, etc.)
2. ✅ Verify: React sidebar updates
3. ✅ Verify: Events logged in console

**Expected Events:**

- `UNITY_SESSION_EVENT`: Session progress updates
- `UNITY_ANALYTICS_EVENT`: User interactions
- `UNITY_ERROR`: Any errors from Unity

### Phase 8: Full Conversation Flow

#### 8.1 End-to-End Test

1. Start with Unity loaded and microphone active
2. Speak a greeting: "Hello, how are you?"
3. ✅ Verify: Speech recognized
4. ✅ Verify: AI responds appropriately
5. ✅ Verify: TTS plays response
6. Continue conversation for 3-4 turns
7. ✅ Verify: Context maintained across turns
8. ✅ Verify: No memory leaks or performance degradation

**Performance Expectations:**

- Speech recognition: < 1 second latency
- LLM response: 1-3 seconds
- TTS generation: 1-2 seconds
- Total turn time: 3-6 seconds

### Phase 9: Browser Compatibility

Test in multiple browsers:

#### 9.1 Chrome/Edge (Chromium)

- ✅ Full feature support expected
- ✅ Best WebGL performance
- ✅ Microphone works on localhost

#### 9.2 Firefox

- ✅ WebGL supported
- ✅ May have slightly lower performance
- ✅ Microphone works on localhost

#### 9.3 Safari (macOS/iOS)

- ⚠️ WebGL limitations possible
- ⚠️ Audio autoplay restrictions
- ⚠️ Microphone requires HTTPS (except localhost)

## Troubleshooting Guide

### Unity Not Loading

**Symptoms**: Blank iframe, loading stuck, or errors

**Solutions**:
1. Check browser console for specific errors
2. Verify all build files in `public/unity/`
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try incognito/private mode
5. Rebuild Unity with higher memory settings

### Microphone Not Working

**Symptoms**: No permission prompt, or permission granted but no audio

**Solutions**:
1. Check OS microphone permissions (Windows Settings)
2. Check browser microphone permissions (site settings)
3. Test microphone in Windows Voice Recorder
4. Verify `WebGLMicrophone.jslib` in Unity project
5. Check console for WebGLMic errors
6. Rebuild Unity if .jslib added after build

### Speech Recognition Not Working

**Symptoms**: No transcription, or garbled text

**Solutions**:
1. Verify microphone is capturing (check WebGLMic messages)
2. Check `StreamingAssets/` folder contains Recognissimo models
3. Speak clearly with minimal background noise
4. Increase Unity memory size (Player Settings)
5. Check browser console for Recognissimo errors

### API Calls Failing

**Symptoms**: 401, 403, or network errors

**Solutions**:
1. Verify API keys in Unity `ApiKeys.asset`
2. Test keys using curl or Postman
3. Regenerate keys if invalid/expired
4. Rebuild Unity after updating keys
5. Check network connectivity
6. Verify no firewall blocking requests

### Audio Not Playing

**Symptoms**: No sound despite successful TTS request

**Solutions**:
1. Check browser audio not muted
2. Check OS audio settings
3. Verify AudioSource component in Unity
4. Check browser console for audio errors
5. Test with different voice ID
6. Verify ElevenLabs API key

### React Communication Failing

**Symptoms**: postMessage events not working

**Solutions**:
1. Verify Unity is in iframe (`window.self !== window.top`)
2. Check `PostMessageBridge.jslib` exists
3. Rebuild Unity if .jslib added after build
4. Check console for PostMessageBridge messages
5. Verify origin validation not blocking messages

## Performance Optimization

### If App is Slow

1. **Browser**:
   - Close other tabs
   - Disable browser extensions
   - Use Chrome for best performance

2. **Unity**:
   - Reduce graphics quality
   - Disable unnecessary features
   - Increase memory size in build settings

3. **Network**:
   - Use Brotli compression
   - Enable caching
   - Test on fast connection

## Success Criteria

All green checkmarks indicate successful integration:

- ✅ Unity loads in React iframe
- ✅ Microphone permission granted and working
- ✅ Speech-to-text transcribes accurately
- ✅ Navigator API returns relevant responses
- ✅ ElevenLabs TTS plays audio
- ✅ React ↔ Unity postMessage communication works
- ✅ Full conversation flow is smooth
- ✅ No console errors during normal usage

## Next Steps After Testing

Once all tests pass:

1. **Configure Production Environment**:
   - Set up .env file with real API keys
   - Configure production URLs

2. **Deploy**:
   - Build React for production: `npm run build`
   - Serve `dist/` folder via web server
   - Ensure HTTPS for microphone on non-localhost

3. **Monitor**:
   - Check API usage/quotas
   - Monitor error logs
   - Gather user feedback

## Support Resources

- Unity WebGL: https://docs.unity3d.com/Manual/webgl.html
- Navigator API: https://api.ai.it.ufl.edu/docs
- ElevenLabs: https://elevenlabs.io/docs
- Recognissimo: Check Unity Asset Store documentation
- React: https://react.dev

## Reporting Issues

When reporting issues, include:

1. **Browser & Version**: Chrome 120, Firefox 121, etc.
2. **OS**: Windows 11, macOS 14, etc.
3. **Console Errors**: Full error messages from F12 console
4. **Network Tab**: Failed requests with status codes
5. **Steps to Reproduce**: Exact steps that cause the issue
6. **Expected vs Actual**: What should happen vs what happens
