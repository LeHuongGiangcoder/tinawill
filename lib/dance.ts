/**
 * Cặp đôi khiêu vũ của trang Dresscode — bộ dựng WebGL, chuyển từ bản bàn
 * giao (assets-source/dresscode-dance/animate.js + timeline.js).
 *
 * Sáu ảnh cùng một dáng, cùng toạ độ (public/dresscode/dance/couple-*.webp):
 * bản gốc và năm bản đã nhuộm. Mỗi khung hình vẽ MỘT lưới tam giác dùng chung
 * cho hai bản kề nhau, uốn theo 12 "tay nắm" (tay, đầu, eo, tà váy, gối…) để
 * thành điệu nhảy; màu mới quét từ tà váy dưới trái lên trên phải. Vì chung
 * lưới nên giữa lúc đổi màu chỉ có một đường viền người, không bị bóng đôi.
 *
 * Mốc giờ và độ uốn gắn với chính bức tranh, nên nằm ở đây chứ không ở
 * content/client.ts. client.ts chỉ nói màu nào ứng với bản nhuộm nào.
 */

/** Tên bản nhuộm — trùng hậu tố file `couple-<id>.webp`. */
export type DanceLook = "original" | "ruby" | "vermilion" | "tangerine" | "olive" | "dark-olive";

export const DANCE_LOOKS: DanceLook[] = [
  "original",
  "ruby",
  "vermilion",
  "tangerine",
  "olive",
  "dark-olive",
];

export const DANCE_BASE = "/dresscode/dance/";
export const DANCE_DURATION = 9.2;

/** Ảnh tĩnh: poster lúc chưa tải, chế độ giảm chuyển động, máy không có WebGL. */
export const DANCE_POSTER = `${DANCE_BASE}couple-original.webp`;
/** Tỉ lệ khung của ảnh (1199 × 1312). */
export const DANCE_RATIO = 1199 / 1312;

/** `time` là giữa đoạn quét màu; `look` là chỉ số trong DANCE_LOOKS. */
const MOVES = [
  { time: 0, look: 0, transition: 0 },
  { time: 0.74, look: 1, transition: 0.48 },
  { time: 2.28, look: 2, transition: 0.46 },
  { time: 3.84, look: 3, transition: 0.5 },
  { time: 5.4, look: 4, transition: 0.46 },
  { time: 6.96, look: 5, transition: 0.48 },
  { time: 8.58, look: 0, transition: 0.52 },
];

/* Mốc của năm dáng (với, lắc, hất váy, bước chéo, nhún) — lệch nhẹ so với mốc
   màu để dáng dẫn trước, màu theo sau. */
const POSE_TIMES = [0, 0.86, 2.41, 3.95, 5.54, 7.09, 8.72, DANCE_DURATION];

/* Mỗi tay nắm: tâm (x, y), bán kính ảnh hưởng (rx, ry) và độ dời x/y ở năm
   dáng, đo trên hệ toạ độ tham chiếu 900 × 985 của bản bàn giao. */
