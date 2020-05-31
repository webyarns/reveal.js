window.addEventListener('load', () => {
    document.querySelectorAll(".preloader").forEach(e =>
        e.parentNode?.removeChild(e)
    )
})
