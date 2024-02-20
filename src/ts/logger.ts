const logger = document.createElement("div");

export function addLogger() {
    document.body.appendChild(logger);
    const s = logger.style;
    logger.id = "logger";
    s.position = "fixed";
    s.bottom = "0";
    s.top = "0";
    s.backgroundColor = "white";
    s.padding = "10px";
    s.border = "1px solid black";
    s.zIndex = "1000";
    s.maxHeight = "250px";
    s.overflow = "auto";
    s.width = "300px";
    s.display = "flex";
    s.flexDirection = "column-reverse";
}

export function log(...data: any[]) {
    logger.innerHTML += data.join(" ") + "<br>";
}
