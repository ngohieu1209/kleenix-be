import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { RoleEntity } from '../../models/entities/role.entity';
import { AdminManagerEntity } from '../../models/entities';
import { Role } from '../../shared/enums/role.enum';
import { hash } from 'bcryptjs';
import { COMMON_CONSTANT } from '../../shared/constants/common.constant';

export default class RoleSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(RoleEntity)
      .values([
        {
          name: Role.Admin,
        },
        {
          name: Role.MANAGER,
        }
      ])
      .execute();
      
      const role = await dataSource.getRepository(RoleEntity).findOne({
        where: {
          name: Role.Admin
        }
      })
      
      const hashPassword = await hash(
        "123456",
        COMMON_CONSTANT.BCRYPT_SALT_ROUND
      );
      
      await dataSource
        .createQueryBuilder()
        .insert()
        .into(AdminManagerEntity)
        .values([
          {
            username: 'kleenix-admin',
            password: hashPassword,
            name: "Admin Kleenix",
            role
          },
        ])
        .execute();
  }
}