import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { CheckCircle2, Loader2, Plus, Search, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { useFavoritesContext } from "@/contexts/FavoritesContext";
import { usePlaylistsContext } from "@/contexts/PlaylistsContext";
import { useDebounce } from "@/hooks/useDebounce";
import {
	type AddToPlaylistFormData,
	addToPlaylistSchema,
} from "@/pages/favorites/components/AddToPlaylistSheet/schema";
import type { AddToPlaylistSheetProps } from "@/pages/favorites/components/AddToPlaylistSheet/types";
import { useSearchTracks } from "@/pages/favorites/hooks/useSearchTracks";
import { addTrackToPlaylist } from "@/utils/playlistsDB";

export const AddToPlaylistSheet = ({
	playlistId,
	playlistName,
	existingTrackIds,
}: AddToPlaylistSheetProps) => {
	const { t } = useTranslation();
	const {
		actions: { addFavorite },
	} = useFavoritesContext();
	const [open, setOpen] = useState(false);

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<AddToPlaylistFormData>({
		resolver: standardSchemaResolver(addToPlaylistSchema),
		defaultValues: {
			searchQuery: "",
			selectedTrackIds: [],
		},
	});

	const searchQuery = watch("searchQuery");
	const selectedTrackIds = watch("selectedTrackIds");
	const debouncedSearch = useDebounce(searchQuery, 500);
	const { data: searchResults, isLoading: isSearching } =
		useSearchTracks(debouncedSearch);

	const toggleTrackSelection = (trackId: string) => {
		if (selectedTrackIds.includes(trackId)) {
			setValue(
				"selectedTrackIds",
				selectedTrackIds.filter((id) => id !== trackId),
				{ shouldValidate: true },
			);
		} else {
			if (selectedTrackIds.length >= 10) {
				return;
			}
			setValue("selectedTrackIds", [...selectedTrackIds, trackId], {
				shouldValidate: true,
			});
		}
	};

	const onSubmit = async (data: AddToPlaylistFormData) => {
		if (!searchResults) return;

		try {
			const tracksToAdd = searchResults.filter((track) =>
				data.selectedTrackIds.includes(track.id),
			);

			for (const track of tracksToAdd) {
				await addFavorite({
					id: track.id,
					name: track.name,
					artistId: track.artists[0].id,
					artistName: track.artists[0].name,
					albumName: track.album.name,
					albumImage: track.album.images[0]?.url || "",
					duration_ms: track.duration_ms,
					popularity: track.popularity,
					preview_url: track.preview_url,
				});

				await addTrackToPlaylist(playlistId, track.id);
			}

			setOpen(false);
			reset();
			window.location.reload();
		} catch (error) {
			console.error("Error adding tracks to playlist:", error);
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
		if (!newOpen) {
			reset();
		}
	};

	const selectedTracks =
		searchResults?.filter((track) => selectedTrackIds.includes(track.id)) || [];

	return (
		<Sheet open={open} onOpenChange={handleOpenChange}>
			<Button
				onClick={() => setOpen(true)}
				variant="outline"
				size="sm"
				className="flex items-center gap-2"
			>
				<Plus className="w-4 h-4" />
				Adicionar Músicas
			</Button>

			<SheetContent className="sm:max-w-2xl overflow-y-auto">
				<SheetHeader>
					<SheetTitle>Adicionar Músicas à "{playlistName}"</SheetTitle>
					<SheetDescription>
						Busque e selecione músicas para adicionar a esta playlist
					</SheetDescription>
				</SheetHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
					<div className="space-y-2">
						<Label htmlFor="searchQuery">
							<Search className="w-4 h-4 inline mr-2" />
							{t("pages.favorites.searchLabel")}
						</Label>
						<Input
							id="searchQuery"
							type="text"
							placeholder={t("pages.favorites.searchPlaceholder")}
							{...register("searchQuery")}
						/>
						{errors.searchQuery && (
							<p className="text-sm text-destructive">
								{errors.searchQuery.message}
							</p>
						)}
					</div>

					{isSearching && (
						<div className="flex items-center justify-center py-8">
							<Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
						</div>
					)}

					{searchResults && searchResults.length > 0 && (
						<div className="space-y-2">
							<Label>{t("pages.favorites.searchResults")}</Label>
							<div className="border rounded-lg max-h-96 overflow-y-auto">
								{searchResults.map((track) => {
									const isSelected = selectedTrackIds.includes(track.id);
									const isAlreadyInPlaylist = existingTrackIds.includes(
										track.id,
									);

									return (
										<button
											key={track.id}
											type="button"
											onClick={() =>
												!isAlreadyInPlaylist && toggleTrackSelection(track.id)
											}
											disabled={isAlreadyInPlaylist}
											className={`w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors border-b last:border-b-0 ${
												isSelected ? "bg-accent" : ""
											} ${
												isAlreadyInPlaylist
													? "opacity-50 cursor-not-allowed"
													: ""
											}`}
										>
											<img
												src={track.album.images[0]?.url}
												alt={track.album.name}
												className="w-12 h-12 rounded object-cover"
											/>
											<div className="flex-1 text-left">
												<p className="font-semibold truncate">{track.name}</p>
												<p className="text-sm text-muted-foreground truncate">
													{track.artists[0].name} • {track.album.name}
												</p>
											</div>
											{isAlreadyInPlaylist ? (
												<CheckCircle2 className="w-5 h-5 text-muted-foreground" />
											) : isSelected ? (
												<CheckCircle2 className="w-5 h-5 text-primary" />
											) : (
												<div className="w-5 h-5 border-2 rounded-full border-muted-foreground" />
											)}
										</button>
									);
								})}
							</div>
						</div>
					)}

					{selectedTracks.length > 0 && (
						<div className="space-y-2">
							<Label>{t("pages.favorites.selectedTracks")}</Label>
							<div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
								{selectedTracks.map((track) => (
									<div
										key={track.id}
										className="flex items-center gap-3 p-2 rounded bg-accent"
									>
										<img
											src={track.album.images[0]?.url}
											alt={track.album.name}
											className="w-10 h-10 rounded object-cover"
										/>
										<div className="flex-1 min-w-0">
											<p className="font-medium truncate text-sm">
												{track.name}
											</p>
											<p className="text-xs text-muted-foreground truncate">
												{track.artists[0].name}
											</p>
										</div>
										<Button
											type="button"
											size="icon"
											variant="ghost"
											onClick={() => toggleTrackSelection(track.id)}
											className="flex-shrink-0"
										>
											<X className="w-4 h-4" />
										</Button>
									</div>
								))}
							</div>
							{errors.selectedTrackIds && (
								<p className="text-sm text-destructive">
									{errors.selectedTrackIds.message}
								</p>
							)}
						</div>
					)}

					<div className="flex gap-2 justify-end">
						<Button
							type="button"
							variant="outline"
							onClick={() => handleOpenChange(false)}
							disabled={isSubmitting}
						>
							{t("common.cancel")}
						</Button>
						<Button
							type="submit"
							disabled={isSubmitting || selectedTrackIds.length === 0}
						>
							{isSubmitting ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									{t("common.saving")}
								</>
							) : (
								<>
									<Plus className="w-4 h-4 mr-2" />
									Adicionar ({selectedTrackIds.length})
								</>
							)}
						</Button>
					</div>
				</form>
			</SheetContent>
		</Sheet>
	);
};
