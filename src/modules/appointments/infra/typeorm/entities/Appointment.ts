import {
    Entity, // algo que vai ser salvo no banco de dados
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';

@Entity('appointments') // quando coloca o decorator encima da classe - a classe é um parametro que esta sendo enviado ( apenas no typescript)
class Appointment {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    provider_id:string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'provider_id'})
    provider:User;

    @Column('time with time zone')
    date: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}

export default Appointment;
