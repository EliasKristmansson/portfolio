"use client";

import { ArrowDown, Blocks, FileText, Folder, Mail, Maximize2, Minimize, ScrollText } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CV_URL, LOCATION } from "../data/profile.js";
import { EXPERTISE, PROJECTS } from "../data/projects.js";
import Contact from "./contact.js";
import DesktopIcon from "./desktopIcon.js";
import DesktopWindow, { TitleButton } from "./desktopWindow.js";
import ProjectsBrowser from "./projectsBrowser.js";

// Under den här bredden (px) på skrivbordsytan fyller fönstren hela ytan.
// Håll i synk med @max-[40rem] i desktopWindow.js, som täcker tiden före hydrering.
const COMPACT_BELOW = 640;

const DESKTOP_ICONS = [
    { id: "filetext", icon: FileText, label: "About Me.txt", position: { x: 24, y: 24 }, opens: "about" },
    { id: "folder", icon: Folder, label: "Projects", position: { x: 24, y: 140 }, opens: "projects" },
    { id: "scrolltext", icon: ScrollText, label: "CV.pdf", position: { x: 24, y: 256 }, href: CV_URL },
    { id: "expertise", icon: Blocks, label: "Expertise", position: { x: 24, y: 372 }, opens: "expertise" },
    { id: "contact", icon: Mail, label: "Contact", position: { x: 24, y: 488 }, opens: "contact" },
];

const TASKBAR = [
    { name: "about", title: "About Me.txt", icon: FileText },
    { name: "contact", title: "Contact", icon: Mail },
    { name: "expertise", title: "Expertise", icon: Blocks },
    { name: "projects", title: "Projects", icon: Folder },
];

const INITIAL_WINDOWS = {
    about: { open: true, minimized: false },
    expertise: { open: false, minimized: false },
    projects: { open: false, minimized: false },
    contact: { open: false, minimized: false },
};

const DEFAULT_PROJECT_REQUEST = { id: PROJECTS[0].id, nonce: 0 };

const getAge = () => {
    const today = new Date();
    const birthdayThisYear = new Date(today.getFullYear(), 10, 5);
    return today.getFullYear() - 2002 - (today < birthdayThisYear ? 1 : 0);
};

function ExpertiseItem({ item }) {
    const pointerType = useRef("mouse");
    const open = () => window.open(item.link, "_blank", "noopener,noreferrer");

    return (
        <button
            type="button"
            title={`Open ${item.alt} resource`}
            className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 border border-transparent p-2 text-center transition-colors duration-100 hover:border-sky hover:bg-white/10"
            onPointerDown={(event) => {
                pointerType.current = event.pointerType;
            }}
            onClick={(event) => {
                if (event.detail === 0 || pointerType.current !== "mouse") open();
            }}
            onDoubleClick={open}
        >
            <i aria-hidden="true" className={`${item.icon} text-4xl text-white/80`} />
            <span className="text-xs text-white/80 space-mono-bold">{item.alt}</span>
        </button>
    );
}

