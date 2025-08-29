document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const errorMessage = document.getElementById("error-message");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const identifiant = document.getElementById("identifiant").value;
      const motDePasse = document.getElementById("mot_de_passe").value;

      // Validation simple
      if (!identifiant || !motDePasse) {
        showError("Veuillez remplir tous les champs");
        return;
      }

      // Ici, vous pouvez ajouter votre logique d'authentification
      // Par exemple, une requête fetch vers votre API

      // Simulation d'une connexion (à remplacer par votre logique)
      simulateLogin(identifiant, motDePasse);
    });
  }

  function showError(message) {
    if (!errorMessage) return;
    errorMessage.textContent = message;
    errorMessage.classList.add("visible");
    // Animation pour attirer l'attention
    errorMessage.style.animation = "none";
    setTimeout(() => {
      errorMessage.style.animation = "shake 0.5s";
    }, 10);
  }

  function hideError() {
    if (!errorMessage) return;
    errorMessage.textContent = "";
    errorMessage.classList.remove("visible");
  }

  function simulateLogin(identifiant, motDePasse) {
    // Simuler un délai de chargement
    const loginButton = document.querySelector(".login-button");
    const originalText = loginButton.textContent;

    loginButton.textContent = "CONNEXION...";
    loginButton.disabled = true;

    setTimeout(() => {
      // Ici, vous remplaceriez cette logique par votre vérification réelle
      if (identifiant === "admin" && motDePasse === "password") {
        // Connexion réussie
        hideError();
        window.location.href = "formulaire.html"; // Rediriger vers la page d'accueil
      } else {
        // Échec de la connexion
        showError("Identifiant ou mot de passe incorrect");
        loginButton.textContent = originalText;
        loginButton.disabled = false;
      }
    }, 1000);
  }

  // Animation CSS pour le message d'erreur
  const style = document.createElement("style");
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);

  // Gestion de la modale "mot de passe oublié"
  const forgotLink = document.querySelector(".forgot-link");
  const modal = document.getElementById("modal-mdp");
  const closeModal = document.querySelector(".close-modal");
  const resetForm = document.getElementById("reset-form");
  const resetMessage = document.getElementById("reset-message");

  if (forgotLink && modal && closeModal && resetForm && resetMessage) {
    // Ouvrir la modale
    forgotLink.addEventListener("click", function (e) {
      e.preventDefault();
      modal.style.display = "block";
      resetForm.reset();
      resetMessage.textContent = "";
    });

    // Fermer la modale
    closeModal.addEventListener("click", function () {
      modal.style.display = "none";
    });
    window.addEventListener("click", function (e) {
      if (e.target === modal) modal.style.display = "none";
    });

    // Validation du formulaire de reset
    resetForm.addEventListener("submit", function (e) {
      e.preventDefault();
      // Ici, tu pourrais faire un appel AJAX pour vérifier l'email
      // Mais pour l'instant, on affiche juste le message
      resetMessage.style.color = "#2d7a2d";
      resetMessage.textContent = "Si l'adresse existe, un mail sera envoyé.";
      // Optionnel : fermer la modale après quelques secondes
      setTimeout(() => {
        modal.style.display = "none";
      }, 2000);
    });
  }

  // Gestion sélection/redimensionnement image (page espace_temporaire)
  const photoSections = document.querySelectorAll(".photo-section");
  if (photoSections && photoSections.length > 0) {
    photoSections.forEach((section) => {
      const selectButton = section.querySelector("button");
      const placeholder = section.querySelector(".photo-placeholder");

      if (!selectButton || !placeholder) return;

      // Crée un input file caché avec restriction JPG/PNG
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/png, image/jpeg";
      fileInput.style.display = "none";
      section.appendChild(fileInput);

      selectButton.addEventListener("click", (e) => {
        e.preventDefault();
        fileInput.click();
      });

      fileInput.addEventListener("change", async () => {
        const file = fileInput.files && fileInput.files[0];
        if (!file) return;

        // Vérifie le type
        if (!["image/png", "image/jpeg"].includes(file.type)) {
          alert("Veuillez sélectionner une image au format JPG ou PNG.");
          fileInput.value = "";
          return;
        }

        try {
          const resizedDataUrl = await resizeToPortrait(file, placeholder);
          // Affiche l'aperçu dans le placeholder
          placeholder.innerHTML = "";
          const img = document.createElement("img");
          img.src = resizedDataUrl;
          img.alt = "Aperçu photo";
          img.style.display = "block";
          img.style.width = "100%";
          img.style.height = "100%";
          img.style.objectFit = "cover";
          placeholder.appendChild(img);
        } catch (err) {
          console.error(err);
          alert("Impossible de traiter l'image. Veuillez réessayer.");
        }
      });
    });
  }

  /**
   * Redimensionne une image vers un cadre portrait basé sur le placeholder.
   * Conserve le ratio, couvre le cadre (équivalent object-fit: cover) et centre.
   */
  function resizeToPortrait(file, placeholder) {
    const targetWidth = Math.max(100, placeholder.clientWidth || 100);
    const targetHeight = Math.max(120, placeholder.clientHeight || 120);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          // Calcul pour "cover"
          const sourceRatio = img.width / img.height;
          const targetRatio = targetWidth / targetHeight;

          let sx;
          let sy;
          let sWidth;
          let sHeight;

          if (sourceRatio > targetRatio) {
            // Image plus large: rogner sur la largeur
            sHeight = img.height;
            sWidth = Math.round(targetRatio * sHeight);
            sx = Math.round((img.width - sWidth) / 2);
            sy = 0;
          } else {
            // Image plus haute: rogner sur la hauteur
            sWidth = img.width;
            sHeight = Math.round(sWidth / targetRatio);
            sx = 0;
            sy = Math.round((img.height - sHeight) / 2);
          }

          const canvas = document.createElement("canvas");
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("Canvas non supporté"));

          ctx.drawImage(
            img,
            sx,
            sy,
            sWidth,
            sHeight,
            0,
            0,
            targetWidth,
            targetHeight
          );

          // Export en JPEG de bonne qualité (ou PNG si entrée PNG)
          const isPng = file.type === "image/png";
          const mime = isPng ? "image/png" : "image/jpeg";
          const quality = isPng ? 1.0 : 0.9;
          const dataUrl = canvas.toDataURL(mime, quality);
          resolve(dataUrl);
        };
        img.onerror = reject;
        img.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
});
