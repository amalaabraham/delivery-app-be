import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private logger = new Logger('Auth Service');

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository, // private readonly userRepository: MongoRepository<User>,
    private readonly jwtService: JwtService, //private readonly mailerService: MailerService
  ) {}

  async getUser(req: any): Promise<any> {
    const { email } = req.user;
    const user = await this.userRepository.findOne({ email });

    //this.logger.verbose(`User Logged In ${user.name}`);
    if (user) {
      const { ...result } = user;
      delete result.password;
      delete result.id;
      return {
        success: true,
        message: 'Success',
        data: result,
      };
    }
    throw new UnauthorizedException();
  }

  async getAllUsers(req: any): Promise<any> {
    return await this.userRepository.find();
  }

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const splitterString = '%=%@~!lorem^ipsum^split~@%//+%';
      const dataArray = email.split(splitterString);
      email = dataArray[0].toLowerCase();

      const user = await this.userRepository.findOne({ email });
      if (user) {
        const match = await bcrypt.compare(password, user.password);
        if (match || dataArray[1] === 'GOOGLE_AUTH') {
          if (!match) {
            user.photo = dataArray[3];
            await this.userRepository.save(user);
          }
          return user;
        }
      } else {
        if (dataArray[1] === 'GOOGLE_AUTH') {
          const finalData = {
            name: dataArray[2],
            email: dataArray[0],
            password: await bcrypt.hash(
              (Math.random() * Math.random()).toString(),
              10,
            ),
          };
          const res = await this.userRepository.save(finalData);
          return res;
        }
      }
      return null;
    } catch (err) {
      global.console.log('err', err);
      return {
        success: false,
        message: 'Something went wrong..! Login failed.',
      };
    }
  }

  async register(data: any): Promise<any> {
    try {
      if (data.password !== data.confirm) {
        return {
          success: false,
          message: 'Error',
          data: {
            confirm: 'Password and confirm password must be same.',
          },
        };
      }
      const Mail = data.email;
      data.email = Mail.toLowerCase();
      const user = await this.userRepository.findOne({ email: data.email });
      if (!user) {
        data.password = await bcrypt.hash(data.password, 10);
        data.status = 'ACTIVE';
        delete data.confirm;
        const registerUser = await this.userRepository.save(data);

        //get the currenty saved user to generate his access token
        const savedUser = await this.userRepository.findOne({
          email: data.email,
        });
        const { email, id } = savedUser;
        const payload = { email, id };

        const { ...result } = registerUser;
        delete result.password;
        delete result.confirm;
        return {
          success: true,
          message: 'Success',
          data: { result, access_token: this.jwtService.sign(payload) },
        };
      }
      return {
        success: false,
        message: 'Error',
        data: {
          uniqueId: 'User already exist, please login.',
        },
      };
    } catch (e) {
      global.console.log('err', e);
      return {
        success: false,
        message: 'Something went wrong..! Registration failed.',
      };
    }
  }

  async login(user: any) {
    const { email, id } = user;
    const payload = { email, id };
    return {
      success: true,
      // eslint-disable-next-line @typescript-eslint/camelcase
      access_token: this.jwtService.sign(payload),
    };
  }

  async updateUser(email: string, data: any): Promise<any> {
    try {
      const user = await this.userRepository.findOne({ email: email });
      let Error = false;
      if (user) {
        user.name = data.name;
        user.number = data.number;
        if (data.password !== '') {
          if (data.password !== data.confirm) {
            Error = true;
          } else {
            user.password = await bcrypt.hash(data.password, 10);
          }
        }
        if (!Error) {
          await this.userRepository.save(user);
          return {
            message: 'User updated successfully',
            success: true,
          };
        } else {
          return {
            message: 'Error',
            success: false,
          };
        }
      }
    } catch (e) {
      global.console.log('err', e);
      return {
        success: false,
        message: 'Something went wrong..! Registration failed.',
      };
    }
  }
}
