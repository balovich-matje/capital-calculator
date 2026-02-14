export const createHistoryChart = ({ history = [], emptyLabel = 'No historical data' }) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'chart-wrapper';

    if (!history.length) {
        const fallback = document.createElement('p');
        fallback.className = 'chart-empty';
        fallback.textContent = emptyLabel;
        wrapper.appendChild(fallback);
        return wrapper;
    }

    const values = history.map((point) => Number(point.value));
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const width = 420;
    const height = 140;
    const padding = 14;
    const range = Math.max(maxValue - minValue, 1);

    const toX = (index) => {
        const denominator = Math.max(history.length - 1, 1);
        return padding + (index / denominator) * (width - padding * 2);
    };

    const toY = (value) => {
        const ratio = (value - minValue) / range;
        return height - padding - ratio * (height - padding * 2);
    };

    const points = history.map((point, index) => `${toX(index)},${toY(point.value)}`).join(' ');

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('class', 'history-chart');
    svg.setAttribute('role', 'img');

    const grid = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    grid.setAttribute('x1', String(padding));
    grid.setAttribute('x2', String(width - padding));
    grid.setAttribute('y1', String(height - padding));
    grid.setAttribute('y2', String(height - padding));
    grid.setAttribute('class', 'history-grid-line');
    svg.appendChild(grid);

    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    polyline.setAttribute('points', points);
    polyline.setAttribute('class', 'history-line');
    svg.appendChild(polyline);

    const lastPoint = history[history.length - 1];
    const lastDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    lastDot.setAttribute('cx', String(toX(history.length - 1)));
    lastDot.setAttribute('cy', String(toY(lastPoint.value)));
    lastDot.setAttribute('r', '3.5');
    lastDot.setAttribute('class', 'history-dot');
    svg.appendChild(lastDot);

    const axis = document.createElement('div');
    axis.className = 'chart-axis';
    axis.innerHTML = `<span>${history[0].year}</span><span>${history[history.length - 1].year}</span>`;

    wrapper.appendChild(svg);
    wrapper.appendChild(axis);
    return wrapper;
};
