# RAAYO Landing Page Integration

This folder contains the complete, self-contained RAAYO 3D WebGPU landing page.

## Included Files

- `index.html`: Hero UI layout, Space Grotesk / Inter typography, live market metrics, overlay logic, and action buttons.
- `scene.js`: Three.js WebGPU interactive 3D physics sphere field scene setup.
- `BallPhysicsGPU.js`: WebGPU compute shader physics simulation engine.
- `SphereGridAO.js`: WebGPU ambient occlusion rendering pass.

## Dependencies

The scene relies on Three.js WebGPU modules imported in `index.html`:
- `three/webgpu`
- `three/tsl`
- `three/addons/`

## Quick Integration Prompt for AI Agent

Copy this folder (`raayo-landing`) into your main application repository, open your main workspace in your AI editor, and send this prompt to the agent:

```
I have added the `raayo-landing` folder to this project. 
Please integrate the RAAYO 3D WebGPU landing page into our main app routing:
1. Mount or serve `raayo-landing/index.html` (and its WebGPU scene scripts) at the root route `/`.
2. Connect all 'Try Raayo Now' CTA buttons to navigate directly to our app's main route/dashboard (e.g. `/app` or `/dashboard`).
```