const HANDLES: { x: number; y: number; rx: number; ry: number; poses: [number, number][] }[] = [
  { x: 428, y: 110, rx: 84, ry: 115, poses: [[3, -31], [-19, -10], [12, -16], [18, -2], [0, 20]] }, // tay nắm nhau
  { x: 285, y: 255, rx: 124, ry: 130, poses: [[9, -9], [-20, 9], [9, -6], [8, 0], [9, 14]] }, // đầu cô dâu
  { x: 652, y: 202, rx: 121, ry: 138, poses: [[5, -8], [26, 6], [-7, -6], [10, 9], [-12, 20]] }, // đầu chú rể
  { x: 103, y: 503, rx: 142, ry: 108, poses: [[-10, -21], [-22, 22], [47, -29], [8, 19], [42, 29]] }, // tay tự do cô dâu
  { x: 356, y: 488, rx: 116, ry: 154, poses: [[8, -4], [-15, 11], [10, -12], [19, 11], [11, 18]] }, // eo cô dâu
  { x: 114, y: 756, rx: 220, ry: 144, poses: [[13, -14], [59, 11], [-25, -45], [33, -15], [54, 18]] }, // tà váy
  { x: 351, y: 918, rx: 110, ry: 123, poses: [[3, -6], [-6, -5], [21, -19], [28, 1], [7, 0]] }, // chân cô dâu
  { x: 818, y: 456, rx: 116, ry: 120, poses: [[14, -14], [27, -24], [-15, -10], [-8, 12], [-13, 18]] }, // tay tự do chú rể
  { x: 667, y: 524, rx: 118, ry: 144, poses: [[13, -5], [19, 13], [-7, -9], [15, 16], [-15, 23]] }, // hông chú rể
  { x: 752, y: 661, rx: 122, ry: 106, poses: [[19, -8], [32, 3], [-11, 8], [-21, -22], [-25, 21]] }, // gối nhấc
  { x: 573, y: 886, rx: 92, ry: 120, poses: [[-4, -17], [10, -9], [20, -9], [-28, -25], [-9, 9]] }, // chân nhấc
  { x: 688, y: 958, rx: 83, ry: 93, poses: [[4, 0], [7, 0], [-5, 0], [13, 0], [-4, 0]] }, // chân trụ
];

const VERTEX = `
  attribute vec2 position, uv;
  varying vec2 vUV;
  void main() { vUV = uv; gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAGMENT = `
  precision mediump float;
  varying vec2 vUV;
  uniform sampler2D fromLook, toLook;
  uniform float progress;
  void main() {
    float path = (1.0 - vUV.y) * 0.58 + vUV.x * 0.42;
    float front = smoothstep(path - 0.14, path + 0.14, progress * 1.30 - 0.15);
    gl_FragColor = mix(texture2D(fromLook, vUV), texture2D(toLook, vUV), front);
  }
`;

export type Dance = {
  /** Vẽ khung hình ở giây `seconds`; trả về bản nhuộm đang hiện. */
  render: (seconds: number) => DanceLook;
  destroy: () => void;
};

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Cannot load ${src}`));
    image.src = src;
  });
}

