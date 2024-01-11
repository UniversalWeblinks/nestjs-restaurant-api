import { IsEmail, IsEmpty, IsEnum, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { Category } from "../schema/restaurant.schema";
import { User } from "src/user/schema/user.schema";

export class UpdateRestaurantDto {
    @IsString()
    @IsOptional()
    readonly name: string;
  
    @IsString()
    @IsOptional()
    readonly description: string;
  
    @IsEmail({}, { message: 'Please enter correct email address' })
    @IsOptional()
    readonly email: string;
  
    @IsPhoneNumber('NG')
    @IsOptional()
    readonly phoneNo: number;
  
    @IsString()
    @IsOptional()
    readonly address: string;
  
    @IsEnum(Category, { message: 'Please enter correct category' })
    @IsOptional()
    readonly category: Category;
  
    @IsEmpty({ message: 'You cannot provide the user ID.' })
    readonly user: User;
}