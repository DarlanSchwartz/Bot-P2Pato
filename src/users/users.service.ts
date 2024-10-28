import UsersRepository from "./users.repository";

export default class UsersService {
    public static async createUser({ telegram_id, first_name, last_name }: { telegram_id: string; first_name: string; last_name: string; }) {
        return UsersRepository.createUser({ telegram_id, first_name, last_name });
    }

    public static async getUser({ telegram_id }: { telegram_id: string; }) {
        return UsersRepository.getUser({ telegram_id });
    }
}