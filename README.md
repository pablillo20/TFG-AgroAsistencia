# 🌾 AgroAsistencia - Sistema de Gestión Agrícola

**AgroAsistencia** es una aplicación completa para la gestión de usuarios, agricultores, fincas, maquinaria y trabajos agrícolas. Ofrece una interfaz intuitiva para registrar, consultar y controlar todas las operaciones del campo, incluyendo herramientas interactivas como geolocalización, chat directo con agricultores y un sistema de seguimiento meteorológico por zonas.

---

## 🚀 Características principales

- **CRUD completo** para:
  - Usuarios
  - Agricultores
  - Fincas
  - Maquinarias
  - Registros de trabajos

- **Módulo de "Menú Agricultores"**:
  - Listado de agricultores disponibles para colaborar.
  - Botón directo para chatear vía WhatsApp con cada agricultor.

- **Registro detallado de trabajos**:
  - Asociación del trabajo con agricultor, maquinaria y finca.
  - Información detallada: duración, observaciones, tareas, productos fitosanitarios aplicados.

- **Sistema de geolocalización interactivo**:
  - Mapa dinámico donde puedes hacer clic en una zona para ver el clima actual.
  - Visualización de todas las fincas geolocalizadas.

- **Control de uso de fitosanitarios**:
  - Registro automático de los fitosanitarios usados.
  - Estadísticas con los tres productos más utilizados.

---

## 🛠️ Tecnologías utilizadas

- **Frontend**: *(React)*
- **Backend**: *(Laravel)*
- **Base de Datos**: *(MySQL)*
- **APIs externas**: 
  - API de clima (OpenWeatherMap)
  - API de mapas (Leaflet)
  - WhatsApp URL para chats directos

---

## 📦 Instalación

```bash
git clone https://github.com/pablillo20/TFG-AgroAsistenciar.git
npm install
````
## 🖥️ Uso
```bash
npm run dev

php artisan serve
```



