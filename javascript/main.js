// Obtener carrito del localStorage
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Mostrar productos en la web
const productosContainer = document.getElementById("productos-container");
let productos = [];

async function mostrarProductos() {
  try {
    const response = await fetch('../data/productos.json');
    if (!response.ok) throw new Error('Error al cargar los productos');

    productos = await response.json();

    productosContainer.innerHTML = "";

    productos.forEach((producto) => {
      const div = document.createElement("div");
      div.classList.add("col-md-3");
      div.innerHTML = `
        <div class="card m-2">
          <img src="${producto.img}" class="card-img-top" alt="${producto.nombre}">
          <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text">Precio: $${producto.precio}</p>
            <input type="number" min="1" value="1" id="cantidad-${producto.id}" class="form-control mb-2">
            <button class="btn btn-primary" id="agregar-${producto.id}">Agregar al Carrito</button>
          </div>
        </div>
      `;
      productosContainer.appendChild(div);

      // Evento para el botón de agregar al carrito
      const botonAgregar = document.getElementById(`agregar-${producto.id}`);
      botonAgregar.addEventListener("click", () => agregarAlCarrito(producto.id));
    });
  } catch (error) {
    console.error("Error cargando productos:", error);
    productosContainer.innerHTML = "<p>Error al cargar los productos. Intenta más tarde.</p>";
  }
}

// Agregar producto al carrito
function agregarAlCarrito(id) {
  const cantidad = parseInt(document.getElementById(`cantidad-${id}`).value);
  if (cantidad <= 0 || isNaN(cantidad)) return;

  const producto = productos.find((p) => p.id === id);
  const productoEnCarrito = carrito.find((p) => p.id === id);

  if (productoEnCarrito) {
    productoEnCarrito.cantidad += cantidad;
  } else {
    carrito.push({ ...producto, cantidad });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarCarrito();

  Toastify({
    text: `${producto.nombre} agregado al carrito!`,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
  }).showToast();
}

// Mostrar carrito en el offcanvas
const carritoLista = document.getElementById("carrito-lista");
const totalElement = document.getElementById("total");
const carritoCount = document.getElementById("carrito-count");

function actualizarCarrito() {
  carritoLista.innerHTML = "";
  let total = 0;

  if (carrito.length === 0) {
    carritoLista.innerHTML = "<li class='list-group-item'>El carrito está vacío</li>";
  } else {
    carrito.forEach((producto, index) => {
      total += producto.precio * producto.cantidad;
      const li = document.createElement("li");
      li.classList.add("list-group-item");
      li.innerHTML = `
        ${producto.nombre} - $${producto.precio} x ${producto.cantidad} = $${producto.precio * producto.cantidad}
        <button class="btn btn-danger btn-sm float-end" onclick="eliminarDelCarrito(${index})">Eliminar</button>
      `;
      carritoLista.appendChild(li);
    });
  }

  totalElement.innerHTML = `<strong>Total: $${total}</strong>`;
  carritoCount.textContent = carrito.length;
  document.getElementById("vaciar-carrito").style.display = carrito.length ? "block" : "none";
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(index) {
  const producto = carrito[index];
  Swal.fire({
    title: '¿Estás seguro?',
    text: `¿Deseas eliminar ${producto.nombre} del carrito?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      carrito.splice(index, 1);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      actualizarCarrito();
      Swal.fire('Eliminado!', `${producto.nombre} ha sido eliminado del carrito.`, 'success');
    }
  });
}

// Vaciar carrito
document.getElementById("vaciar-carrito").addEventListener("click", () => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: '¿Deseas vaciar todo el carrito?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, vaciar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      carrito = [];
      localStorage.setItem("carrito", JSON.stringify(carrito));
      actualizarCarrito();
      Swal.fire('Vaciado!', 'El carrito ha sido vaciado.', 'success');
    }
  });
});


// Mostrar modal de compra
const modalCompra = new bootstrap.Modal(document.getElementById("modalCompra"));
const formularioFactura = document.getElementById("form-factura");

document.getElementById("comprar-btn").addEventListener("click", () => {
  if (carrito.length === 0) {
    alert('Tu carrito está vacío.');
    return;
  }
  modalCompra.show();
});

formularioFactura.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const direccion = document.getElementById('direccion').value;
  const email = document.getElementById('email').value;
  const numeroTarjeta = document.getElementById('numeroTarjeta').value;
  const fechaVencimiento = document.getElementById('fechaVencimiento').value;
  const codigoSeguridad = document.getElementById('codigoSeguridad').value;


  if (!numeroTarjeta.match(/^\d{4} \d{4} \d{4} \d{4}$/)) {
    alert('Por favor, ingresa un número de tarjeta válido');
    return;
  }

  if (!fechaVencimiento.match(/^\d{2}\/\d{2}$/)) {
    alert('Por favor, ingresa una fecha de vencimiento válida (MM/AA)');
    return;
  }

  if (!codigoSeguridad.match(/^\d{3}$/)) {
    alert('Por favor, ingresa un código de seguridad válido (CVV)');
    return;
  }

  Swal.fire({
    title: '¡Compra Confirmada!',
    text: `Gracias ${nombre} por tu compra. Un correo de confirmación ha sido enviado a ${email}.`,
    icon: 'success',
    confirmButtonText: 'Cerrar'
  }).then(() => {
    // Vaciar el carrito
    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
    modalCompra.hide();
  });
});

// Inicializar productos y carrito
mostrarProductos();
actualizarCarrito();

