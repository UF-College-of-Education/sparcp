# Unity WebGL Deployment Guide for SPARC-P

## Overview

This guide documents how to deploy Unity WebGL builds to the SPARC-P React application hosted on Vercel. The deployment uses a hybrid approach: small Unity runtime files (loader, framework) are hosted in the GitHub repository, while large binary files (`.wasm`, `.data`) are hosted on Firebase Storage to work around GitHub's 100MB file size limit.

## Architecture

- **Live Site**: https://sparcp-mu.vercel.app/
- **GitHub Repository**: https://github.com/UF-College-of-Education/sparcp
- **Firebase Storage**: https://console.firebase.google.com/project/coe-med-sparc/storage/coe-med-sparc.firebasestorage.app/files/~2Funity-build
- **Build Location**: `public/unity/` directory in the repository

## File Hosting Strategy

### Files in GitHub (< 1MB each)
- `*.loader.js` - Unity loader script
- `*.framework.js` - Unity framework runtime
- `index.html` - Unity WebGL player page
- `StreamingAssets/` - Unity streaming assets
- `TemplateData/` - Unity template resources

### Files in Firebase Storage (> 100MB)
- `*.wasm` - Compiled WebAssembly binary
- `*.data` - Unity asset bundle data

## Deploying a New Unity Build

### Step 1: Export Unity WebGL Build

1. In Unity Editor, go to **File → Build Settings**
2. Select **WebGL** platform
3. Click **Build** and choose an output directory
4. Unity will generate a folder containing:
   - `Build/` directory with `.loader.js`, `.framework.js`, `.wasm`, `.data` files
   - `index.html`
   - `StreamingAssets/` directory
   - `TemplateData/` directory

### Step 2: Upload Large Files to Firebase

