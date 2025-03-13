const formularioContacto = document.getElementById('form-contacto');

if (formularioContacto) {
  formularioContacto.addEventListener('submit', (event) => {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const mensaje = document.getElementById('mensaje').value;

    if (!nombre || !email || !mensaje) {
      Toastify({
        text: "Por favor, complete todos los campos.",
        duration: 3000,
        close: true,
        gravity: "bottom",
        position: "center",
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
        stopOnFocus: true,
        style: {
          fontSize: "18px",
          padding: "20px",
          textAlign: "center",
          borderRadius: "10px",
        },
      }).showToast();
      return;
    }

    Toastify({
      text: `Gracias ${nombre}, tu mensaje ha sido enviado.`,
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "center",
      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
      stopOnFocus: true,
      style: {
        fontSize: "18px",
        padding: "20px",
        textAlign: "center",
        borderRadius: "10px",
      },
    }).showToast();

    formularioContacto.reset();
  });
} else {
  console.log('Formulario de contacto no encontrado.');
}
