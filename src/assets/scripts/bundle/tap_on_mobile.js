        const container = document.getElementById("imageContainer");

        // Détection tactile
        container.addEventListener("touchstart", function (e) {
            e.preventDefault(); // Empêche le double déclenchement
            this.classList.toggle("active");
        });

        // Retire le texte si on clique ailleurs (mobile)
        document.addEventListener("touchstart", function (e) {
            if (!container.contains(e.target)) {
                container.classList.remove("active");
            }
        });
