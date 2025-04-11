document.addEventListener("DOMContentLoaded", function () {
    const securityScreen = document.getElementById("security-screen");
    const submitButton = document.getElementById("submit-code");
    const squares = document.querySelectorAll(".square");
  
    const correctCode = "0000";
  
    // Déplacer automatiquement le focus entre les champs
    squares.forEach((square, index) => {
        square.addEventListener("input", function () {
            if (square.value.length === 1 && index < squares.length - 1) {
                squares[index + 1].focus();
            }
        });
    });
  
    // Vérification du code
    submitButton.addEventListener("click", function () {
        const enteredCode = Array.from(squares).map(square => square.value).join("");
  
        if (enteredCode === correctCode) {
            // Si le code est correct, retirer l'écran noir
            securityScreen.style.display = "none";
        } else {
            // Si le code est incorrect, afficher un message d'erreur
            alert("Incorrect code. Please try again.");
            squares.forEach(square => (square.value = ""));
            squares[0].focus();
        }
    });
  
    squares[0].focus();
  });