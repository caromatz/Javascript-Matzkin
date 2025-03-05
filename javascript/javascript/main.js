// Productos disponibles

const productos = [
  {
    id: 1,
    nombre: "Lámpara Luna 3D",
    precio: 15000,
    img: "./images/luna.png",
    alt: "Lámpara Luna 3D"
  },
  {
    id: 2,
    nombre: "Lámpara Via Lactea 3D",
    precio: 12000,
    img: "./images/vialactea.png",
    alt: "Lámpara Via Lactea 3D"
  },
  {
    id: 3,
    nombre: "Lámpara Saturno 3D",
    precio: 16000,
    img: "./images/saturno.png",
    alt: "Lámpara Saturno 3D"
  },
  {
    id: 4,
    nombre: "Lámpara Sistema Solar 3D",
    precio: 10000,
    img: "./images/sistemasolar.png",
    alt: "Lámpara Sistema Solar 3D"
  },
];


// Obtener carrito del localStorage 
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Mostrar productos en la web
const productosContainer = document.getElementById("productos-container");

function mostrarProductos() {
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
          <button class="btn btn-primary" onclick="agregarAlCarrito(${producto.id})">Agregar al Carrito</button>
        </div>
      </div>`;
    productosContainer.appendChild(div);
  });
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
}

// Mostrar carrito 
const carritoLista = document.getElementById("carrito-lista");
const totalElement = document.getElementById("total");

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
  document.getElementById("vaciar-carrito").style.display = carrito.length ? "block" : "none";
}

// Eliminar producto del carrito
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarCarrito();
}

// Vaciar carrito
document.getElementById("vaciar-carrito").addEventListener("click", () => {
  carrito = [];
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarCarrito();
});

// Inicializar
mostrarProductos();
actualizarCarrito();
