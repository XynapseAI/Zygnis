import prisma from '../../../lib/prisma';
import { validateSession, apiError, apiSuccess } from '../../../lib/security';

export async function GET() {
  try {
    const { error, email } = await validateSession();
    if (error) return error;

    const dbUser = await prisma.user.findUnique({
      where: { email: email! },
      include: { inventory: true }
    });

    if (!dbUser) {
      return apiError('User not found', 404);
    }

    return apiSuccess(dbUser);
  } catch (error) {
    console.error('User API Error:', error);
    return apiError('Internal Server Error', 500);
  }
}
