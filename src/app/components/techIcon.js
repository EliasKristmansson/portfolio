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
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-48 p-3 bg-white text-black rounded-lg shadow-lg z-50">
                    <p className="font-bold">{name}</p>
                    <p className="text-sm mt-1">This is a short description of {name}.</p>
                </div>
            )}
        </div>
    );
}