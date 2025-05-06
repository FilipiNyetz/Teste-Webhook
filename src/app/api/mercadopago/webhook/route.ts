import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

// Configuração do cliente
const client = new MercadoPagoConfig({
    accessToken: 'APP_USR-2547197747259946-050513-62b345d95361fc55d7d05601676675bf-2419470826',
    options: { timeout: 5000 },
});
const payment = new Payment(client);

// Suporte apenas para POST
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log('🔔 Notificação recebida do Mercado Pago:', body);

        // Valida se veio um ID
        const paymentId = body?.data?.id;
        if (!paymentId) {
            return NextResponse.json({ error: 'ID de pagamento não encontrado' }, { status: 400 });
        }

        // Busca os detalhes do pagamento
        const paymentData = await payment.get({ id: paymentId });
        let status = paymentData.status;
        const email = paymentData.payer?.email;

        // Simula uma atualização de banco de dados
        setInterval(() => {
            status = 'canceled'
        }, 18000000)
        if (status === 'approved') {
            console.log(`✅ Pagamento aprovado para ${email} (ID: ${paymentId})`);
        } else if (status === 'canceled') {
            console.log(`❌ Pagamento cancelado para ${email} (ID: ${paymentId})`);
        } else {
            console.log(`ℹ️ Status do pagamento (${paymentId}): ${status}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('❌ Erro no webhook:', error);
        return new NextResponse('Erro interno no servidor', { status: 500 });
    }
}

// Rejeita métodos diferentes de POST
export function GET() {
    return new NextResponse('Método não permitido', { status: 405 });
}
