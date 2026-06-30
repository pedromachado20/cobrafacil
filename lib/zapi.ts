const INSTANCE_ID = process.env.ZAPI_INSTANCE_ID!;
const TOKEN = process.env.ZAPI_TOKEN!;
const BASE_URL = process.env.ZAPI_BASE_URL!;

export async function sendWhatsApp(phone: string, message: string) {
  const cleanedPhone = phone.replace(/\D/g, "");
  const phoneWithCountry = cleanedPhone.startsWith("55")
    ? cleanedPhone
    : `55${cleanedPhone}`;

  const url = `${BASE_URL}/${INSTANCE_ID}/token/${TOKEN}/send-text`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone: phoneWithCountry,
      message,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Z-API error: ${error}`);
  }

  return response.json();
}

export function buildMessage(
  template: string,
  vars: {
    nome: string;
    valor: string;
    descricao: string;
    vencimento: string;
    pix?: string;
  }
) {
  return template
    .replace(/{nome}/g, vars.nome)
    .replace(/{valor}/g, vars.valor)
    .replace(/{descricao}/g, vars.descricao)
    .replace(/{vencimento}/g, vars.vencimento)
    .replace(/{pix}/g, vars.pix || "não informado");
}