1. Navigate to [Firebase Storage Console](https://console.firebase.google.com/project/coe-med-sparc/storage/coe-med-sparc.firebasestorage.app/files/~2Funity-build)

2. **Delete old build files**:
   - Remove the previous `.wasm` file
   - Remove the previous `.data` file

3. **Upload new build files**:
   - Upload the new `.wasm` file from `Build/` directory
   - Upload the new `.data` file from `Build/` directory

4. **Copy Firebase URLs**:
   - Click on each uploaded file name
   - Copy the blue hyperlinked URL
   - **Important**: Keep the `?alt=media&token=...` query parameters

   Example URLs:
   ```
   https://firebasestorage.googleapis.com/v0/b/coe-med-sparc.firebasestorage.app/o/unity-build%2F23819498d3556177e8f59dfcdb5f384a.wasm?alt=media&token=a38e1e4b-2dfd-4755-ba8c-0d9b323b721e
   
   https://firebasestorage.googleapis.com/v0/b/coe-med-sparc.firebasestorage.app/o/unity-build%2F4bd738edafcbd75a5094b1b60c6d26b3.data?alt=media&token=a928e1cb-b33e-49e7-a889-48294b442c3c
   ```

### Step 3: Update GitHub Repository

1. **Copy Unity build files** to `public/unity/` directory:
   - Replace `Build/*.loader.js`
   - Replace `Build/*.framework.js`
   - Replace `index.html`
   - Update `StreamingAssets/` if changed
   - Update `TemplateData/` if changed

2. **Update `public/unity/index.html`** with Firebase URLs:

   ```javascript
   createUnityInstance(document.querySelector("#unity-canvas"), {
     arguments: [],
     // Local path commented out - file hosted on Firebase
     //dataUrl: "Build/4bd738edafcbd75a5094b1b60c6d26b3.data",
     dataUrl: "https://firebasestorage.googleapis.com/v0/b/coe-med-sparc.firebasestorage.app/o/unity-build%2F4bd738edafcbd75a5094b1b60c6d26b3.data?alt=media&token=a928e1cb-b33e-49e7-a889-48294b442c3c",
     
     // Framework served from GitHub
     frameworkUrl: "Build/37bbbd21106198aa702f39371551353f.framework.js",
     
     // Local path commented out - file hosted on Firebase
     //codeUrl: "Build/23819498d3556177e8f59dfcdb5f384a.wasm",
     codeUrl: "https://firebasestorage.googleapis.com/v0/b/coe-med-sparc.firebasestorage.app/o/unity-build%2F23819498d3556177e8f59dfcdb5f384a.wasm?alt=media&token=a38e1e4b-2dfd-4755-ba8c-0d9b323b721e",
     
     streamingAssetsUrl: "StreamingAssets",
     companyName: "University of Florida",
     productName: "SPARC-P",
     productVersion: "0.0.1",
   }).then((unityInstance) => {
     // Unity loaded successfully
   }).catch((message) => {
     alert(message);
   });
   ```

   **Key Points**:
   - Replace `dataUrl` with new Firebase `.data` URL
   - Replace `codeUrl` with new Firebase `.wasm` URL
   - Update `frameworkUrl` filename if Unity changed the hash
   - Keep the loader script `<src>` tag updated in the HTML `<script>` tag

3. **Commit and push to GitHub**:
   ```bash
   git add public/unity/
   git commit -m "Update Unity WebGL build to version X.X.X"
   git push origin main
   ```

4. **Vercel automatically deploys** when changes are pushed to the `main` branch

## Git Configuration

The `.gitignore` is configured to exclude large Unity binaries:

```gitignore
# Unity WebGL build outputs: keep loader/framework in git, ignore large binaries
public/unity/Build/*.wasm
public/unity/Build/*.data
```

This ensures:
- ✅ Small loader/framework files are tracked in Git
- ❌ Large binary files never get committed (would cause push failures)

## Firebase CORS Configuration

Firebase Storage requires Cross-Origin Resource Sharing (CORS) configuration to allow the Vercel site to load Unity binaries.

**Current CORS policy** (configured in Google Cloud Platform):

```json
[
  {
    "origin": [
      "https://sparcp-mu.vercel.app",
      "https://localhost:5173"
    ],
    "method": ["GET", "HEAD", "OPTIONS"],
    "responseHeader": ["Content-Type", "Accept", "Origin"],
    "maxAgeSeconds": 3600
  }
]
```

### Updating CORS for New Domains

If deploying to a new URL (e.g., production domain, preview branches):

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select the `coe-med-sparc` project
3. Navigate to **Cloud Storage → Buckets → coe-med-sparc.firebasestorage.app**
4. Click **Permissions** tab
5. Update the CORS configuration to include new origins:
   ```json
   {
     "origin": [
       "https://sparcp-mu.vercel.app",
       "https://sparcp-production.vercel.app",
       "https://localhost:5173"
     ],
     "method": ["GET", "HEAD", "OPTIONS"],
     "responseHeader": ["Content-Type", "Accept", "Origin"],
     "maxAgeSeconds": 3600
   }
   ```

## React Integration

The Unity build is loaded via an iframe in the React application:

- **Component**: `src/components/pages/SparcUnityPage.tsx`
- **Unity Page**: `public/unity/index.html` (served at `/unity/index.html`)
- **Communication**: PostMessage API for React ↔ Unity messaging

The iframe is configured with:
```html
<iframe
  src="/unity/index.html"
  title="SPARC Unity WebGL"
  allow="microphone; camera; fullscreen"
/>
```

The React App contains a messaging system for sending messages to and receiving messages from the Unity app. 

### Message from Unity to React

On the SparcUnityPage component, the handleMessage callback is set up to handle incoming message with the following Syntax:

```{ type: "UNITY_MSG_TYPE_HERE"; data: { payload } }```

Currently it is set up to handle the following events:

* UNITY_READY
* UNITY_SESSION_EVENT
* UNITY_ANALYTICS_EVENT
* UNITY_ERROR
* UNITY_REQUEST_DATA

You can see info about the expected payload in the `src/types.ts` file under theIncomingUnityMessages type. If adding a new type of message, you will need to add a new case to the handleMessage callback and add the expected data shape as a clause in the IncomingUnityMessages type.

### Message From React to Unity

Messages to the Unity app are sent via the custom useUnityBridge hook. This hook expects a reference to the iframe containing the Unity app in React and a handler function to call when messages are received.

In the SparcUnityPage, we bind the Unity bridge to a postToUnity variable. You can then send messages to Unity by invoking postToUnity(). This value is what gets passed to Unity. Just be sure only to invoke it after line 102 where it's defined.

``` postToUnity( message ) ```

Like with the inbound messages, the message should follow the format defined in the OutboundUnityMessage type in `src/types.ts`. you should update the OutboundUnityMessage type definition according to fit the data you want to send. 

## Troubleshooting

### Error: `Failed to load resource: 404`

**Cause**: Unity runtime file (loader, framework) not in GitHub repository

**Solution**:
1. Verify files exist in `public/unity/Build/`
2. Ensure they're committed: `git status`
3. Check they're not in `.gitignore`
4. Push to GitHub and wait for Vercel deployment

### Error: `Uncaught ReferenceError: createUnityInstance is not defined`

**Cause**: Loader script failed to load (404 or incorrect path)

**Solution**:
1. Verify loader script `<src>` path in `public/unity/index.html`
2. Confirm file exists and is deployed
3. Check browser Network tab for exact failing URL

### Error: `Failed to load .wasm or .data file`

**Cause**: Firebase URL incorrect or CORS not configured

**Solution**:
1. Verify Firebase URLs in `index.html` include `?alt=media&token=...`
2. Test Firebase URL directly in browser (should download)
3. Check CORS configuration includes your domain
4. Verify files exist in Firebase Storage console

### Warning: `UnknownError: Failed to execute 'put' on 'Cache'`

**Cause**: Browser cache storage issue (usually quota or private browsing)

**Effect**: Unity will load but won't cache assets for faster subsequent loads

**Solution**: Usually safe to ignore; Users can clear browser cache or disable private browsing

## Version History

| Date | Unity Version | Build Hash | Notes |
|------|---------------|------------|-------|
| 2026-02-16 | 0.0.1 | 5f8feb76 | Initial deployment with Firebase hosting |

## References

- [Unity WebGL Documentation](https://docs.unity3d.com/Manual/webgl-building.html)
- [Firebase Storage CORS](https://firebase.google.com/docs/storage/web/download-files#cors_configuration)
- [Vercel Deployment Docs](https://vercel.com/docs)

---

**Last Updated**: February 16, 2026  
**Maintained By**: UF College of Education
