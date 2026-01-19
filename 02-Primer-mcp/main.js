import { McpServer, ResourceTemplate, } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
//Crear un servidor Mcp
const servidor = new McpServer({
    name: "servidor-mcp-Nicolas",
    version: "1.0.0",
});
//Crear una herramienta
servidor.registerTool("multiplicar", {
    title: "Herramienta de multiplicar numeros",
    description: "Pasale los numeros y te los multiplica",
    inputSchema: z.object({
        numero1: z.number(),
        numero2: z.number(),
    }),
}, async ({ numero1, numero2 }) => {
    if (typeof numero1 != "number" || typeof numero2 != "number") {
        throw new Error("Los numeros no son validos...");
    }
    return {
        content: [
            {
                type: "text",
                text: String(numero1 * numero2),
            },
        ],
    };
});
servidor.registerResource("saludo", new ResourceTemplate("saludar://{nombre}", { list: undefined }), { title: "Recurso para saludar", description: "Pidele un saludo" }, async (url, { nombre }) => {
    if (typeof nombre !== "string") {
        throw new Error("El nombre no es valido...");
    }
    return {
        contents: [
            {
                uri: url.href,
                text: "Hola Saludos Amigo, como estas?" + nombre,
            },
        ],
    };
});
//COnexion con el server con la ia
const transporte = new StdioServerTransport();
await servidor.connect(transporte);
