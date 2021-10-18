import { inject, injectable } from 'tsyringe';
import path from 'path';
import  fs  from 'fs';
import uploadConfig from '@config/upload';

import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
    user_id: string;
    avatarFilename: string;
}
@injectable()
class UpdateUserAvatarService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ){}

    public async execute({ user_id, avatarFilename }: IRequest): Promise<User>{


        const user = await this.usersRepository.findById(user_id);

        if(!user){
            throw new AppError('Only authenticated user can change avatar.', 401);
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

        await this.usersRepository.save(user);


        return user;
    }
}

export default UpdateUserAvatarService;
