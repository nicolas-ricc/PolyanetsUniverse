const mapWrapper = (map)=>`<p>
<div style="letter-spacing: 1em;">
${map}
</div>
</p>
`;
const coordinate = (celestial)=>{
    const wrap = (icon)=>`<span class="">${icon}</span>`;
    const getIcon = (celestial)=>{
        switch(celestial){
            case "POLYANET":
                return wrap("🪐");
            case "SPACE":
                return wrap("🌌");
            case "SOLOON_RED":
                return `<span class="" style="filter: grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8);">🌕</span>`;
            case "SOLOON_BLUE":
                return `<span class="" style="filter: grayscale(100%) brightness(30%) sepia(100%) hue-rotate(-180deg) saturate(700%) contrast(0.8);">🌕</span>`;
            case "SOLOON_PURPLE":
                return `<span class="" style="filter: grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8);">🌕</span>`;
            case "SOLOON_WHITE":
                return `<span class="" style="filter: grayscale(100%);">🌕</span>`;
            case "COMETH_UP":
                return `<span class="rotate-[140deg] inline-block right-3 top-1 relative">☄️</span>`;
            case "COMETH_DOWN":
                return `<span class="rotate-[330deg] inline-block left-1 bottom-1 relative">☄️</span>`;
            case "COMETH_LEFT":
                return `<span class="rotate-[48deg] inline-block top-2 right-1 relative">☄️</span>`;
            case "COMETH_RIGHT":
                return `<span class="rotate-[230deg] inline-block right-3 bottom-2 relative">☄️</span>`;
        }
    };
    return getIcon(celestial);
};
export const renderMap = (map)=>{
    return mapWrapper(map.map((row)=>`<div>${row.map((elem)=>`${coordinate(elem)}`).join("")}</div>`).join(""));
};
