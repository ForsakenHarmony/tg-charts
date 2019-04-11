import './styles.css';
import { normalizeData, pregenerate, view } from './data'
import { h, diff } from './renderer';

const maxChartY = 400;
const searchStartY = 450;
const searchEndY = 500;

const EMPTY_ARR = [];

function coerceTouches(e) {
  return e.changedTouches ?
    EMPTY_ARR.slice.call(e.changedTouches) :
    [{ identifier: 0, clientX: e.clientX, target: e.target }];
}

function createChart ({ x, y }) {
  let currentView = [0.0, 1.0];
  const touches = {};
  let svg = null;

  function mouseDown (e) {
    e.preventDefault();
    coerceTouches(e).map(({ identifier, clientX, target }) => {
      touches[identifier] = {
        start: clientX,
        target: target.classList[1] || '',
      };
    });
  }

  function mouseUp (e) {
    e.preventDefault();
    coerceTouches(e).map(({ identifier }) => {
      delete touches[identifier];
    });
  }

  function mouseMove (e) {
    e.preventDefault();
    if (Object.keys(touches).length > 0 && e.buttons === 1) {
      // refresh svg if it got diffed to hell
      if (!svg || !svg.clientWidth) {
        svg = document.querySelector('svg');
      }
      const { x: svgStart, width: svgWidth } = svg.getBoundingClientRect();

      coerceTouches(e).map(t => {
        // console.log(t);
        const { identifier, clientX: current } = t;
        const touch = touches[identifier];
        const { start, target } = touch;

        let delta = ((current - svgStart) - (start - svgStart)) / svgWidth;

        const left = target === 'window' || target === 'left';
        const right = target === 'window' || target === 'right';

        if (left && currentView[0] + delta < 0) {
          delta = -currentView[0];
        }
        if (right && currentView[1] + delta > 1) {
          delta = 1 - currentView[1];
        }
        if (left && currentView[0] + delta > currentView[1] - 0.05) {
          delta = currentView[1] - 0.05 - currentView[0];
        }
        if (right && currentView[1] + delta < currentView[0] + 0.05) {
          delta = currentView[0] + 0.05 - currentView[1];
        }

        if (left) {
          currentView[0] += delta;
        }
        if (right) {
          currentView[1] += delta;
        }

        if (left || right) {
          touch.start = start + delta * svgWidth;
          queueRender();
        }
      });
    }
  }

  const gen = pregenerate(x, y);

  return (time, width) => {
    const data = normalizeData(view(gen, currentView[0], currentView[1], time), width, maxChartY, searchStartY, searchEndY);

    const graph = h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      version: '1.2',
      viewBox: [0, 0, width, searchEndY].join(' '),
      class: 'graph'
    }, [
      h('g', {}, [
        h('g', { class: 'lines y-lines' },
          data.markers.map(m =>
            h('line', { x1: 0, x2: width, y1: m.pos, y2: m.pos })
          )
        ),
        h('g', { class: 'labels y-labels' },
          data.markers.map(m =>
            h('text', { x: 0, y: m.pos - 10 }, [m.text]),
          )
        ),
        h('g', { class: 'labels x-lines' }, [
          data.selection && h('line', { x1: 200, x2: 200, y1: 0, y2: maxChartY }),
        ]),
        h('g', { class: 'labels x-labels' },
          data.shownLabels.map(l =>
            h('text', { x: l.pos, y: maxChartY }, [l.text])
          )
        ),
        h('g', { class: 'line-charts' },
          data.lines.map(line =>
            h('polyline', {
              stroke: line.color,
              class: 'line-chart',
              points: line.data.map(i => i.join(",")).join(' '),
            })
          )
        )
      ]),
      h('g', {
        class: 'finder'
      }, [
        h('rect', {
          x: data.view[0],
          y: '450',
          width: width - (width - data.view[1]) - data.view[0],
          height: '50',
          class: 'window-border'
        }),
        h('rect', {
          x: data.view[0] + 5,
          y: '452',
          width: width - (width - data.view[1]) - data.view[0] - 10,
          height: '46',
          class: 'window'
        }),
        ...data.smallLines.map(line =>
          h('polyline', {
            stroke: line.color,
            class: 'line-chart',
            points: line.data.map(i => i.join(",")).join(' '),
          })
        ),
        h('rect', {
          x: '0',
          y: '450',
          width: data.view[0],
          height: '50',
          class: 'overlay'
        }),
        h('rect', {
          x: data.view[1],
          y: '450',
          width: width - data.view[1],
          height: '50',
          class: 'overlay'
        }),
        h('rect', {
          x: data.view[0] - 15,
          y: '450',
          width: 25,
          height: '50',
          class: 'handle left',
          onMouseDown: mouseDown,
          onTouchStart: mouseDown
        }),
        h('rect', {
          x: data.view[1] - 10,
          y: '450',
          width: 25,
          height: '50',
          class: 'handle right',
          onMouseDown: mouseDown,
          onTouchStart: mouseDown
        }),
        h('rect', {
          x: data.view[0] + 10,
          y: '450',
          width: width - (width - data.view[1]) - data.view[0] - 20,
          height: '50',
          class: 'handle window',
          onMouseDown: mouseDown,
          onTouchStart: mouseDown
        }),
      ]),
    ]);

    return h('section', {
      class: 'chart',
      onMouseMove: mouseMove,
      onMouseUp: mouseUp,
      onTouchEnd: mouseUp,
      onTouchMove: mouseMove
    }, [
      h('header', { class: 'header' }, [
        h('h1', {}, ['Chart'])
      ]),
      graph,
      h('footer', {},
        data.lines.map(line =>
          h('label', { for: line.name }, [
            h('input', {
              type: 'checkbox',
              class: 'outline',
              id: line.name,
              checked: true
            }),
            line.name,
          ]),
        ),
      )
    ]);
  }
}

const parent = document.querySelector('main');
let queued = false;
let charts = [];
let width = document.body.clientWidth;

function render (time) {
  queued = false;
  diff(parent, charts.map(c => c(time, width - 30)));
}

function queueRender () {
  if (queued) return;
  requestAnimationFrame(render);
  queued = true;
}

window.addEventListener('load', () => {
  width = document.body.clientWidth;
  queueRender();
});

window.addEventListener('resize', () => {
  width = document.body.clientWidth;
  queueRender();
});

fetch('./chart_data (3).json')
  .then(res => res.json())
  .then(data => {
    charts = data.map(chart => {
      const columns = chart.columns.map(([name, ...data]) => {
        return {
          color: chart.colors[name],
          data: data,
          name: chart.names[name],
          type: chart.types[name],
        }
      });

      const x = columns.find(c => c.type === 'x');
      const y = columns.filter(c => c !== x);

      return createChart({ x, y });
    });

    queueRender();
  });
