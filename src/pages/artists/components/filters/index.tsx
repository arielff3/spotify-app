import { ChevronDown } from "lucide-react";
import {
	DropdownMenu,DropdownMenuContent, DropdownMenuItem, 
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
	InputGroup,
	InputGroupAddon,InputGroupButton, 
	InputGroupInput
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { useFilters } from "@/pages/artists/hooks/useFilters";
import { FilterTypes } from "@/pages/artists/hooks/useFilters/types";

export const Filters = () => {
	const { query, setQuery, type, setType } = useFilters();

	return (
		<div className="mb-8 w-fit">
			<InputGroup className="[--radius:1rem]">
				<InputGroupInput
					placeholder="Pesquisar"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
				<InputGroupAddon align="inline-end">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<InputGroupButton variant="ghost" className="!pr-1.5 text-xs">
								{type === FilterTypes.ARTIST ? "Artista" : "Album"}{" "}
								<ChevronDown className="size-3" />
							</InputGroupButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="[--radius:0.95rem]">
							<DropdownMenuItem
								onClick={() => setType(FilterTypes.ARTIST)}
								className={cn(type === FilterTypes.ARTIST && "bg-accent")}
							>
								Artista
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setType(FilterTypes.ALBUM)}
								className={cn(type === FilterTypes.ALBUM && "bg-accent")}
							>
								Album
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</InputGroupAddon>
			</InputGroup>
		</div>
	);
};
