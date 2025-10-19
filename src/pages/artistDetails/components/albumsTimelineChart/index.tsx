import type { AlbumsTimelineChartProps } from "@/pages/artistDetails/components/albumsTimelineChart/types";
import { useTranslation } from "react-i18next";
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";


export const AlbumsTimelineChart = ({
	albums,
}: AlbumsTimelineChartProps) => {
	const { t } = useTranslation();

	const albumsByYear = albums.reduce(
		(acc, album) => {
			const year = new Date(album.release_date).getFullYear();
			if (!acc[year]) {
				acc[year] = {
					year: year.toString(),
					total: 0,
					albums: 0,
					singles: 0,
					compilations: 0,
				};
			}
			acc[year].total += 1;
			
			if (album.album_type === "album") {
				acc[year].albums += 1;
			} else if (album.album_type === "single") {
				acc[year].singles += 1;
			} else if (album.album_type === "compilation") {
				acc[year].compilations += 1;
			}
			
			return acc;
		},
		{} as Record<
			string,
			{ year: string; total: number; albums: number; singles: number; compilations: number }
		>,
	);
	const chartData = Object.values(albumsByYear)
		.sort((a, b) => Number.parseInt(a.year) - Number.parseInt(b.year));

	return (
		<div className="w-full">
			<h3 className="text-lg font-semibold mb-4">
				{t("pages.artistDetails.charts.albumsTimeline")}
			</h3>
			<ResponsiveContainer width="100%" height={350}>
				<LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
					<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
					<XAxis
						dataKey="year"
						label={{
							value: t("pages.artistDetails.charts.yearLabel"),
							position: "insideBottom",
							offset: -10,
						}}
					/>
					<YAxis
						label={{
							value: t("pages.artistDetails.charts.releasesLabel"),
							angle: -90,
							position: "insideLeft",
						}}
						allowDecimals={false}
					/>
					<Tooltip
						content={({ active, payload }) => {
							if (active && payload?.[0]) {
								const data = payload[0].payload;
								return (
									<div className="rounded-lg border bg-background p-3 shadow-md">
										<div className="text-sm font-bold mb-2">
											{t("pages.artistDetails.charts.year")}: {data.year}
										</div>
										<div className="space-y-1 text-xs">
											<div>
												<span className="text-muted-foreground">
													{t("pages.artistDetails.charts.totalReleases")}:
												</span>{" "}
												<span className="font-semibold">{data.total}</span>
											</div>
											<div>
												<span className="text-muted-foreground">
													{t("common.album")}s:
												</span>{" "}
												<span className="font-semibold">{data.albums}</span>
											</div>
											<div>
												<span className="text-muted-foreground">
													{t("common.single")}s:
												</span>{" "}
												<span className="font-semibold">{data.singles}</span>
											</div>
											{data.compilations > 0 && (
												<div>
													<span className="text-muted-foreground">
														{t("common.compilation")}s:
													</span>{" "}
													<span className="font-semibold">{data.compilations}</span>
												</div>
											)}
										</div>
									</div>
								);
							}
							return null;
						}}
					/>
					<Line
						type="monotone"
						dataKey="total"
						stroke="hsl(var(--primary))"
						strokeWidth={3}
						dot={{ fill: "hsl(var(--primary))", r: 5 }}
						activeDot={{ r: 7 }}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
};

