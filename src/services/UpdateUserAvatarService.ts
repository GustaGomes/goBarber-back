import { getRepository } from 'typeorm';
import path from 'path';
import  fs  from 'fs';

import uploadConfig from '../config/upload';
import User from '../models/User';

interface Request {
    user_id: string;
    avatarFilename: string;
}

class UpdateUserAvatarService {
    public async execute({ user_id, avatarFilename }: Request): Promise<User>{

        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne(user_id);

        if(!user){
            throw new Error('Only authenticated user can change avatar.');
        }

        if(user.avatar){
            // Deletar o avatar anterior

            const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
            // aqui eu vou unir 2 caminhos o primeiro é o arquivo pra atualizar e o segundo é o arquivo que ja existia

            const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);
            // fs.promises = garante que eu uso as funcoes fs do node em promisse
            //  stat = ela tras o status do arquivo, porem só se ele existir

            if (userAvatarFileExists){
                await fs.promises.unlink(userAvatarFilePath);
                // se o arquivo existe, eu deleto ele usando unlink
            }
        }
        user.avatar = avatarFilename;

        await usersRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;
