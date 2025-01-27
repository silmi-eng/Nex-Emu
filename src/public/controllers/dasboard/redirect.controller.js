const redirect = (game, console) => {
    localStorage.setItem("audio_enabled", "true");
    window.location.href = `/${game}/${console}/play`;
}