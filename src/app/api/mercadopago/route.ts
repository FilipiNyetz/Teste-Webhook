// src/app/api/mercadopago/route.ts
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
    accessToken: "APP_USR-6304034007371947-050518-11ee5003c0398253323a55c14586b5ee-2419470826",
    options: { timeout: 5000 },
});

const payment = new Payment(client);

function generateIdempotencyKey() {
    return 'key-' + Math.random().toString(36).substring(2, 15)
        + Math.random().toString(36).substring(2, 15);
}

const now = new Date();
const sixMinutesLater = new Date(now.getTime() + 6 * 60 * 1000);

const toISOWithTimezone = (date: Date) => {
    const tzOffset = -3; // Brasil normalmente UTC-3
    const tz = `${tzOffset >= 0 ? '+' : '-'}${String(Math.abs(tzOffset)).padStart(2, '0')}:00`;
    return date.toISOString().slice(0, 19) + tz;
};


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
            expires: true,
            expiration_date_from: toISOWithTimezone(now),            // agora
            expiration_date_to: toISOWithTimezone(sixMinutesLater),
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
