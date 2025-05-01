// src/app/api/mercadopago/route.ts
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
    accessToken: "APP_USR-5889498249727335-050115-3366023be4870f62773c4292de775bf5-2419470826",
    options: { timeout: 5000 },
});

const payment = new Payment(client);

function generateIdempotencyKey() {
    return 'key-' + Math.random().toString(36).substring(2, 15)
        + Math.random().toString(36).substring(2, 15);
}

// 👇 Aqui está a exportação correta para um handler POST
export async function POST(req: Request) {
    try {
        const body = {
            transaction_amount: 0.01,
            description: "Pagamento via PIX teste",
            payment_method_id: "pix",
            payer: {
                email: "filipi@gmail.com",
                first_name: "Filipi",
                last_name: "Romao",
                identification: {
                    type: "CPF",
                    number: "02954349107"
                }
            },
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
