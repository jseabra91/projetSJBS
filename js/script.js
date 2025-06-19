document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const errorMessage = document.getElementById("error-message");

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

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add("visible");

    // Animation pour attirer l'attention
    errorMessage.style.animation = "none";
    setTimeout(() => {
      errorMessage.style.animation = "shake 0.5s";
    }, 10);
  }

  function hideError() {
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
        window.location.href = "dashboard.html"; // Rediriger vers la page d'accueil
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
});
