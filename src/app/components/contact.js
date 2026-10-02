"use client";

import { Mail, X } from "lucide-react";

const CONTACT_EMAIL = "eliaskristmansson22@gmail.com";

export default function Contact({ isOpen, onClose }) {
	const handleSubmit = (event) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const body = `Name: ${formData.get("name")}\nEmail: ${formData.get("email")}\n\n${formData.get("message")}`;
		const query = new URLSearchParams({
			subject: formData.get("subject"),
			body,
		});

		window.location.assign(`mailto:${CONTACT_EMAIL}?${query}`);
	};

	if (!isOpen) return null;

	return (
		<section
			aria-labelledby="contact-window-title"
			aria-modal="false"
			className="absolute left-1/2 top-1/2 z-40 max-h-[calc(100%-2rem)] w-[min(30rem,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-white/70 bg-midnight-dark text-white shadow-2xl"
			onPointerDown={(event) => event.stopPropagation()}
			role="dialog"
		>
			<div className="flex h-9 items-center justify-between border-b border-white/50 bg-midnight-dark/95 px-3">
				<h2 id="contact-window-title" className="text-xs text-white/80 space-mono-bold">Contact.exe</h2>
				<button
					type="button"
					aria-label="Close Contact window"
					className="flex h-7 w-7 cursor-pointer items-center justify-center text-white/70 transition-colors duration-100 hover:bg-[#e48098] hover:text-black"
					onClick={onClose}
				>
					<X aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
				</button>
			</div>

			<form className="space-y-4 p-5" onSubmit={handleSubmit}>
				<label className="block space-y-1.5">
					<span className="text-[10px] text-white/60 space-mono-bold">YOUR NAME</span>
					<input
						autoComplete="name"
						className="w-full border border-white/25 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#25b4f0]"
						name="name"
						required
					/>
				</label>
				<label className="block space-y-1.5">
					<span className="text-[10px] text-white/60 space-mono-bold">YOUR EMAIL</span>
					<input
						autoComplete="email"
						className="w-full border border-white/25 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#25b4f0]"
						name="email"
						required
						type="email"
					/>
				</label>
				<label className="block space-y-1.5">
					<span className="text-[10px] text-white/60 space-mono-bold">SUBJECT</span>
					<input
						className="w-full border border-white/25 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#25b4f0]"
						name="subject"
						required
					/>
				</label>
				<label className="block space-y-1.5">
					<span className="text-[10px] text-white/60 space-mono-bold">MESSAGE</span>
					<textarea
						className="min-h-32 w-full resize-y border border-white/25 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#25b4f0]"
						name="message"
						required
					/>
				</label>
				<div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-4">
					<a className="text-xs text-white/60 underline underline-offset-2 hover:text-white" href={`mailto:${CONTACT_EMAIL}`}>
						{CONTACT_EMAIL}
					</a>
					<button
						className="inline-flex min-h-10 cursor-pointer items-center gap-2 border border-white/40 px-4 py-2 text-xs text-white transition-colors hover:bg-white hover:text-black space-mono-bold"
						type="submit"
					>
						<Mail aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
						Open email app
					</button>
				</div>
			</form>
		</section>
	);
}
