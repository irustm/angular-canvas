export function getMatrix(arr) {
  return arr
    .split(/\n/)
    .filter(Boolean)
    .map((s) => s.split(''));
}

export function getColor(map: Map<string, string>, s: string) {
  if (map.has(s)) {
    return map.get(s);
  }
  return 'transparent';
}

export function renderMatrix(
  context: CanvasRenderingContext2D,
  matrix,
  colorMap,
  size,
  x,
  y
) {
  const matrixLength = matrix.length;

  for (let ci = 0; ci < matrixLength; ci++) {
    const rows = matrix[ci];

    for (let cy = 0; cy < rows.length; cy++) {
      context.fillStyle = getColor(colorMap, rows[cy]);
      context.fillRect(x + cy * size, y + ci * size, size, size);
    }
  }
}
