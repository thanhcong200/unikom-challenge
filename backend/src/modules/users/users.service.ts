import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepo: Repository<User>,
    ) { }


    async create(data: CreateUserDto & { password: string }) {
        const user = this.usersRepo.create(data as any);
        return this.usersRepo.save(user);
    }


    async findAll() {
        return this.usersRepo.find();
    }


    async findByEmail(email: string) {
        return this.usersRepo.findOne({ where: { email } });
    }


    async findById(id: number) {
        const user = await this.usersRepo.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }
}