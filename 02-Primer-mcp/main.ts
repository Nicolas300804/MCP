import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// 1. Inicialización del Servidor MCP
// Se crea una instancia de McpServer. Este objeto es el corazón de nuestro servidor MCP.
// 'name': Identificador único para este servidor.
// 'version': Versión del servidor para control de cambios.
const servidor = new McpServer({
  name: "servidor-mcp-Nicolas",
  version: "1.0.0",
});

// 2. Registro de Herramientas (Tools)
// Las "Tools" son funciones ejecutables que exponemos a la IA.
// Cuando la IA decida que necesita "multiplicar", llamará a esta herramienta.
servidor.registerTool(
  "multiplicar", // Nombre único de la herramienta
  {
    title: "Herramienta de multiplicar numeros", // Título descriptivo para la UI/IA
    description: "Pasale los numeros y te los multiplica", // Descripción de qué hace (crucial para que la IA sepa cuándo usarla)
    // Esquema de entrada (Input Schema) usando Zod
    // Define estrictamente qué parámetros necesita la función y sus tipos.
    inputSchema: z.object({
      numero1: z.number(), // Esperamos un número obligatoriamente
      numero2: z.number(), // Esperamos otro número obligatoriamente
    }),
  },
  // Función implementadora: Aquí va la lógica real de la herramienta.
  // Recibe los argumentos validados por el esquema anterior.
  async ({ numero1, numero2 }) => {
    // Validación adicional (aunque Zod ya asegura tipos, nunca está de más ser defensivo)
    if (typeof numero1 != "number" || typeof numero2 != "number") {
      throw new Error("Los numeros no son validos...");
    }

    // Retornamos el resultado en el formato estándar de MCP.
    // 'content' es un array que puede contener texto, imágenes, etc.
    return {
      content: [
        {
          type: "text",
          text: String(numero1 * numero2), // Convertimos el resultado a string
        },
      ],
    };
  },
);

// 3. Registro de Recursos (Resources)
// Los "Resources" son datos pasivos que la IA puede leer (como archivos, logs, o datos dinámicos).
// A diferencia de un Tool (que realiza una acción), un Resource provee contexto.
servidor.registerResource(
  "saludo", // Nombre interno del recurso
  // ResourceTemplate define el patrón de URL para acceder a este recurso.
  // Aquí usamos 'saludar://{nombre}', donde {nombre} es un parámetro dinámico.
  new ResourceTemplate("saludar://{nombre}", { list: undefined }),
  // Metadatos para que la IA entienda qué contiene este recurso
  { title: "Recurso para saludar", description: "Pidele un saludo" },
  // Función para obtener el contenido del recurso
  async (url, { nombre }) => {
    // El parámetro 'nombre' se extrae automáticamente de la URL gracias al template
    if (typeof nombre !== "string") {
      throw new Error("El nombre no es valido...");
    }

    // Retornamos el contenido del recurso
    return {
      contents: [
        {
          uri: url.href, // URI completa solicitada
          text: "Hola Saludos Amigo, como estas?" + nombre, // El contenido real del recurso
        },
      ],
    };
  },
);

// 4. Conexión y Transporte
// Configuramos el transporte basado en Stdio (Standard Input/Output).
// Esto permite que el servidor MCP se comunique con el cliente (por ejemplo, Claude Desktop o un IDE)
// a través de la terminal, recibiendo comandos por stdin y respondiendo por stdout.
const transporte = new StdioServerTransport();
await servidor.connect(transporte);
