const BASE_URL = process.env.ASAAS_BASE_URL || "https://api.asaas.com/v3";

function headers() {
  return {
    "Content-Type": "application/json",
    access_token: process.env.ASAAS_API_KEY!,
  };
}

async function asaasFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, { ...init, headers: headers() });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Asaas error (${response.status}): ${error}`);
  }

  return response.json();
}

interface AsaasCustomer {
  id: string;
  name: string;
  email: string;
}

export async function findOrCreateCustomer(params: { name: string; email: string; cpfCnpj?: string }): Promise<AsaasCustomer> {
  const found = await asaasFetch<{ data: AsaasCustomer[] }>(`/customers?email=${encodeURIComponent(params.email)}`);
  if (found.data.length > 0) return found.data[0];

  return asaasFetch<AsaasCustomer>("/customers", {
    method: "POST",
    body: JSON.stringify({ name: params.name, email: params.email, cpfCnpj: params.cpfCnpj }),
  });
}

interface AsaasSubscription {
  id: string;
  status: string;
  nextDueDate: string;
}

export async function createSubscription(params: {
  customerId: string;
  value: number;
  description: string;
}): Promise<AsaasSubscription> {
  const nextDueDate = new Date();
  nextDueDate.setDate(nextDueDate.getDate() + 1);

  return asaasFetch<AsaasSubscription>("/subscriptions", {
    method: "POST",
    body: JSON.stringify({
      customer: params.customerId,
      billingType: "UNDEFINED",
      cycle: "MONTHLY",
      value: params.value,
      nextDueDate: nextDueDate.toISOString().slice(0, 10),
      description: params.description,
    }),
  });
}

export async function getSubscriptionInvoiceUrl(subscriptionId: string): Promise<string | null> {
  const payments = await asaasFetch<{ data: { invoiceUrl: string }[] }>(`/subscriptions/${subscriptionId}/payments`);
  return payments.data[0]?.invoiceUrl || null;
}

export async function cancelSubscription(subscriptionId: string): Promise<void> {
  await asaasFetch(`/subscriptions/${subscriptionId}`, { method: "DELETE" });
}
