"use client";

import { Check, Copy, Mail } from "lucide-react";
import { useState } from "react";
import { CONTACT_EMAIL } from "../data/profile.js";
import DesktopWindow from "./desktopWindow.js";

const buttonClass =
    "inline-flex min-h-10 cursor-pointer items-center gap-2 border border-white/40 px-4 py-2 text-xs text-white transition-colors hover:bg-white hover:text-black space-mono-bold";

export default function Contact(windowProps) {
    const [copyStatus, setCopyStatus] = useState("idle");

    const handleCopyEmail = async () => {
        try {
            await navigator.clipboard.writeText(CONTACT_EMAIL);
            setCopyStatus("copied");
        } catch {
            setCopyStatus("failed");
        }
    };

    return (
        <DesktopWindow
            title="Contact.exe"
            placement="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            className="w-[30rem]"
            {...windowProps}
        >
            <div className="space-y-5 p-5">
                <a className="group relative inline-block max-w-full break-all text-sm text-white space-grotesk" href={`mailto:${CONTACT_EMAIL}`}>
                    {CONTACT_EMAIL}
                    <span aria-hidden="true" className="absolute left-0 -bottom-1 h-[1px] w-0 bg-white transition-all group-hover:w-full" />
                </a>
                <div className="flex flex-wrap items-center gap-2 border-t border-white/20 pt-4">
                    <button className={buttonClass} onClick={handleCopyEmail} type="button">
                        {copyStatus === "copied"
                            ? <Check aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                            : <Copy aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />}
                        {copyStatus === "copied" ? "Copied" : "Copy email"}
                    </button>
                    <a className={buttonClass} href={`mailto:${CONTACT_EMAIL}`}>
                        <Mail aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                        Email me
                    </a>
                    {copyStatus !== "idle" && (
                        <p aria-live="polite" className="min-h-4 text-xs text-white/60 space-mono-regular">
                            {copyStatus === "copied" ? "Copied to clipboard." : "Copy unavailable."}
                        </p>
                    )}
                </div>
            </div>
        </DesktopWindow>
    );
}
