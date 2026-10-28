
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Página principal
app.get("/", (req, res) => {
  res.json({
    mensaje: "Bienvenido a IT Incident Hub",
    estado: "Servidor funcionando"
  });
});

// Ver todos los incidentes
app.get("/incidentes", async (req, res) => {
  try {
    const resultado = await db.query(
      "SELECT * FROM incidentes ORDER BY id DESC"
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al consultar incidentes"
    });
  }
});

// Ver un incidente por su ID
app.get("/incidentes/:id", async (req, res) => {
  try {
    const resultado = await db.query(
      "SELECT * FROM incidentes WHERE id = $1",
      [req.params.id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Incidente no encontrado"
      });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al consultar el incidente"
    });
  }
});

// Registrar un incidente
app.post("/incidentes", async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      categoria,
      prioridad,
      usuario
    } = req.body;

    if (!titulo || !descripcion || !categoria || !prioridad || !usuario) {
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios"
      });
    }

    const resultado = await db.query(
      `INSERT INTO incidentes
       (titulo, descripcion, categoria, prioridad, usuario)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [titulo, descripcion, categoria, prioridad, usuario]
    );

    res.status(201).json({
      mensaje: "Incidente registrado correctamente",
      incidente: resultado.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al registrar incidente"
    });
  }
});

// Asignar técnico y actualizar estado
app.patch("/incidentes/:id", async (req, res) => {
  try {
    const { tecnico, estado } = req.body;

    const estadosPermitidos = [
      "NUEVO",
      "ASIGNADO",
      "EN_PROCESO",
      "RESUELTO",
      "CERRADO"
    ];

    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({
        mensaje: "Estado no válido"
      });
    }

    const resultado = await db.query(
      `UPDATE incidentes
       SET tecnico = $1, estado = $2
       WHERE id = $3
       RETURNING *`,
      [tecnico || null, estado, req.params.id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Incidente no encontrado"
      });
    }

    res.json({
      mensaje: "Incidente actualizado correctamente",
      incidente: resultado.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al actualizar incidente"
    });
  }
});

// Eliminar un incidente
app.delete("/incidentes/:id", async (req, res) => {
  try {
    const resultado = await db.query(
      "DELETE FROM incidentes WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Incidente no encontrado"
      });
    }

    res.json({
      mensaje: "Incidente eliminado correctamente"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al eliminar incidente"
    });
  }
});

 // Consultar comentarios de un incidente
app.get("/incidentes/:id/comentarios", async (req, res) => {
  try {
    const resultado = await db.query(
      `SELECT * FROM comentarios
       WHERE incidente_id = $1
       ORDER BY fecha ASC, id ASC`,
      [req.params.id]
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al consultar comentarios"
    });
  }
});

// Agregar comentario a un incidente
app.post("/incidentes/:id/comentarios", async (req, res) => {
  try {
    const { usuario, comentario } = req.body;

    if (
      typeof usuario !== "string" ||
      typeof comentario !== "string" ||
      !usuario.trim() ||
      !comentario.trim()
    ) {
      return res.status(400).json({
        mensaje: "El usuario y el comentario son obligatorios"
      });
    }

    const resultado = await db.query(
      `INSERT INTO comentarios (incidente_id, usuario, comentario)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [req.params.id, usuario.trim(), comentario.trim()]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    if (error.code === "23503") {
      return res.status(404).json({
        mensaje: "Incidente no encontrado"
      });
    }

    console.error(error);
    res.status(500).json({
      mensaje: "Error al guardar comentario"
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
