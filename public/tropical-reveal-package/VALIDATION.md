# Validation notes

- All manifest asset paths resolve and all referenced image files decode.
- 36 botanical sprite instances; 3 lantern nodes and 1 ring node.
- Closed and open poses, widths, opacities and replay state were checked using the actual demo JavaScript with a lightweight DOM harness.
- All four floater transforms still change at the final reveal state, including a sample after 30 seconds.
- The open state retains only 3 bank banana instances; the other bank bananas move out and fade.
- Water PNG first and last rows match exactly. The optimized WebP seam differs by approximately 1.25 RGB levels on average because of compression.
- Ring hole and surrounding pixels have real alpha. Floater files have no opaque green rectangular background.
- Four reveal keyframes were rendered and visually inspected. The 13-second MP4 was rendered from the same manifest and motion formulas; it is not a browser screen recording.
- HTML/CSS browser automation was not available in this environment because a Chromium runtime could not be downloaded. JavaScript syntax/state tests and rendered keyframes were completed. Run the HTML in the target browser and follow the final checks in the guide during integration.

To repeat the JavaScript state checks with Node installed:

```bash
node source/validate-demo.cjs
```

## V2 drone-descent checks

- Reveal duration is 5 seconds, with staged foreground/middle/deep delays.
- Mid layers remain closed at 0.7 seconds; the upper-right canopy remains closed at 2.1 seconds.
- Camera transform reaches scale 1.16 and Y -28 native pixels, separate from responsive scaling.
- Curved per-layer motion uses smootherstep with bounded lateral arcs, subtle depth lift and no abrupt fast start.

V2.1: total reveal shortened to 5 seconds; per-layer timing scaled together, reduced lift/arc/bend, water and floater idle clocks unchanged.
