import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as AuthValidator from 'google-auth-library';
import { User } from './entities/User.entity';
import { UpdateAddress } from './dto/UpdateAddress.dto';
import { ObjectID } from 'mongodb';
const ObjectId = require('mongodb').ObjectID;

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
  async tokenVerifier(token: string): Promise<any> {
    async function verify() {
      const CLIENT_ID =
        '851553848714-023jl52skl877gsrkabla89chm0sscgu.apps.googleusercontent.com';
      const client = new AuthValidator.OAuth2Client(CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
      });
      const payload = ticket.getPayload();
      return payload;
    }
    return verify().catch(console.error);
  }
  async validateUser(email: string, password: string): Promise<any> {
    try {
      const splitterString = '%=%@~!lorem^ipsum^split~@%//+%';
      const dataArray = email.split(splitterString);
      const loginType = dataArray[0];
      let returnData = null;
      if (loginType === 'GOOGLE_AUTH') {
        await this.tokenVerifier(dataArray[1]).then(async res => {
          if (res) {
            const user = await this.userRepository.findOne({
              email: res.email,
            });
            if (user) {
              if (user.type) {
                if (user.type === password) {
                  user.photo = res.picture;
                  await this.userRepository.save(user).then(res => {
                    delete res.password;
                    returnData = res;
                  });
                }
              } else {
                user.type = password;
                user.photo = res.picture;
                await this.userRepository.save(user).then(res => {
                  delete res.password;
                  returnData = res;
                });
              }
            } else {
              const user = {
                name: res.name,
                email: res.email,
                photo: res.picture,
                type: password,
                password: await bcrypt.hash(
                  (Math.random() * Math.random()).toString(),
                  10,
                ),
              };
              await this.userRepository.save(user).then(res => {
                delete res.password;
                returnData = res;
              });
            }
          } else {
            returnData = null;
          }
        });
      } else {
        const mail = dataArray[1].toLowerCase();
        const user = await this.userRepository.findOne({ email: mail });
        if (user) {
          const match = await bcrypt.compare(password, user.password);
          if (
            match &&
            (user.type === dataArray[2] ||
              (user.type === 'admin' && dataArray[2] === 'owner'))
          ) {
            delete user.password;
            returnData = user;
          } else {
            returnData = null;
          }
        } else {
          returnData = null;
        }
      }
      return returnData;
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
        if(data.address)
        {
          data.address['id']=new ObjectID();
        }
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
  
  async addUserAddress(user:User,data:UpdateAddress):Promise<any>{
    const user1 = await this.userRepository.findOne(ObjectId(user.id));
    if(user1)
    {
      data['id']=new ObjectId();
      if(user1.address)
      {
        
        user1.address.push(data);
      }
      else
      {
        user1.address=[data];
      }
      await this.userRepository.save(user1);
    }

  }

  async deleteUserAddress(user:User,id):Promise<any>
  {
    const user1=await this.userRepository.findOne(user.id);
    var flag=0;
    if(user1)
    {
      if(user1.address)
      {
        for(var i=0;i<user1.address.length;i++)
        {
          if(user1.address[i].id==id)
          {
            flag=1;
            break;
          }
        }
        if(flag==1)
        {
          console.log(i)
          user1.address.splice(i,1);
          console.log(user1)
          await this.userRepository.save(user1);
          return {
            success:true,
            message:'deleted address'
          }
        }
        else{
          return 'no such address found'
        }
        
      }
    }


  }
}
