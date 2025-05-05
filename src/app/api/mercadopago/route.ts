// src/app/api/mercadopago/route.ts
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
    accessToken: "APP_USR-2547197747259946-050513-62b345d95361fc55d7d05601676675bf-2419470826",
    options: { timeout: 5000 },
});

const payment = new Payment(client);

function generateIdempotencyKey() {
    return 'key-' + Math.random().toString(36).substring(2, 15)
        + Math.random().toString(36).substring(2, 15);
}
const expirationDate = new Date(Date.now() + 5 * 60 * 1000).toISOString();

// 👇 Aqui está a exportação correta para um handler POST
export async function POST(req: Request) {
    try {
        const body = {
            transaction_amount: 0.03,
            description: "Pagamento via PIX teste",
            payment_method_id: "pix",
            payer: {
                email: "filipi@gmail.com",
                first_name: "Filipi",
                last_name: "Stein",
                identification: {
                    type: "CPF",
                    number: "02954349107"
                }
            },
            notification_url: 'https://teste-webhook-tau.vercel.app/api/mercadopago/webhook',
            date_of_expiration: expirationDate,
        };

        const requestOptions = {
            idempotencyKey: generateIdempotencyKey(),
        };

        const result = await payment.create({ body, requestOptions });

        const qrCode = result.point_of_interaction?.transaction_data?.qr_code;

        return new Response(
            JSON.stringify({ pix_code: qrCode ?? null }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Erro Mercado Pago:", error);
        return new Response(
            JSON.stringify({ error: "Erro ao criar pagamento" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
