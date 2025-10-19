import type { TracksPopularityChartProps } from "@/pages/artistDetails/components/tracksPopularityChart/types";
import { useTranslation } from "react-i18next";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";


export const TracksPopularityChart = ({
	tracks,
}: TracksPopularityChartProps) => {
	const { t } = useTranslation();

	const chartData = tracks.map((track) => ({
		name: track.name.length > 20 ? `${track.name.substring(0, 20)}...` : track.name,
		fullName: track.name,
		popularity: track.popularity,
	}));

	const getBarColor = (popularity: number) => {
		if (popularity >= 80) return "hsl(var(--chart-1))";
		if (popularity >= 60) return "hsl(var(--chart-2))";
		if (popularity >= 40) return "hsl(var(--chart-3))";
		return "hsl(var(--chart-4))";
	};

	return (
		<div className="w-full">
			<h3 className="text-lg font-semibold mb-4">
				{t("pages.artistDetails.charts.tracksPopularity")}
			</h3>
			<ResponsiveContainer width="100%" height={350}>
				<BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
					<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
					<XAxis
						dataKey="name"
						angle={-45}
						textAnchor="end"
						height={100}
						className="text-xs"
					/>
					<YAxis
						label={{
							value: t("pages.artistDetails.charts.popularityLabel"),
							angle: -90,
							position: "insideLeft",
						}}
						domain={[0, 100]}
					/>
					<Tooltip
						content={({ active, payload }) => {
							if (active && payload?.[0]) {
								return (
									<div className="rounded-lg border bg-background p-3 shadow-md">
										<div className="text-sm font-medium mb-1">
											{payload[0].payload.fullName}
										</div>
										<div className="text-xs text-muted-foreground">
											{t("pages.artistDetails.charts.popularity")}:{" "}
											<span className="font-semibold">
												{payload[0].value}/100
											</span>
										</div>
									</div>
								);
							}
							return null;
						}}
					/>
					<Bar dataKey="popularity" radius={[8, 8, 0, 0]}>
						{chartData.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={getBarColor(entry.popularity)} />
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};

