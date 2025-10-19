"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export const GlobalLoading = () => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = "auto";
		};
	}, []);

	const content = (
		<div className="fixed z-[999] flex size-full items-center justify-center bg-background top-0 left-0 bottom-0 right-0">
			<div className="size-32 animate-spin rounded-full border-y-2 border-gray-900"></div>
		</div>
	);

	if (mounted) {
		return createPortal(content, document.body);
	}

	return content;
};
