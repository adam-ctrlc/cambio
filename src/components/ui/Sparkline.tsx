interface SparklineProps {
    data: number[];
    width?: number;
    height?: number;
    className?: string;
    /** Override stroke color; otherwise derived from first-vs-last direction. */
    positive?: boolean;
}

export function Sparkline({ data, width = 100, height = 28, className, positive }: SparklineProps) {
    if (!data || data.length < 2) return null;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const stepX = width / (data.length - 1);

    const points = data
        .map((v, i) => {
            const x = i * stepX;
            const y = height - ((v - min) / range) * height;
            return `${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(' ');

    const dir = positive ?? data[data.length - 1] >= data[0];
    const stroke = dir ? '#34d399' : '#f87171';

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className={className}
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            <polyline
                points={points}
                fill="none"
                stroke={stroke}
                strokeWidth={1.5}
                strokeLinejoin="round"
                strokeLinecap="round"
            />
        </svg>
    );
}
