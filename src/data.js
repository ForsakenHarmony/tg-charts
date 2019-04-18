export function projectedView(data, maxX, maxY, sStartY, sEndY) {
  const lines = cachedOr([data.lines, maxX, maxY], () => data.lines.map(line => ({
    ...line,
    data: line.data.map(([x, y]) => [x * maxX, maxY - y * maxY])
  })));

  const searchDiff = sEndY - sStartY;
  const smallLines = cachedOr([data.fullLines, maxX, sStartY, searchDiff], () => data.fullLines.map(line => ({
    ...line,
    data: line.data.map(([x, y]) => [
      x * maxX,
      sStartY + (searchDiff - y * searchDiff)
    ])
  })));

  const labels = cachedOr([data.labels, maxX], () => data.labels.map(label => ({
    pos: label.pos * maxX,
    text: label.text
  })));

  const markers = cachedOr([data.markers, maxY, maxX], () => data.markers.map(marker => ({
    pos: maxY - marker.pos * maxY,
    text: marker.text
  })));

  const shownLabels = cachedOr([data.shownLabels, maxX], () => data.shownLabels.map(label => ({
    text: label.text,
    pos: label.pos * maxX
  })));

  return {
    lines,
    smallLines,
    labels,
    markers,
    shownLabels,
    view: [data.view[0] * maxX, data.view[1] * maxX],
    selection: null
  };
}

function binarySearchClosestIdx(data, thing, lower, offset = 0) {
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
  if (data.length === 1)
    return offset + data[0] < thing ? (lower ? 0 : 1) : lower ? -1 : 0;
  const idx = Math.round(data.length / 2);
  if (thing < data[idx]) {
    return binarySearchClosestIdx(data.slice(0, idx), thing, lower, offset);
  } else {
    return binarySearchClosestIdx(data.slice(idx), thing, lower, offset + idx);
  }
}

let _cache = undefined;
function interp(n, time) {
  if (!_cache) {
    _cache = n;
    return n;
  }
  return n;
}

const steps = [10, 5, 1];
const minLines = 3;

export function normalizedView(data, start, end, time) {
  const { xData, fullLines, fullLabels } = data;
  const startVal = xData.data[0];
  const endVal = xData.data[xData.data.length - 1];
  const diff = endVal - startVal;
  const startBound = startVal + diff * start;
  const endBound = startVal + diff * end;
  const startIdx = cachedOr([xData.data, startBound], () => binarySearchClosestIdx(xData.data, startBound, true));
  const endIdx = cachedOr([xData.data, endBound], () => binarySearchClosestIdx(xData.data, endBound, false));

  const labels = cachedOr([fullLabels, startIdx, endIdx], () => fullLabels.slice(startIdx, endIdx).map(({ text, pos }) => ({
    text,
    pos: (pos - start) / (end - start)
  })));

  const { lines, max } = cachedOr([fullLines, startIdx, endIdx], () => {
    let max = Number.MIN_SAFE_INTEGER;

    const lines = fullLines.map(line => ({
      ...line,
      data: line.raw.slice(startIdx, endIdx).map(n => (n > max ? (max = n) : n))
    }));
  
    max *= 1.05;
    max = interp(max, time);
    max = cachedOr([startIdx, endIdx], () => max);
  
    
    lines.map(line => {
      line.data = line.data.map((d, i) => [labels[i].pos, d / max]);
    }); 

    return {
      lines,
      max
    };
  });

  const stepN = max / minLines;
  const digits = Math.round(Math.log10(stepN));
  const base = Math.pow(10, digits - 1);

  const step = steps.map(s => base * s).filter(s => s < stepN)[0];
  const nSteps = Math.floor(max / step) + 1;

  const markers = cachedOr([nSteps, step], () => Array.from({ length: nSteps }, (_, i) => ({
    text: "" + i * step,
    pos: (i * step) / max
  })));

  const shownLabels = cachedOr([labels, end, start, diff], () => {
    const viewDiff = end - start;
    const labelPadAmt = 0.05;
    const labelMinN = 5;
    const posOnly = labels.map(l => l.pos);

    const invDiff = 1 / viewDiff;
    const boundDiff = (endBound - startBound) * (1 - labelPadAmt * 2);
    const power = Math.round(Math.log2(boundDiff / labelMinN));
    const step = Math.pow(2, power);
    const labelN = Math.floor(boundDiff / step);
    const relStep = step / boundDiff;
    const offset = 1 - ((startBound + labelPadAmt * diff) / step) % 1;

    const r = n => Math.round(n*100)/100;
    console.log('n', r(relStep), r(labelN), r((startBound + labelPadAmt * diff) / step));

    return Array.from({ length: labelN }, (_, i) => {
      const pos = (offset + i) * relStep;
      const idx = binarySearchClosestIdx(posOnly, pos, false);
      
      return labels[idx] && {
        text: labels[idx].text,
        pos: labels[idx].pos
      }
    }).filter(Boolean);
  });

  return Object.assign(
    {
      lines,
      labels,
      markers,
      shownLabels,
      view: [start, end],
      selection: null
    },
    data
  );
}

