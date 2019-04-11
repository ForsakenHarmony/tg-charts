export function normalizeData (data, maxX, maxY, sStartY, sEndY) {
  const lines = data.lines.map(line => ({
    ...line,
    data: line.data.map(([x, y]) => [
      x * maxX,
      maxY - y * maxY,
    ]),
  }));

  const searchDiff = sEndY - sStartY;
  const smallLines = data.fullLines.map(line => ({
    ...line,
    data: line.data.map(([x, y]) => [
      x * maxX,
      sStartY + (searchDiff - y * searchDiff),
    ]),
  }));

  const labels = data.labels.map(label => ({
    pos: label.pos * maxX,
    text: label.text,
  }));

  const markers = data.markers.map(marker => ({
    pos: maxY - marker.pos * maxY,
    text: marker.text,
  }));

  const shownLabels = data.shownLabels.map(label => ({
    text: label.text,
    pos: label.pos * maxX,
  }));

  return {
    lines,
    smallLines,
    labels,
    markers,
    shownLabels,
    view: [data.view[0] * maxX, data.view[1] * maxX],
    selection: null,
  };
}

function binarySearchClosestIdx (data, thing, lower, offset = 0) {
  if (data.length <= 2) {
    if (lower) {
      if (data[0] < thing) {
        if (data[1] && data[1] < thing) {
          return offset + 1;
        }
        return offset;
      } else {
        if (offset === 0) return 0;
        return offset - 1 || 0;
      }
    } else {
      if (data[0] < thing) {
        if (data[1] && data[1] < thing) {
          return offset + 2;
        }
        return offset + 1;
      } else {
        return offset;
      }
    }
  }
  if (data.length === 1) return (offset + data[0] < thing ? (lower ? 0 : 1) : (lower ? -1 : 0));
  const idx = Math.round(data.length / 2);
  if (thing < data[idx]) {
    return binarySearchClosestIdx(data.slice(0, idx), thing, lower, offset);
  } else {
    return binarySearchClosestIdx(data.slice(idx), thing, lower, offset + idx);
  }
}

let _cache = undefined;
function interp (n, time) {
  if (!_cache) {
    _cache = n;
    return n;
  }
  return n;
}

const steps = [10, 7.5, 5, 2.5, 2, 1];
const minLines = 4;

export function view (data, start, end, time) {
  const { xData, fullLines, fullLabels } = data;
  const startVal = xData.data[0];
  const endVal = xData.data[xData.data.length - 1];
  const diff = endVal - startVal;
  const startBound = startVal + diff * start;
  const endBound = startVal + diff * end;
  const startIdx = binarySearchClosestIdx(xData.data, startBound, true);
  const endIdx = binarySearchClosestIdx(xData.data, endBound, false);
  let max = Number.MIN_SAFE_INTEGER;

  const labels = fullLabels.slice(startIdx, endIdx).map(({ text, pos }) => ({
    text,
    pos: (pos - start) / (end - start),
  }));

  const lines = fullLines.map(line => ({
    ...line,
    data: line.raw.slice(startIdx, endIdx)
      .map(n => n > max ? max = n: n),
  }));

  max *= 1.05;
  max = interp(max, time);

  lines.map(line => {
    line.data = line.data.map((d, i) => [labels[i].pos, d / max])
  });

  const stepN = max / minLines;
  const digits = Math.round(Math.log10(stepN));
  const base = Math.pow(10, digits - 1);

  const step = steps.map(s => base * s).filter(s => s < stepN)[0];
  const nSteps = Math.floor(max / step) + 1;

  const markers = Array.from({ length: nSteps }, (_, i) => ({
    text: ""+(i * step),
    pos: (i * step) / max,
  }));

  const idxDiff = endIdx - startIdx;
  const labelStep = Math.floor(idxDiff / 5);
  const labelN = Math.floor(idxDiff / labelStep);

  const shownLabels = Array.from({ length: labelN }, (_, i) => ({
    text: labels[i * labelStep].text,
    pos: labels[i * labelStep].pos,
  }));

  return Object.assign({
    lines,
    labels,
    markers,
    shownLabels,
    view: [start, end],
    selection: null,
  }, data);
}

export function pregenerate (xData, yData) {
  let totalMax = Number.MIN_SAFE_INTEGER;

  const startVal = xData.data[0];
  const endVal = xData.data[xData.data.length - 1];

  const fullLabels = xData.data.map(d => ({
    text: new Date(d).toDateString().split(' ').slice(1, 3).join(' '),
    pos: (d - startVal) / (endVal - startVal),
    raw: d,
  }));

  const fullYView = yData.map(line => ({
    ...line,
    data: line.data.map(n => n > totalMax ? totalMax = n : n),
  }));

  const totalMaxPerc = totalMax * 0.05;
  const fullLines = fullYView.map((line) => ({
    ...line,
    data: line.data.map((d, i) => [fullLabels[i].pos, (totalMaxPerc + d) / (totalMax + totalMaxPerc * 2)]),
    raw: line.data,
  }));

  return {
    xData,
    yData,
    fullLines,
    fullLabels,
  }
}