/** Ném lỗi nếu máy không có WebGL hoặc ảnh không tải được — chỗ gọi giữ ảnh tĩnh. */
export async function createDance(canvas: HTMLCanvasElement): Promise<Dance> {
  const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true });
  if (!gl) throw new Error("WebGL is unavailable");

  const images = await Promise.all(DANCE_LOOKS.map((id) => loadImage(`${DANCE_BASE}couple-${id}.webp`)));

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? "shader");
    return shader;
  };
  const program = gl.createProgram()!;
  const vs = compile(gl.VERTEX_SHADER, VERTEX);
  const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT);
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? "program");
  gl.useProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  /* Lưới 46 × 50 ô; mỗi đỉnh 4 số: vị trí x/y (tính lại mỗi khung) + uv. */
  const columns = 46;
  const rows = 50;
  const vertices = new Float32Array((columns + 1) * (rows + 1) * 4);
  const triangles: number[] = [];
  for (let row = 0; row <= rows; row++) {
    for (let col = 0; col <= columns; col++) {
      const index = row * (columns + 1) + col;
      vertices[index * 4 + 2] = col / columns;
      vertices[index * 4 + 3] = row / rows;
      if (row < rows && col < columns) {
        const below = index + columns + 1;
        triangles.push(index, index + 1, below, index + 1, below + 1, below);
      }
    }
  }

  /* Độ dời của từng đỉnh ở mỗi dáng: trung bình có trọng số Gauss của các tay
     nắm, tính trước một lần. */
  const count = vertices.length / 4;
  const poseOffsets = HANDLES[0].poses.map(() => new Float32Array(count * 2));
  for (let i = 0; i < count; i++) {
    const x = vertices[i * 4 + 2] * 900;
    const y = vertices[i * 4 + 3] * 985;
    const weights = HANDLES.map((h) => Math.exp(-2 * (((x - h.x) / h.rx) ** 2 + ((y - h.y) / h.ry) ** 2)));
    const total = 0.075 + weights.reduce((sum, w) => sum + w, 0);
    poseOffsets.forEach((offsets, pose) => {
      HANDLES.forEach((handle, j) => {
        offsets[i * 2] += (handle.poses[pose][0] * weights[j]) / total;
        offsets[i * 2 + 1] += (handle.poses[pose][1] * weights[j]) / total;
      });
    });
  }

  const vertexBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangles), gl.STATIC_DRAW);
  for (const [name, offset] of [["position", 0], ["uv", 8]] as const) {
    const location = gl.getAttribLocation(program, name);
    gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 16, offset);
    gl.enableVertexAttribArray(location);
  }
  gl.uniform1i(gl.getUniformLocation(program, "fromLook"), 0);
  gl.uniform1i(gl.getUniformLocation(program, "toLook"), 1);
  const progressLocation = gl.getUniformLocation(program, "progress");

  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  const textures = images.map((image) => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    return texture;
  });

  const unit = (v: number) => Math.min(1, Math.max(0, v));
  const ease = (v: number) => v * v * (3 - 2 * v);

  function render(seconds: number): DanceLook {
    const time = ((seconds % DANCE_DURATION) + DANCE_DURATION) % DANCE_DURATION;
    const next = MOVES.findIndex((m) => time < m.time + m.transition / 2);
    const to = next === -1 ? MOVES[MOVES.length - 1] : MOVES[next];
    const from = next > 0 ? MOVES[next - 1] : to;
    const progress = next > 0 ? ease(unit((time - to.time) / to.transition + 0.5)) : 1;
    const active = MOVES.reduce((last, m) => (time >= m.time ? m : last), MOVES[0]);

    const i = Math.max(0, POSE_TIMES.findIndex((beat) => beat > time) - 1);
    const left = poseOffsets[i - 1];
    const right = poseOffsets[i];
    const t = ease(unit((time - POSE_TIMES[i]) / (POSE_TIMES[i + 1] - POSE_TIMES[i])));
    const cycle = (time / DANCE_DURATION) * Math.PI * 2;
    const rock = 0.017 * Math.sin(cycle * 3);
    const bounce = 5 * (Math.cos(cycle * 5) - 1);

    /* Sân khấu 980 × 1060 quanh tranh 900 × 985: chừa chỗ cho tay vươn và tà
       váy hất ra mà không chạm mép canvas. */
    const aspect = canvas.width / canvas.height;
    const stageWidth = Math.max(980, 1060 * aspect);
    const stageHeight = Math.max(1060, 980 / aspect);
    for (let j = 0; j < count; j++) {
      const dx = (left?.[j * 2] ?? 0) * (1 - t) + (right?.[j * 2] ?? 0) * t;
      const dy = (left?.[j * 2 + 1] ?? 0) * (1 - t) + (right?.[j * 2 + 1] ?? 0) * t;
      const x = (vertices[j * 4 + 2] - 0.5) * 900;
      const y = (vertices[j * 4 + 3] - 0.5) * 985;
      vertices[j * 4] = ((x + dx - y * rock) * 2) / stageWidth;
      vertices[j * 4 + 1] = (-(y + dy + x * rock + bounce) * 2) / stageHeight;
    }

    gl!.viewport(0, 0, canvas.width, canvas.height);
    gl!.clear(gl!.COLOR_BUFFER_BIT);
    gl!.bufferData(gl!.ARRAY_BUFFER, vertices, gl!.DYNAMIC_DRAW);
    gl!.activeTexture(gl!.TEXTURE0);
    gl!.bindTexture(gl!.TEXTURE_2D, textures[from.look]);
    gl!.activeTexture(gl!.TEXTURE1);
    gl!.bindTexture(gl!.TEXTURE_2D, textures[to.look]);
    gl!.uniform1f(progressLocation, progress);
    gl!.drawElements(gl!.TRIANGLES, triangles.length, gl!.UNSIGNED_SHORT, 0);
    return DANCE_LOOKS[active.look];
  }

  return {
    render,
    destroy() {
      textures.forEach((texture) => gl.deleteTexture(texture));
      gl.deleteBuffer(vertexBuffer);
      gl.deleteBuffer(indexBuffer);
      gl.deleteProgram(program);
    },
  };
}