export function pregenerate(xData, yData) {
  const startVal = xData.data[0];
  const endVal = xData.data[xData.data.length - 1];

  const fullLabels = cachedOr([xData.data, startVal, endVal], () => xData.data.map(d => ({
    text: new Date(d)
      .toDateString()
      .split(" ")
      .slice(1, 3)
      .join(" "),
    pos: (d - startVal) / (endVal - startVal),
    raw: d
  })));

  const { fullYView, totalMax } = cachedOr([yData], () => {
    let totalMax = Number.MIN_SAFE_INTEGER;
    const fullYView = yData.map(line => ({
      ...line,
      data: line.data.map(n => (n > totalMax ? (totalMax = n) : n))
    }));
    return {
      totalMax,
      fullYView,
    };
  });

  const totalMaxPerc = totalMax * 0.05;
  const fullLines = cachedOr([fullYView, totalMaxPerc, fullLabels], () => fullYView.map(line => ({
    ...line,
    data: line.data.map((d, i) => [
      fullLabels[i].pos,
      (totalMaxPerc + d) / (totalMax + totalMaxPerc * 2)
    ]),
    raw: line.data
  })));

  return {
    xData,
    yData,
    fullLines,
    fullLabels
  };
}

// { [id]: [] }
const cache = {};
let currentId, currentIdx;

function cachedOr(inputs, creator) {
  const caller = new Error().stack.split('\n')[2].trim();
  const currentCache = cache[currentId] || (cache[currentId] = {});
  const currentValue = currentCache[caller] || (currentCache[caller] = {});
//  const currentValue = currentCache[currentIdx] || (currentCache.push({}), currentCache[currentIdx]);
//  currentIdx += 1;
  const cached = currentValue.inputs && currentValue.value && currentValue.inputs.length === inputs.length && inputs.reduce((acc, val, i) => acc && val === currentValue.inputs[i], true);
  if (!cached) {
    currentValue.inputs = inputs;
    currentValue.value = creator();
  }
  return currentValue.value;
}

export function genData({
  id,
  xData,
  yData,
  view /* [ start, end ] */,
  viewPort /*: {
    chart: {
      x: [start, end],
      y: [start, end]
    },
    finder: {
      x: [start, end],
      y: [start, end]
    }
  }*/,
  time,
  rerender
}) {
  currentId = id;
  currentIdx = 0;

  const pregen = pregenerate(xData, yData);
  const currView = normalizedView(pregen, view[0], view[1], time);
  return projectedView(
    currView,
    viewPort.chart.x[1],
    viewPort.chart.y[1],
    viewPort.finder.y[0],
    viewPort.finder.y[1],
  );
}


