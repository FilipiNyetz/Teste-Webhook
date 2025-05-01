// api/mercadopago/webhook.ts
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async (req: VercelRequest, res: VercelResponse) => {
    // Certifique-se de que está aceitando o método POST
    if (req.method === 'POST') {
        try {
            const body = req.body; // O Vercel já processa automaticamente o corpo da requisição

            console.log('Notificação recebida:', body);

            // Aqui você pode processar a notificação (verificar o status do pagamento, etc.)
            if (body.data && body.data.status === "approved") {
                console.log('Pagamento aprovado');
                // Faça algo quando o pagamento for aprovado
            }

            res.status(200).send('OK');
        } catch (error) {
            console.error('Erro no webhook:', error);
            res.status(500).send('Erro no processamento da notificação');
        }
    } else {
        // Certifique-se de que está rejeitando métodos não permitidos com o status 405
        res.status(405).send('Método não permitido');
    }
};
