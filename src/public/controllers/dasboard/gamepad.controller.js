const gamepadStats = document.getElementById("status");

window.addEventListener("gamepadconnected", (event) => { controllerUpdate = gamePadController(); highlightElement(currentIndex); });

window.addEventListener("gamepaddisconnected", () => cancelAnimationFrame(controllerUpdate));

const gamePadController = () => {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    
    if (gamepads && gamepads[0]) gamepadStats.src = "/assets/icons/connected-controller.png";
    else gamepadStats.src = "/assets/icons/not-connected-controller.png";

    return requestAnimationFrame(gamePadController);
};