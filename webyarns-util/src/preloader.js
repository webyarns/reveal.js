window.addEventListener('load', () => {
    document.querySelectorAll(".preloader").forEach(e =>
        e.parentNode?.removeChild(e)
    )
    document.querySelectorAll(".reveal").forEach(e=>{
            e.style.opacity = "1"
        }
    )
})