export default function About() {
    const workspaceRef = useRef(null);
    const selectionStartRef = useRef(null);
    const [compact, setCompact] = useState(false);
    const [selectedIconIds, setSelectedIconIds] = useState(new Set());
    const [selectionBox, setSelectionBox] = useState(null);
    const [iconPositions, setIconPositions] = useState(() => Object.fromEntries(
        DESKTOP_ICONS.map(({ id, position }) => [id, position]),
    ));
    const [windows, setWindows] = useState(INITIAL_WINDOWS);
    const [windowOrder, setWindowOrder] = useState(["about", "expertise", "projects", "contact"]);
    const [projectsFullscreen, setProjectsFullscreen] = useState(false);
    const [projectRequest, setProjectRequest] = useState(DEFAULT_PROJECT_REQUEST);
    const [clockTime, setClockTime] = useState(null);

    const focusWindow = useCallback((name) => {
        setWindowOrder((order) => (order[order.length - 1] === name ? order : [...order.filter((entry) => entry !== name), name]));
    }, []);

    const openWindow = useCallback((name) => {
        focusWindow(name);
        setWindows((current) => ({ ...current, [name]: { open: true, minimized: false } }));
    }, [focusWindow]);

    const minimizeWindow = (name) => {
        setWindows((current) => ({ ...current, [name]: { ...current[name], minimized: true } }));
    };

    const closeWindow = (name) => {
        setWindows((current) => ({ ...current, [name]: { open: false, minimized: false } }));
        if (name === "projects") {
            setProjectsFullscreen(false);
            setProjectRequest(DEFAULT_PROJECT_REQUEST);
        }
    };

    const windowProps = (name) => ({
        // eslint-disable-next-line react-hooks/refs -- the ref object is only forwarded, never read during render
        containerRef: workspaceRef,
        compact,
        isMinimized: windows[name].minimized,
        zIndex: 20 + windowOrder.indexOf(name),
        onFocus: () => focusWindow(name),
        onMinimize: () => minimizeWindow(name),
        onClose: () => closeWindow(name),
    });

    useEffect(() => {
        const handleOpenProject = (event) => {
            setProjectRequest((request) => ({ id: event.detail.id, nonce: request.nonce + 1 }));
            openWindow("projects");
        };
        window.addEventListener("open-project", handleOpenProject);
        return () => window.removeEventListener("open-project", handleOpenProject);
    }, [openWindow]);

    useEffect(() => {
        const workspace = workspaceRef.current;
        if (!workspace) return;
        const observer = new ResizeObserver(([entry]) => setCompact(entry.contentRect.width < COMPACT_BELOW));
        observer.observe(workspace);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const updateClock = () => {
            setClockTime(new Date().toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" }));
        };
        updateClock();
        const interval = setInterval(updateClock, 1000 * 30); // en klocka behöver inte uppdateras varje sekund
        return () => clearInterval(interval);
    }, []);

    const getSelectionPoint = (event) => {
        const bounds = workspaceRef.current.getBoundingClientRect();
        return {
            x: event.clientX - bounds.left,
            y: event.clientY - bounds.top,
        };
    };

    const handleSelectionStart = (event) => {
        if (event.target !== event.currentTarget) return;

        const point = getSelectionPoint(event);
        selectionStartRef.current = point;
        setSelectionBox({ left: point.x, top: point.y, width: 0, height: 0 });
        setSelectedIconIds(new Set());
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handleSelectionMove = (event) => {
        const start = selectionStartRef.current;
        if (!start) return;

        const point = getSelectionPoint(event);
        const left = Math.min(start.x, point.x);
        const top = Math.min(start.y, point.y);
        const width = Math.abs(point.x - start.x);
        const height = Math.abs(point.y - start.y);
        setSelectionBox({ left, top, width, height });

        const selectionBounds = workspaceRef.current.getBoundingClientRect();
        const selectedIds = new Set();
        workspaceRef.current.querySelectorAll("[data-desktop-icon]").forEach((icon) => {
            const iconBounds = icon.getBoundingClientRect();
            const iconLeft = iconBounds.left - selectionBounds.left;
            const iconTop = iconBounds.top - selectionBounds.top;
            const intersects = iconLeft < left + width
                && iconLeft + iconBounds.width > left
                && iconTop < top + height
                && iconTop + iconBounds.height > top;

            if (intersects) selectedIds.add(icon.dataset.desktopIcon);
        });

        setSelectedIconIds(selectedIds);
    };

    const handleSelectionEnd = () => {
        selectionStartRef.current = null;
        setSelectionBox(null);
    };

    const openIcon = ({ opens, href }) => {
        if (opens) openWindow(opens);
        else window.open(href, "_blank", "noopener,noreferrer");
    };

    return (
        <section id="about" className="relative min-h-dvh px-4 pb-24 pt-12 text-white sm:px-6 md:px-20 md:pb-24 md:pt-20">
            <div className="border border-white">
                <div className="bg-dots relative flex min-h-[41rem] w-full flex-col overflow-hidden border border-white/40 bg-midnight-dark lg:min-h-[43rem]">
                    <div className="flex h-7 flex-shrink-0 items-center justify-between border-b border-midnight-light bg-midnight-dark/95 px-3">
                        <span className="text-[11px] tracking-wide text-white/60 space-mono-bold">Desktop</span>
                        <div aria-hidden="true" className="flex gap-1.5">
                            <span className="h-2.5 w-2.5 border border-rose" />
                            <span className="h-2.5 w-2.5 border border-sky" />
                            <span className="h-2.5 w-2.5 border border-amber" />
                        </div>
                    </div>

                    <div
                        ref={workspaceRef}
                        className="@container relative min-h-0 flex-1"
                        onPointerDown={handleSelectionStart}
                        onPointerMove={handleSelectionMove}
                        onPointerUp={handleSelectionEnd}
                        onPointerCancel={handleSelectionEnd}
                    >
                        {windows.about.open && (
                            <DesktopWindow
                                title="About Me.txt"
                                resizable
                                placement="top-4 left-[clamp(1rem,calc(100%-35rem),11.25rem)]"
                                className="h-[33.75rem] w-[34rem]"
                                bodyClassName="overflow-auto p-6 text-sm leading-relaxed text-white/80 space-grotesk"
                                {...windowProps("about")}
                            >
                                <h2 className="mb-3 text-2xl text-white space-mono-bold">About me</h2>
                                <dl className="mb-4 flex flex-wrap gap-x-5 gap-y-2 text-xs space-mono-regular">
                                    <div className="flex gap-2">
                                        <dt className="text-white/40">AGE</dt>
                                        <dd>{getAge()}</dd>
                                    </div>
                                    <div className="flex gap-2">
                                        <dt className="text-white/40">LOCATION</dt>
                                        <dd>{LOCATION}</dd>
                                    </div>
                                </dl>
                                <div className="space-y-4">
                                    <p>
                                        I am an interaction designer, which means I design and build user interfaces that are intriguing and fascinating to both look at and use. Much of my work is focused on creativity and imagination and using every tool at my disposal to make something that both the user and I are more than happy with. While I prefer front-end work because of the creative freedom it gives, I do have experience with back-end development as well.
                                    </p>
                                    <p>
                                        If there was one thing I&apos;d like to improve on it&apos;d probably be introducing responsiveness and accessibility in my work in more innovative ways. It is relatively easy to make a website look good and to be inventive, but not always as easy to make it responsive and accessible using similar methods. I work against the stigma that accessibility is boring and takes away from the freedom of design, and I try to make it a part of the process instead.
                                    </p>
                                    <p>
                                        You can find some of the programs, frameworks, and languages I am most proficient with{" "}
                                        <button
                                            type="button"
                                            className="cursor-pointer underline decoration-white/60 underline-offset-2 hover:text-white"
                                            onClick={() => openWindow("expertise")}
                                        >
                                            here
                                        </button>
                                        ! :)
                                    </p>
                                </div>
                            </DesktopWindow>
                        )}

                        {windows.projects.open && (
                            <DesktopWindow
                                title="Projects.exe"
                                fullscreen={projectsFullscreen}
                                placement="top-4 left-1/2 -translate-x-1/2"
                                className="w-[58rem]"
                                bodyClassName="overflow-y-auto"
                                actions={!compact && (
                                    <TitleButton
                                        label={projectsFullscreen ? "Restore Projects.exe" : "Fullscreen Projects.exe"}
                                        title={projectsFullscreen ? "Restore window" : "Fullscreen"}
                                        pressed={projectsFullscreen}
                                        onClick={() => setProjectsFullscreen((current) => !current)}
                                    >
                                        {projectsFullscreen
                                            ? <Minimize aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                                            : <Maximize2 aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />}
                                    </TitleButton>
                                )}
                                {...windowProps("projects")}
                            >
                                <ProjectsBrowser
                                    key={projectRequest.nonce}
                                    initialProjectId={projectRequest.id}
                                    fullscreen={compact || projectsFullscreen}
                                />
                            </DesktopWindow>
                        )}

                        {windows.expertise.open && (
                            <DesktopWindow
                                title="Expertise"
                                placement="top-20 left-[clamp(1rem,calc(100%-39rem),13.75rem)]"
                                className="w-[38rem]"
                                bodyClassName="overflow-auto"
                                {...windowProps("expertise")}
                            >
                                <div className="grid grid-cols-3 gap-3 p-5 sm:grid-cols-4">
                                    {EXPERTISE.map((item) => <ExpertiseItem key={item.alt} item={item} />)}
                                </div>
                            </DesktopWindow>
                        )}

                        {windows.contact.open && <Contact {...windowProps("contact")} />}

                        {selectionBox && (
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute z-10 border border-rose bg-rose/20"
                                style={selectionBox}
                            />
                        )}

                        {DESKTOP_ICONS.map((config) => (
                            <DesktopIcon
                                key={config.id}
                                id={config.id}
                                icon={config.icon}
                                label={config.label}
                                isSelected={selectedIconIds.has(config.id)}
                                positions={iconPositions}
                                selectedIconIds={selectedIconIds}
                                onMoveSelected={setIconPositions}
                                onSelect={(id) => setSelectedIconIds((current) => current.has(id) ? current : new Set([id]))}
                                onOpen={() => openIcon(config)}
                                containerRef={workspaceRef}
                            />
                        ))}
                    </div>

                    <div className="flex h-10 flex-shrink-0 items-center gap-2 border-t border-white/40 bg-midnight-dark/95 px-3">
                        <span className="flex items-center gap-2 border border-white/40 px-3 py-1 text-xs text-white space-mono-bold">
                            <span className="h-2 w-2 bg-sky" />
                            Start
                        </span>
                        <div className="flex min-w-0 gap-2 overflow-x-auto">
                            {TASKBAR.filter(({ name }) => windows[name].open).map(({ name, title, icon: Icon }) => (
                                <button
                                    key={name}
                                    type="button"
                                    aria-label={`Open ${title}`}
                                    onClick={() => openWindow(name)}
                                    className={`flex cursor-pointer items-center gap-2 border px-3 py-1 text-xs whitespace-nowrap transition-colors duration-100 space-mono-bold ${windows[name].minimized ? "border-white/40 text-white/60 hover:bg-white hover:text-black" : "border-white/60 bg-white/10 text-white"}`}
                                >
                                    <Icon aria-hidden="true" className="h-3 w-3" strokeWidth={1.5} />
                                    <span className="hidden sm:inline">{title}</span>
                                </button>
                            ))}
                        </div>
                        {clockTime && (
                            <span className="ml-auto flex items-center gap-2 text-xs text-white/80 space-mono-bold">
                                <span className="h-1.5 w-1.5 bg-rose" />
                                {clockTime}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <a
                href="#selected-work"
                aria-label="Go to Selected Works section"
                className="absolute bottom-5 left-1/2 z-10 flex h-10 w-10 -translate-x-1/2 cursor-pointer items-center justify-center border border-white bg-midnight transition-colors duration-100 hover:bg-white hover:text-black"
            >
                <ArrowDown strokeWidth={1.5} className="h-5 w-5" />
            </a>
        </section>
    );
}
