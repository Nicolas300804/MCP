import { McpServer, } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
//Crear el servidor
const server = new McpServer({
    name: "servidor-mcp-calculadora",
    version: "1.0.0",
});
//crear la herramientas
server.registerTool("Sumar", {
    title: "Sumar",
    description: "Suma dos numeros",
    inputSchema: { n1: z.number(), n2: z.number() },
}, async ({ n1, n2 }) => {
    let operacion = String(n1 + n2);
    return {
        content: [{ type: "text", text: operacion }],
    };
});
server.registerTool("Restar", {
    title: "Restar",
    description: "Resta dos numeros",
    inputSchema: { n1: z.number(), n2: z.number() },
}, async ({ n1, n2 }) => {
    let operacion = String(n1 - n2);
    return {
        content: [{ type: "text", text: operacion }],
    };
});
server.registerTool("Multiplicar", {
    title: "Multiplicar",
    description: "Multiplica dos numeros",
    inputSchema: { n1: z.number(), n2: z.number() },
}, async ({ n1, n2 }) => {
    let operacion = String(n1 * n2);
    return {
        content: [{ type: "text", text: operacion }],
    };
});
server.registerTool("Dividir", {
    title: "Dividir",
    description: "Divide dos numeros",
    inputSchema: { n1: z.number(), n2: z.number() },
}, async ({ n1, n2 }) => {
    let operacion = String(n1 / n2);
    return {
        content: [{ type: "text", text: operacion }],
    };
});
server.registerTool("Resto-division", {
    title: "Resto",
    description: "Resto de dos numeros",
    inputSchema: { n1: z.number(), n2: z.number() },
}, async ({ n1, n2 }) => {
    let operacion = String(n1 % n2);
    return {
        content: [{ type: "text", text: operacion }],
    };
});
//conectar el mcp a la IA
const transport = new StdioServerTransport();
await server.connect(transport);
