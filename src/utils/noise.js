CU.hash = (i, j, k) => { const s = Math.sin(i * 127.1 + j * 311.7 + k * 74.7) * 43758.5453; return s - Math.floor(s); };
CU.noise = (x, y, z) => {
  const X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z), h = CU.hash,
    sm = t => t * t * (3 - 2 * t), a = sm(x - X), b = sm(y - Y), c = sm(z - Z), L = (p, q, t) => p + (q - p) * t;
  return L(L(L(h(X, Y, Z), h(X + 1, Y, Z), a), L(h(X, Y + 1, Z), h(X + 1, Y + 1, Z), a), b),
           L(L(h(X, Y, Z + 1), h(X + 1, Y, Z + 1), a), L(h(X, Y + 1, Z + 1), h(X + 1, Y + 1, Z + 1), a), b), c);
};
CU.fbm = (x, y, z) => { let s = 0, a = 0.5; for (let i = 0; i < 5; i++) { s += a * CU.noise(x, y, z); x *= 2; y *= 2; z *= 2; a *= 0.5; } return s; };
