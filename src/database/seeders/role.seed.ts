import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource, In } from 'typeorm';
import { RoleEntity } from '../../models/entities/role.entity';
import { AddressEntity, AdminManagerEntity, AssignmentEntity, BookingEntity, BookingPackageEntity, CustomerEntity, FeedbackEntity, HouseWorkerEntity, PackageEntity } from '../../models/entities';
import { Role } from '../../shared/enums/role.enum';
import { hash } from 'bcryptjs';
import { COMMON_CONSTANT } from '../../shared/constants/common.constant';
import _ from 'lodash';
import { addMinutes } from 'date-fns'
import { BOOKING_STATUS, PAYMENT_STATUS } from '../../shared/enums/booking.enum';

export default class RoleSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    // await dataSource
    //   .createQueryBuilder()
    //   .insert()
    //   .into(RoleEntity)
    //   .values([
    //     {
    //       name: Role.Admin,
    //     },
    //     {
    //       name: Role.MANAGER,
    //     }
    //   ])
    //   .execute();
      
    //   const role = await dataSource.getRepository(RoleEntity).findOne({
    //     where: {
    //       name: Role.Admin
    //     }
    //   })
      const feedback = [
        'Dịch vụ rất tốt, nhân viên rất nhiệt tình và chuyên nghiệp.',
        'Rất hài lòng với dịch vụ, nhà cửa sạch sẽ và gọn gàng.',
        'Nhân viên thân thiện, làm việc nhanh nhẹn và hiệu quả. Sẽ sử dụng lại.',
        'Dịch vụ vệ sinh rất tốt, tỉ mỉ và chu đáo. Rất đáng tiền',
        'Giá cả hợp lý, dịch vụ chất lượng cao. Tôi rất hài lòng.',
        'Nhân viên làm việc chuyên nghiệp, vệ sinh sạch sẽ. Sẽ giới thiệu cho bạn bè.',
        'Dịch vụ rất tốt, nhân viên nhiệt tình và chu đáo. Rất đáng khen!',
        'Rất ưng ý với dịch vụ, nhân viên làm việc cẩn thận và chu đáo.',
        'Dịch vụ tuyệt vời, nhân viên nhiệt tình và thân thiện. Rất hài lòng!',
        'Nhân viên làm việc nhanh chóng, vệ sinh sạch sẽ. Sẽ sử dụng lại dịch vụ.'
      ]
      const bookingCompleted = await dataSource.getRepository(BookingEntity).find({
        where: {
          status: BOOKING_STATUS.COMPLETED
        }
      })
      let bookingRandom = bookingCompleted;
      const hashPassword = await hash(
        "123456",
        COMMON_CONSTANT.BCRYPT_SALT_ROUND
      );
      
      for(let i = 0; i < 112; i++) {
        const booking = getRandomElementAndRemove(bookingRandom)
        await dataSource
          .createQueryBuilder()
          .insert()
          .into(FeedbackEntity)
          .values(
            {
              booking: booking,
              customer: booking.address.customer,
              rating: _.random(4, 5),
              feedback: getRandomElement(feedback)
            }
          )
          .execute();
          

      }
      
      // await dataSource
      //   .createQueryBuilder()
      //   .insert()
      //   .into(AdminManagerEntity)
      //   .values([
      //     {
      //       username: 'kleenix-admin',
      //       password: hashPassword,
      //       name: "Admin Kleenix",
      //       role
      //     },
      //   ])
      //   .execute();
      // await dataSource
      //   .createQueryBuilder()
      //   .insert()
      //   .into(CustomerEntity)
      //   .values([
      //     {
      //       phoneCode: '84',
      //       phoneNumber: '988655609',
      //       password: hashPassword,
      //       name: "Nguyễn Đức Huy",
      //       code: '0185',
      //       verify: true
      //     }
      //   ])
      //   .execute();
  }
}

const getRandomElement = (arr: any[]) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

function getRandomDate(start: string, end: string) {
  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();
  const randomTime = new Date(startDate + Math.random() * (endDate - startDate));
  return randomTime;
}

function getRandomElementAndRemove(array: any[]) {
  const randomIndex = _.random(0, array.length - 1); // Lấy chỉ số ngẫu nhiên
  const element = array[randomIndex]; // Lấy phần tử tại chỉ số đó
  _.pullAt(array, randomIndex); // Xóa phần tử tại chỉ số đó khỏi mảng
  return element; // Trả về phần tử đã lấy
}