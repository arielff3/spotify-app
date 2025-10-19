import {  useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useTranslation } from "react-i18next";
import {
	Music,
	Search,
	Plus,
	CheckCircle2,
	Loader2,
	ListMusic,
	X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDebounce } from "@/hooks/useDebounce";
import { useFavorites } from "@/hooks/useFavorites";
import { createPlaylist } from "@/utils/playlistsDB";
import {
	addFavoritesSchema,
	type AddFavoritesFormData,
	type SpotifyTrackSearchResult,
} from "@/pages/favorites/components/addFavoritesSheet/schema";
import { useSearchTracks } from "@/pages/favorites/hooks/useSearchTracks";
import { Checkbox } from "@/components/ui/checkbox";

export const AddFavoritesSheet = () => {
	const { t } = useTranslation();
	const { addFavorite } = useFavorites();
	const [open, setOpen] = useState(false);

	const {
		register,
		handleSubmit,
		watch,
		control,
		setValue,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<AddFavoritesFormData>({
		resolver: standardSchemaResolver(addFavoritesSchema),
		defaultValues: {
			searchQuery: "",
			selectedTracks: [],
			addToPlaylist: false,
			playlistName: "",
			playlistNotes: "",
		},
	});

	const searchQuery = watch("searchQuery");
	const selectedTracks = watch("selectedTracks");
	const addToPlaylist = watch("addToPlaylist");
	const debouncedSearch = useDebounce(searchQuery, 500);
	const { data: searchResults, isLoading: isSearching } = useSearchTracks(debouncedSearch);
	const formatDuration = (ms: number) => {
		const minutes = Math.floor(ms / 60000);
		const seconds = Math.floor((ms % 60000) / 1000);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	const toggleTrack = (track: SpotifyTrackSearchResult) => {
		const isSelected = selectedTracks.some((t) => t.id === track.id);

		if (isSelected) {
			setValue(
				"selectedTracks",
				selectedTracks.filter((t) => t.id !== track.id),
				{ shouldValidate: true },
			);
		} else {
			if (selectedTracks.length >= 10) {
				return;
			}
			setValue(
				"selectedTracks",
				[
					...selectedTracks,
					{
						id: track.id,
						name: track.name,
						artistId: track.artists[0].id,
						artistName: track.artists[0].name,
						albumName: track.album.name,
						albumImage: track.album.images[0]?.url || "",
						duration_ms: track.duration_ms,
						popularity: track.popularity,
						preview_url: track.preview_url,
					},
				],
				{ shouldValidate: true },
			);
		}
	};

	const removeSelectedTrack = (trackId: string) => {
		setValue(
			"selectedTracks",
			selectedTracks.filter((t) => t.id !== trackId),
			{ shouldValidate: true },
		);
	};

	const onSubmit = async (data: AddFavoritesFormData) => {
		try {
			if (data.addToPlaylist && data.playlistName) {
				const trackIds = data.selectedTracks.map((track) => track.id);
				await createPlaylist({
					name: data.playlistName,
					notes: data.playlistNotes,
					trackIds,
				});
			}

			for (const track of data.selectedTracks) {
				await addFavorite(track);
			}

			setOpen(false);
			reset();
			window.location.reload();
		} catch (error) {
			console.error("Error adding favorites:", error);
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
		if (!newOpen) {
			reset();
		}
	};

	return (
		<Sheet open={open} onOpenChange={handleOpenChange}>
			<SheetTrigger asChild>
				<Button size="lg" className="gap-2">
					<Plus className="w-5 h-5" />
					{t("pages.favorites.addFavorites")}
				</Button>
			</SheetTrigger>
			<SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
				<SheetHeader>
					<SheetTitle className="flex items-center gap-2">
						<Music className="w-6 h-6" />
						{t("pages.favorites.addFavoritesTitle")}
					</SheetTitle>
					<SheetDescription>
						{t("pages.favorites.addFavoritesDescription")}
					</SheetDescription>
				</SheetHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="searchQuery">
							{t("pages.favorites.searchLabel")}
						</Label>
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								id="searchQuery"
								placeholder={t("pages.favorites.searchPlaceholder")}
								{...register("searchQuery")}
								className="pl-10"
							/>
							{isSearching && (
								<Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
							)}
						</div>
						{errors.searchQuery && (
							<p className="text-sm text-destructive">
								{errors.searchQuery.message}
							</p>
						)}
					</div>

					{searchResults && searchResults.length > 0 && (
						<div className="space-y-2">
							<Label>{t("pages.favorites.searchResults")}</Label>
							<div className="border rounded-lg max-h-64 overflow-y-auto">
								{searchResults.map((track) => {
									const isSelected = selectedTracks.some((t) => t.id === track.id);
									return (
										<button
											key={track.id}
											type="button"
											onClick={() => toggleTrack(track)}
											className={`w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors border-b last:border-b-0 ${
												isSelected ? "bg-accent" : ""
											}`}
										>
											<div className="flex-shrink-0">
												{isSelected ? (
													<CheckCircle2 className="w-5 h-5 text-primary" />
												) : (
													<div className="w-5 h-5 rounded-full border-2 border-muted" />
												)}
											</div>
											<img
												src={track.album.images[0]?.url}
												alt={track.album.name}
												className="w-12 h-12 rounded object-cover"
											/>
											<div className="flex-1 text-left min-w-0">
												<p className="font-medium truncate">{track.name}</p>
												<p className="text-sm text-muted-foreground truncate">
													{track.artists[0].name} • {track.album.name}
												</p>
											</div>
											<span className="text-sm text-muted-foreground">
												{formatDuration(track.duration_ms)}
											</span>
										</button>
									);
								})}
							</div>
						</div>
					)}

					{selectedTracks.length > 0 && (
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label className="flex items-center gap-2">
									<ListMusic className="w-4 h-4" />
									{t("pages.favorites.selectedTracks")} ({selectedTracks.length}/10)
								</Label>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => setValue("selectedTracks", [])}
								>
									{t("common.clear")}
								</Button>
							</div>
							<div className="border rounded-lg divide-y">
								{selectedTracks.map((track) => (
									<div
										key={track.id}
										className="flex items-center gap-3 p-3 group"
									>
										<img
											src={track.albumImage}
											alt={track.albumName}
											className="w-10 h-10 rounded object-cover"
										/>
										<div className="flex-1 min-w-0">
											<p className="font-medium truncate text-sm">{track.name}</p>
											<p className="text-xs text-muted-foreground truncate">
												{track.artistName}
											</p>
										</div>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={() => removeSelectedTrack(track.id)}
											className="opacity-0 group-hover:opacity-100 transition-opacity"
										>
											<X className="w-4 h-4" />
										</Button>
									</div>
								))}
							</div>
							{errors.selectedTracks && (
								<p className="text-sm text-destructive">
									{errors.selectedTracks.message}
								</p>
							)}
						</div>
					)}

					<div className="flex items-center space-x-2">
						<Controller
							name="addToPlaylist"
							control={control}
							render={({ field }) => (
								<Checkbox
									id="addToPlaylist"
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							)}
						/>
						<Label htmlFor="addToPlaylist" className="cursor-pointer">
							{t("pages.favorites.addToPlaylist")}
						</Label>
					</div>

					{addToPlaylist && (
						<>
							<div className="space-y-2">
								<Label htmlFor="playlistName">
									{t("pages.favorites.playlistNameLabel")} *
								</Label>
								<Input
									id="playlistName"
									placeholder={t("pages.favorites.playlistNamePlaceholder")}
									{...register("playlistName")}
								/>
								{errors.playlistName && (
									<p className="text-sm text-destructive">
										{errors.playlistName.message}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="playlistNotes">
									{t("pages.favorites.playlistNotesLabel")}
								</Label>
								<Textarea
									id="playlistNotes"
									placeholder={t("pages.favorites.playlistNotesPlaceholder")}
									{...register("playlistNotes")}
									rows={3}
								/>
								{errors.playlistNotes && (
									<p className="text-sm text-destructive">
										{errors.playlistNotes.message}
									</p>
								)}
								<p className="text-xs text-muted-foreground">
									{watch("playlistNotes")?.length || 0}/500 caracteres
								</p>
							</div>
						</>
					)}

					<SheetFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => handleOpenChange(false)}
							disabled={isSubmitting}
						>
							{t("common.cancel")}
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									{t("common.saving")}
								</>
							) : (
								<>
									<Plus className="w-4 h-4 mr-2" />
									{t("pages.favorites.addButton")} ({selectedTracks.length})
								</>
							)}
						</Button>
					</SheetFooter>
				</form>
			</SheetContent>
		</Sheet>
	);
};

