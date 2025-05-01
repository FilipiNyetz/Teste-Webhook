import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log('Notificação recebida:', body);

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Erro no webhook:', error);
        return new NextResponse('Erro interno no servidor', { status: 500 });
    }
}

export function GET() {
    return new NextResponse('Método não permitido', { status: 405 });
}
