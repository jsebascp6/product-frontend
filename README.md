# Product Frontend
Este es un frontend construido con Next.js para interactuar con la API de productos.

## Requisitos
Node.js
npm o Yarn

## Instalación y Configuración
Clona el repositorio:
```bash
git clone git@github.com/product-frontend.git
cd product-frontend
```

Crea el archivo .env.local en la raíz del proyecto y agrega la siguiente configuración:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

Instala las dependencias:
```bash
npm install
```

Inicia el servidor de desarrollo:
```bash
npm run dev
```

El servidor estará disponible en http://localhost:3001.

## Funcionalidades
- Listar productos: Visualiza la lista de productos disponibles.
- Crear producto: Agrega un nuevo producto.
- Editar producto: Modifica un producto existente.
- Eliminar producto: Borra un producto de la lista.


## Estilos
Este proyecto utiliza Tailwind CSS para los estilos.

## Contribuciones
Las contribuciones son bienvenidas. Por favor, abre un issue o envía un pull request.
