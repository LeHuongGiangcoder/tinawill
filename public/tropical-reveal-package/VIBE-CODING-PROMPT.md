# Paste this prompt into your coding tool

Implement a mobile-first wedding invitation reveal using the attached package. Read `scene-manifest.json`, `ANIMATION-GUIDE.vi.md`, and the working `index.html` / `demo.js` before changing anything. Keep the project’s existing framework and styling architecture.

The visual direction is a handmade, softly painted tropical collage seen directly from above. Use the supplied original PNG/WebP elements as-is. Do not redraw them, sharpen them, add artificial glow, invent extra fruit, or rearrange them into four symmetrical corners. Match the supplied approved references.

Build one fixed 1152×2048 artboard with layered botanical sprites. Read every instance from `scene-manifest.json`; `x`/`y` are sprite centers in native canvas pixels, `width` is pre-rotation width, rotation is already CSS degrees, and `flipX` is applied before rotation. Scale the artboard as a single unit. Do not individually apply cover/stretch to its images. Respect the manifest z-order, including paper behind foreground foliage.

Provide editable HTML invitation content and an accessible Open button on the paper. On click, play the manifest’s staggered 5-second drone-descent reveal once: fade the text and paper, slide the near foliage left/right first, then open the deeper canopy. Interpolate each sprite’s x/y/width/rotation/opacity using its closed/open poses and delay/duration. Use the manifest smootherstep easing, curved motion and subtle depth scaling. Use the smaller, less regular final banana-leaf layout from the manifest, not the dense closed-state bank layers. Prevent repeated clicks during the transition. Keep the camera orientation directly overhead, but lower its height using the explicit camera-world transform and depth motion below. No tilt, camera spin or bounce.

CRITICAL: the river must keep moving indefinitely after the reveal. Use ONLY the supplied seamless water-only tile for the animated river. Put two copies in a clipped vertical belt and continuously translate the belt by one tile height in 240 seconds, linear, infinite. The background must contain no baked ring or lanterns. Do not freeze at the final frame, synchronize flow to reveal progress, reverse the main flow at each loop, or reveal a static artwork-2 screenshot.

Render three lanterns and one ring as FOUR independent foreground nodes above water but below foliage. Use the supplied genuinely transparent object cutouts; the ring hole must show moving water. Their baseline positions, amplitudes, periods and phases are in the manifest. Apply the independent multi-frequency gentle drift used in `demo.js`; vary phase and period for each object. Do not move all four as one group. Keep their ambient clock running before/during/after reveal and when reveal progress is scrubbed or replayed. Allow very slow rotational drift, no object breathing or blinking.

Render the supplied transparent ripple marks beneath each floater, following the guide. Never move an opaque patch of old green water with a floater. Preserve soft handmade edges and the original palette.

Use WebP assets in production and preserve the PNG originals. Preload/decode sprites before enabling Open. Use one animation loop for sprite reveal and floaters, CSS transform for the water belt, and normal component cleanup. Keep the existing site’s scroll behavior and content after the hero. Provide a subtle reduced-motion mode with much slower water and tiny drift, plus an explicit pause control if the product supports one. Do not automatically stop ambient motion at reveal completion.

Validate the initial pose and final pose against the supplied references. Check intermediate poses, mobile crop, all 4 floaters still moving after 30 seconds, no duplicate baked objects, no white gaps, and seamless water looping across 240 seconds. Preserve scene coordinates rather than approximating positions by eye.

Deliver the integrated component and mention the files changed. Use the included demo as an implementation reference, not as a new unrelated page design.


## Mandatory V2 camera and sequential depth behavior

The earlier version looked like horizontal curtains opening at once. Do not recreate that behavior. This revision must feel like a drone descending from above through successive leaf planes toward the river.

Wrap the entire native scene in a separate `camera-world`, inside the responsive artboard. Read `manifest.camera`: scale 1.00 → 1.16 and translate Y 0 → -28 native pixels around origin (576,1065), over 5 seconds using smootherstep. Preserve the overhead orientation; do not rotate or tilt the camera. The resulting slight final crop is intentional.

Use the exact manifest delays: foreground lower layers start around 0.28–0.74s, middle layers at 1.34–1.73s, upper canopy at 2.27–2.64s, bank leaves at 2.93–3.13s, and deep canopy at 3.32–3.49s. Each layer takes roughly 1.25–1.48s to move. Preserve this sequence with gentle overlap and no idle holds. The intended pace is fluid and decisive, not slow motion.

Use the exact `motion` fields in each element: arcX, arcY, liftScale and bend. Interpolate with `t = u*u*u*(u*(u*6-15)+10)`; the curved/depth part uses `sin(PI*t)`. Follow `demo.js`. This creates a gentle pass-by-camera sensation, not flat lateral sliding. Do not replace these curves with an initial fast ease-out, a CSS transition on every layer at once, or a large global zoom without depth staging.

The camera settles at 5s, while the separate water/floater ambient clocks continue indefinitely. Keep slow water flow and the independent floaters exactly as before.
