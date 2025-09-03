import { useState } from "react";

export default function TechIcon({ iconClass, name }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <i className={`${iconClass} text-white text-9xl cursor-pointer`}></i>

            {hovered && (
                <div className="absolute bg-white text-black shadow-lg">
                    <p className="font-bold">{name}</p>
                    <p className="text-sm mt-1">This is a short description of {name}.</p>
                </div>
            )}
        </div>
    );
}