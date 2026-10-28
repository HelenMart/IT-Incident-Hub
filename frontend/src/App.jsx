
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  PlusCircle,
  Search,
  RefreshCw,
  Monitor,
  AlertTriangle,
  CheckCircle,
  Clock3,
  Trash2,
  MessageSquare
} from "lucide-react";
import "./App.css";

const API = "http://localhost:3000";

const formularioInicial = {
  titulo: "",
  descripcion: "",
  categoria: "Hardware",
  prioridad: "Media",
  usuario: ""
};

const estados = [
  "NUEVO",
  "ASIGNADO",
  "EN_PROCESO",
  "RESUELTO",
  "CERRADO"
];

const categorias = [
  "Hardware",
  "Software",
  "Redes",
  "Accesos",
  "Otros"
];

const prioridades = ["Baja", "Media", "Alta", "Crítica"];

function App() {
  const [incidentes, setIncidentes] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [filtroPrioridad, setFiltroPrioridad] = useState("TODAS");
  const [filtroCategoria, setFiltroCategoria] = useState("TODAS");

  const [vista, setVista] = useState("panel");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const [incidenteSeleccionado, setIncidenteSeleccionado] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [autorComentario, setAutorComentario] = useState("");
  const [textoComentario, setTextoComentario] = useState("");

  // Consultar incidentes desde PostgreSQL
  async function cargarIncidentes() {
    setCargando(true);

    try {
      const respuesta = await fetch(`${API}/incidentes`);

      if (!respuesta.ok) {
        throw new Error("No se pudieron consultar los incidentes.");
      }

      const datos = await respuesta.json();
      setIncidentes(datos);
      setError("");
    } catch (err) {
      setError(err.message || "No se pudo conectar con el backend.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    async function iniciar() {
      try {
        const respuesta = await fetch(`${API}/incidentes`);

        if (!respuesta.ok) {
          throw new Error("No se pudo conectar con el backend.");
        }

        setIncidentes(await respuesta.json());
      } catch (err) {
        setError(err.message);
      }
    }

    iniciar();
  }, []);

  // Registrar incidente
  async function registrarIncidente(evento) {
    evento.preventDefault();
    setError("");
    setMensaje("");

    try {
      const respuesta = await fetch(`${API}/incidentes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formulario)
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo registrar el incidente.");
      }

      setFormulario({ ...formularioInicial });
      setVista("panel");

      await cargarIncidentes();
      setMensaje("Incidente registrado correctamente.");
    } catch (err) {
      setError(err.message);
    }
  }

  // Actualizar técnico o estado
  async function actualizarIncidente(incidente, cambios) {
    setError("");
    setMensaje("");

    try {
      const respuesta = await fetch(
        `${API}/incidentes/${incidente.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            tecnico: cambios.tecnico ?? incidente.tecnico ?? "",
            estado: cambios.estado ?? incidente.estado
          })
        }
      );

      if (!respuesta.ok) {
        throw new Error("No se pudo actualizar el incidente.");
      }

      await cargarIncidentes();
      setMensaje("Incidente actualizado correctamente.");
    } catch (err) {
      setError(err.message);
      await cargarIncidentes();
    }
  }

  // Eliminar incidente
  async function eliminarIncidente(id) {
    const confirmar = window.confirm(
      "¿Estás segura de eliminar este incidente?"
    );

    if (!confirmar) return;

    try {
      const respuesta = await fetch(
        `${API}/incidentes/${id}`,
        { method: "DELETE" }
      );

      if (!respuesta.ok) {
        throw new Error("No se pudo eliminar el incidente.");
      }

      if (incidenteSeleccionado?.id === id) {
        setIncidenteSeleccionado(null);
        setComentarios([]);
      }

      await cargarIncidentes();
      setMensaje("Incidente eliminado correctamente.");
    } catch (err) {
      setError(err.message);
    }
  }

  // Consultar comentarios
  async function verComentarios(incidente) {
    setIncidenteSeleccionado(incidente);
    setError("");

    try {
      const respuesta = await fetch(
        `${API}/incidentes/${incidente.id}/comentarios`
      );

      if (!respuesta.ok) {
        throw new Error("No se pudieron cargar los comentarios.");
      }

      setComentarios(await respuesta.json());
    } catch (err) {
      setError(err.message);
    }
  }

  // Guardar comentario
  async function guardarComentario(evento) {
    evento.preventDefault();

    if (!incidenteSeleccionado) return;

    setError("");

    try {
      const respuesta = await fetch(
        `${API}/incidentes/${incidenteSeleccionado.id}/comentarios`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            usuario: autorComentario.trim(),
            comentario: textoComentario.trim()
          })
        }
      );

      if (!respuesta.ok) {
        throw new Error("No se pudo guardar el comentario.");
      }

      setTextoComentario("");
      await verComentarios(incidenteSeleccionado);
      setMensaje("Comentario guardado correctamente.");
    } catch (err) {
      setError(err.message);
    }
  }

  // Estadísticas generales
  const total = incidentes.length;

  const abiertos = incidentes.filter(
    (i) => !["RESUELTO", "CERRADO"].includes(i.estado)
  ).length;

  const cerrados = incidentes.filter(
    (i) => i.estado === "CERRADO"
  ).length;

  const criticos = incidentes.filter(
    (i) => ["Alta", "Crítica"].includes(i.prioridad)
  ).length;

  // Estadísticas por categoría
  const estadisticasCategorias = categorias.map((categoria) => ({
    nombre: categoria,
    cantidad: incidentes.filter(
      (i) => i.categoria === categoria
    ).length
  }));

  // Estadísticas por técnico
  const tecnicos = {};

  incidentes.forEach((incidente) => {
    const tecnico = incidente.tecnico || "Sin asignar";
    tecnicos[tecnico] = (tecnicos[tecnico] || 0) + 1;
  });

  const estadisticasTecnicos = Object.entries(tecnicos);

  // Filtros de búsqueda
  const filtrados = incidentes.filter((incidente) => {
    const texto = [
      incidente.titulo,
      incidente.descripcion,
      incidente.categoria,
      incidente.usuario,
      incidente.tecnico || ""
    ].join(" ").toLowerCase();

    const coincideBusqueda = texto.includes(
      busqueda.trim().toLowerCase()
    );

    const coincideEstado =
      filtroEstado === "TODOS" ||
      incidente.estado === filtroEstado;

    const coincidePrioridad =
      filtroPrioridad === "TODAS" ||
      incidente.prioridad === filtroPrioridad;

    const coincideCategoria =
      filtroCategoria === "TODAS" ||
      incidente.categoria === filtroCategoria;

    return (
      coincideBusqueda &&
      coincideEstado &&
      coincidePrioridad &&
      coincideCategoria
    );
  });

  return (
    <div className="aplicacion">

      {/* Menú lateral */}
      <aside className="menu">
        <div className="marca">
          <Monitor size={30} />

          <div>
            <strong>IT Incident Hub</strong>
            <small>Control de incidentes</small>
          </div>
        </div>

        <nav>
          <button
            className={vista === "panel" ? "activo" : ""}
            onClick={() => setVista("panel")}
          >
            <LayoutDashboard size={19} />
            Panel principal
          </button>

          <button
            className={vista === "nuevo" ? "activo" : ""}
            onClick={() => setVista("nuevo")}
          >
            <PlusCircle size={19} />
            Nuevo incidente
          </button>
        </nav>

        <div className="menu-pie">
          Sistema de gestión de incidentes
          <small>Proyecto DevOps</small>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="contenido">

        <header className="encabezado">
          <div>
            <span className="subtitulo">
              GESTIÓN DE SOPORTE TÉCNICO
            </span>

            <h1>
              {vista === "panel"
                ? "Panel de incidentes"
                : "Registrar incidente"}
            </h1>

            <p>
              Administra y da seguimiento a los problemas de TI.
            </p>
          </div>

          <button
            className="boton-principal"
            onClick={() => setVista("nuevo")}
          >
            <PlusCircle size={18} />
            Nuevo incidente
          </button>
        </header>

        {mensaje && (
          <div className="aviso exito">{mensaje}</div>
        )}

        {error && (
          <div className="aviso error">{error}</div>
        )}

        {vista === "panel" ? (
          <>

            {/* Tarjetas de estadísticas */}
            <section className="estadisticas">

              <div className="tarjeta">
                <div className="tarjeta-icono">
                  <Monitor />
                </div>
                <span>Total de incidentes</span>
                <strong>{total}</strong>
              </div>

              <div className="tarjeta">
                <div className="tarjeta-icono">
                  <Clock3 />
                </div>
                <span>Abiertos</span>
                <strong>{abiertos}</strong>
              </div>

              <div className="tarjeta">
                <div className="tarjeta-icono">
                  <CheckCircle />
                </div>
                <span>Cerrados</span>
                <strong>{cerrados}</strong>
              </div>

              <div className="tarjeta">
                <div className="tarjeta-icono">
                  <AlertTriangle />
                </div>
                <span>Prioridad alta o crítica</span>
                <strong>{criticos}</strong>
              </div>

            </section>

            {/* Tabla de incidentes */}
            <section className="seccion-tabla">

              <div className="seccion-titulo">
                <div>
                  <h2>Incidentes registrados</h2>
                  <p>
                    Consulta y actualiza los incidentes del sistema.
                  </p>
                </div>

                <button
                  className="boton-secundario"
                  onClick={cargarIncidentes}
                >
                  <RefreshCw size={17} />
                  Actualizar
                </button>
              </div>

              {/* Filtros */}
              <div className="filtros">

                <div className="buscador">
                  <Search size={18} />

                  <input
                    placeholder="Buscar incidente, usuario o técnico..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>

                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  aria-label="Filtrar por estado"
                >
                  <option value="TODOS">
                    Todos los estados
                  </option>

                  {estados.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>

                <select
                  value={filtroPrioridad}
                  onChange={(e) => setFiltroPrioridad(e.target.value)}
                  aria-label="Filtrar por prioridad"
                >
                  <option value="TODAS">
                    Todas las prioridades
                  </option>

                  {prioridades.map((prioridad) => (
                    <option key={prioridad} value={prioridad}>
                      {prioridad}
                    </option>
                  ))}
                </select>

                <select
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                  aria-label="Filtrar por categoría"
                >
                  <option value="TODAS">
                    Todas las categorías
                  </option>

                  {categorias.map((categoria) => (
                    <option key={categoria} value={categoria}>
                      {categoria}
                    </option>
                  ))}
                </select>

              </div>

              <div className="tabla-contenedor">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Incidente</th>
                      <th>Prioridad</th>
                      <th>Técnico</th>
                      <th>Estado</th>
                      <th>Acción</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filtrados.map((incidente) => (
                      <tr key={incidente.id}>

                        <td>#{incidente.id}</td>

                        <td>
                          <strong>{incidente.titulo}</strong>
                          <small>
                            {incidente.categoria} · {incidente.usuario}
                          </small>
                        </td>

                        <td>
                          <span
                            className={
                              "prioridad prioridad-" +
                              incidente.prioridad
                                .toLowerCase()
                                .replace("í", "i")
                            }
                          >
                            {incidente.prioridad}
                          </span>
                        </td>

                        <td>
                          <input
                            className="tecnico"
                            aria-label={`Técnico del incidente ${incidente.id}`}
                            key={`${incidente.id}-${incidente.tecnico}`}
                            defaultValue={incidente.tecnico || ""}
                            placeholder="Sin asignar"
                            onBlur={(e) => {
                              const nuevo = e.target.value.trim();

                              if (nuevo !== (incidente.tecnico || "")) {
                                actualizarIncidente(incidente, {
                                  tecnico: nuevo
                                });
                              }
                            }}
                          />
                        </td>

                        <td>
                          <select
                            value={incidente.estado}
                            onChange={(e) =>
                              actualizarIncidente(incidente, {
                                estado: e.target.value
                              })
                            }
                          >
                            {estados.map((estado) => (
                              <option key={estado} value={estado}>
                                {estado}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td>
                          <button
                            className="boton-comentarios"
                            onClick={() => verComentarios(incidente)}
                            title="Ver comentarios"
                          >
                            <MessageSquare size={15} />
                            {" "}Comentarios
                          </button>

                          <button
                            className="boton-eliminar"
                            onClick={() => eliminarIncidente(incidente.id)}
                            title="Eliminar incidente"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>

                {filtrados.length === 0 && (
                  <div className="sin-datos">
                    {cargando
                      ? "Cargando incidentes..."
                      : "No hay incidentes para mostrar."}
                  </div>
                )}
              </div>
            </section>

            {/* Estadísticas por categoría y técnico */}
            <section className="seccion-comentarios">
              <h2>Estadísticas de incidentes</h2>

              <div className="dos-columnas">

                <div>
                  <h3>Por categoría</h3>

                  {estadisticasCategorias.map((item) => (
                    <p key={item.nombre}>
                      {item.nombre}: <strong>{item.cantidad}</strong>
                    </p>
                  ))}
                </div>

                <div>
                  <h3>Por técnico</h3>

                  {estadisticasTecnicos.length === 0 ? (
                    <p>No hay incidentes registrados.</p>
                  ) : (
                    estadisticasTecnicos.map(([nombre, cantidad]) => (
                      <p key={nombre}>
                        {nombre}: <strong>{cantidad}</strong>
                      </p>
                    ))
                  )}
                </div>

              </div>
            </section>

            {/* Comentarios */}
            {incidenteSeleccionado && (
              <section className="seccion-comentarios">

                <div className="seccion-titulo">
                  <div>
                    <h2>
                      Comentarios del incidente #
                      {incidenteSeleccionado.id}
                    </h2>

                    <p>{incidenteSeleccionado.titulo}</p>
                  </div>

                  <button
                    className="boton-secundario"
                    onClick={() => setIncidenteSeleccionado(null)}
                  >
                    Cerrar
                  </button>
                </div>

                <div className="lista-comentarios">

                  {comentarios.length === 0 ? (
                    <p>Todavía no hay comentarios.</p>
                  ) : (
                    comentarios.map((item) => (
                      <div className="comentario" key={item.id}>
                        <strong>{item.usuario}</strong>

                        <small>
                          {new Date(item.fecha).toLocaleString()}
                        </small>

                        <p>{item.comentario}</p>
                      </div>
                    ))
                  )}

                </div>

                <form
                  className="formulario-comentario"
                  onSubmit={guardarComentario}
                >
                  <input
                    required
                    placeholder="Tu nombre"
                    value={autorComentario}
                    onChange={(e) =>
                      setAutorComentario(e.target.value)
                    }
                  />

                  <textarea
                    required
                    rows="3"
                    placeholder="Escribe un comentario..."
                    value={textoComentario}
                    onChange={(e) =>
                      setTextoComentario(e.target.value)
                    }
                  />

                  <button
                    type="submit"
                    className="boton-principal"
                  >
                    Guardar comentario
                  </button>
                </form>

              </section>
            )}

          </>
        ) : (

          /* Formulario de registro */
          <section className="formulario-contenedor">

            <h2>Nuevo incidente</h2>

            <p>
              Completa los datos para registrar un problema de TI.
            </p>

            <form onSubmit={registrarIncidente}>

              <label>
                Título del incidente

                <input
                  required
                  placeholder="Ej. Computadora no enciende"
                  value={formulario.titulo}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      titulo: e.target.value
                    })
                  }
                />
              </label>

              <label>
                Descripción

                <textarea
                  required
                  rows="4"
                  placeholder="Describe el problema..."
                  value={formulario.descripcion}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      descripcion: e.target.value
                    })
                  }
                />
              </label>

              <div className="dos-columnas">

                <label>
                  Categoría

                  <select
                    value={formulario.categoria}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        categoria: e.target.value
                      })
                    }
                  >
                    {categorias.map((categoria) => (
                      <option key={categoria} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Prioridad

                  <select
                    value={formulario.prioridad}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        prioridad: e.target.value
                      })
                    }
                  >
                    {prioridades.map((prioridad) => (
                      <option key={prioridad} value={prioridad}>
                        {prioridad}
                      </option>
                    ))}
                  </select>
                </label>

              </div>

              <label>
                Usuario que reporta

                <input
                  required
                  placeholder="Nombre del usuario"
                  value={formulario.usuario}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      usuario: e.target.value
                    })
                  }
                />
              </label>

              <div className="acciones-formulario">

                <button
                  type="button"
                  className="boton-secundario"
                  onClick={() => setVista("panel")}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="boton-principal"
                >
                  Guardar incidente
                </button>

              </div>

            </form>
          </section>
        )}

        <footer>
          IT Incident Hub · Gestión de incidentes de TI
        </footer>

      </main>
    </div>
  );
}

export default App;
