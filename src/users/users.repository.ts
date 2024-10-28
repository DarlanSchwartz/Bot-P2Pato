import prisma from "../database/config";

export default class UsersRepository {

    public static async createUser({ telegram_id, first_name, last_name }: { telegram_id: string; first_name: string; last_name: string; }) {
        return prisma.users.create({ data: { telegram_id, first_name, last_name } });
    }

    public static async getUser({ telegram_id }: { telegram_id: string; }) {
        return prisma.users.findUnique({ where: { telegram_id } });
    }
}