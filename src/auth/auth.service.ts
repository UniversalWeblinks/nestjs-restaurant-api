import {
    ConflictException,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  import { RegisterDto } from './dto/register.dto';
  import { LoginDto } from './dto/login.dto'; 
  import * as bcrypt from 'bcryptjs';
  import { JwtService } from '@nestjs/jwt';
  import { User } from 'src/user/schema/user.schema';
  import APIUtils from 'src/utils/api.utils';
  
  @Injectable()
  export class AuthService {
    constructor(
      @InjectModel(User.name)
      private userModel: Model<User>,
      private jwtService: JwtService,
    ) {}
  
    // Register User
    async signUp(registerDto: RegisterDto): Promise<{ token: string }> {
      const { name, email, password } = registerDto;
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      try {
        const user = await this.userModel.create({
          name,
          email,
          password: hashedPassword,
        });
  
        const token = await APIUtils.assignJwtToken(user._id, this.jwtService);
        console.log(
            {token:token}
        )
  
        return { token };
      } catch (error) {
        // Handle duplicate email
        if (error.code === 11000) {
          throw new ConflictException('Duplicate Email entered.');
        }
      }
    }
  
    // Login user
    async login(loginDto: LoginDto): Promise<{ token: string }> {
      const { email, password } = loginDto;
  
      const user = await this.userModel.findOne({ email }).select('+password');
  
      if (!user) {
        throw new UnauthorizedException('Invalid email address or password.');
      }
  
      // Check if password is correct or not
      const isPasswordMatched = await bcrypt.compare(password, user.password);
  
      if (!isPasswordMatched) {
        throw new UnauthorizedException('Invalid email address or password.');
      }
  
      const token = await APIUtils.assignJwtToken(user._id, this.jwtService);
  
      return { token };
    }
  }