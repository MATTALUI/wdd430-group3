import { NextApiRequest, NextApiResponse } from 'next';
import { updateFormData } from '@/lib/actions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        const { id, rawFormData } = req.body;
        try {
            const result = await updateFormData(id, rawFormData);
            res.status(200).json({ message: 'success', data: result });
        } catch (error) {
            res.status(500).json({ message: 'error', error: 'An unknown error occurred' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
