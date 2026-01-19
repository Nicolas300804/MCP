import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// APi https://cdn.moneyconvert.net/api/latest.json

//Crear el servidor
const server = new McpServer({
  name: "Servidor-mcp-monedas",
  version: "1.0.0",
});

//crear la herramienta para sacar el valor de una moneda
server.registerTool(
  "valor_monedas",
  {
    title: "Obtener el valor de una moneda",
    description:
      "Devuelve el valor actual de la moneda que nesecites (USD, EUR, COP, etc)",

    // Definición del esquema de entrada usando Zod
    // Se espera un objeto con una propiedad 'currency' de tipo string
    inputSchema: {
      currency: z.string().min(
        1,
        "Debes indicar la moneda, ejemplo: USD, EUR, COP, etc",
      ),
    },
  },
  // Función asíncrona que se ejecuta cuando la IA llama a la herramienta
  async ({ currency }) => {
    // URL de la API pública de tasas de cambio
    const url = "https://cdn.moneyconvert.net/api/latest.json";

    // Realizamos la solicitud HTTP GET a la API
    const respose = await fetch(url);

    // Verificamos si la respuesta de la red fue exitosa (código de estado 200-299)
    if (!respose.ok) {
      throw new Error("Error al acceder a la info del api");
    }

    // Parseamos la respuesta como JSON
    const data = await respose.json();
    const base= "USD"

    // Accedemos a la tasa de cambio específica.
    // Convertimos la moneda a mayúsculas (toUpperCase) porque las claves en la API suelen ser mayúsculas (ej. "USD").
    const value = data.rates[currency.toUpperCase()];

    // Validación: Si no se encuentra un valor para la moneda dada, lanzamos un error
    if (!value) {
      throw new Error(" No se encontró la moneda" + currency);
    }

    // Retornamos el contenido en el formato estándar de MCP
    return {
      content: [
        {
          type: "text",
          text: `El valor actual de ${currency.toUpperCase()} Frente al ${base} es: ${value} `,
        },
      ],
    };
  },
);






//Crear una herramienta para convertir una cifra al valor de otra moneda
server.registerTool(
  "conversion-tipo-cambio",
  {
    title: "Convertir una cifra de una moneda a otra",
    description:
      "Devuelve el valor de una moneda a otra",

    // Definición del esquema de entrada usando Zod para validar los datos que envía la IA
    inputSchema: {
      // Validamos que 'origin' sea un string de exactamente 3 caracteres (código ISO 4217, ej: USD)
      origin: z.string().length(3,"Debe ser un codigo ISO de tres letras que represente la moneda origen"),
      // Validamos que 'destination' también sea un código de 3 letras
      destination: z.string().length(3,"Debe ser un codigo ISO de tres letras que represente la moneda origen"),
      // Validamos que 'amount' sea un número
      amount: z.number()
    },
  },
  // Función asíncrona que ejecuta la lógica de conversión
  // Recibe un objeto desestructurado con: moneda origen, moneda destino y monto
  async ({ origin, destination, amount }) => {
    // 1. Definición y Petición a la API
    // Usamos una API pública que devuelve las tasas de cambio basadas en una moneda (generalmente USD)
    const url = "https://cdn.moneyconvert.net/api/latest.json";
    
    // Hacemos la petición de red
    const respose = await fetch(url);

    // Si la respuesta no es exitosa (ej. error 404 o 500), lanzamos una excepción
    if (!respose.ok) {
      throw new Error("Error al acceder a la info del api");
    }

    // Convertimos la respuesta cruda a un objeto JSON manipulable
    const data = await respose.json();

    // 2. Extracción de Datos
    // Desestructuramos la respuesta para obtener:
    // - base: La moneda base de la API (contra la que se calculan todas las demás, suele ser "USD")
    // - rates: Un objeto con todas las tasas de cambio (ej: { "EUR": 0.85, "COP": 4000, ... })
    let {base, rates} = data;
    base = "USD"

    // Validación de integridad: Aseguramos que la API haya devuelto los datos necesarios
    if (!base || !rates) {
      throw new Error(" No se encontró la información de tasas esperada.");
    }

    // 3. Cálculo de la Tasa de Conversión (Lógica de Tasa Cruzada)
    // El objetivo es encontrar cuánto vale 1 unidad de 'origin' en términos de 'destination'.
    let rate;

    // Escenario A: Conversión Directa desde la Base
    // Si queremos convertir Dólares a Euros y la base ES Dólares, el dato ya está en 'rates'.
    // Ejemplo: Base=USD, Origen=USD, Destino=EUR. rate = rates["EUR"] (0.85)
    if (origin === base) {
        rate = rates[destination]
    } else {
        // Escenario B: Conversión Cruzada (Cross-Rate)
        // La API nos da:
        // 1 USD = X Origen (inverse)
        // 1 USD = Y Destino (rates[destination])
        
        // Paso 1: Obtenemos el valor de la moneda origen respecto a la base.
        // Ej: rates["EUR"] = 0.85 (1 USD son 0.85 EUR)
        const inverse = rates[origin]
        
        // Paso 2: Calculamos la relación entre Destino y Origen.
        // Matemáticamente: (Destino/Base) / (Origen/Base) = Destino/Origen
        // Si queremos ir de EUR a COP (Base USD):
        // 1 USD = 4000 COP
        // 1 USD = 0.85 EUR
        // 1 EUR = 4000 / 0.85 COP
        rate = rates[destination] / inverse
    }

    // 4. Cálculo Final
    // Multiplicamos el monto solicitado por la tasa calculada
    const valueconverted = amount * rate

    // 5. Retorno de Resultados
    // Devolvemos el texto formateado para que el modelo lo presente al usuario
    return {
      content: [
        {
          type: "text",
          // toFixed(2) limita los decimales a 2 para el monto final (formato moneda)
          // toFixed(5) muestra más precisión para la tasa de cambio en sí
          text: `${amount} ${origin} = ${valueconverted.toFixed(2)} ${destination} (Tasa: ${rate.toFixed(5)}, moneda Base: ${base})`,
        },
      ],
    };
  },
);

//conexion con el mcp a la IA 
const transport = new StdioServerTransport()
await server.connect(transport)