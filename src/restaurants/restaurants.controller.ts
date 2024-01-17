import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schema/restaurant.schema';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { User } from 'src/user/schema/user.schema';

@Controller('restaurants')
export class RestaurantsController {
    constructor(
        private restaurantsService: RestaurantsService
    ) { }

    @Get()
    async getAllRestaurants(
        @Query()
        query: ExpressQuery
    ): Promise<Restaurant[]> {
        return this.restaurantsService.findAll(query);
    }

    @Post('/create')
    @UseGuards(AuthGuard(), RolesGuard)
    @Roles('admin', 'user')
    async createNewRestaurant(
        @Body()
        restaurant: CreateRestaurantDto,
        @CurrentUser() user: User,
    ): Promise<Restaurant> {
        return this.restaurantsService.create(restaurant, user);
    }

    @Get(':id')
    async getRestaurantByID(
        @Param('id')
        id: string
    ): Promise<Restaurant> {
        return this.restaurantsService.findByID(id);
    }

    @Put('/update/:id')
    @UseGuards(AuthGuard())
    async updateRestaurantByID(
        @Param('id')
        id: string,
        @Body()
        restaurant: UpdateRestaurantDto,
        @CurrentUser() user: User,
    ): Promise<Restaurant> {
        const res = await this.restaurantsService.findByID(id);
        if (res.user.toString() !== user._id.toString()) {
            throw new ForbiddenException('You can not update this restaurant.');
        }
        return this.restaurantsService.update(id, restaurant);
    }

    @Delete('/delete/:id')
    @UseGuards(AuthGuard())
    async deleteRestaurantByID(
        @Param('id')
        id: string,
        @CurrentUser() user: User,
    ): Promise<{ deleted: Boolean }> {
        const restaurant = await this.restaurantsService.findByID(id);

        if (restaurant.user.toString() !== user._id.toString()) {
            throw new ForbiddenException('You can not delete this restaurant.');
        }

        const isDeleted = await this.restaurantsService.deleteImages(
            restaurant.images,
        );

        if (isDeleted) {
            this.restaurantsService.deleteById(id);
            return {
                deleted: true,
            };
        } else {
            return {
                deleted: false,
            };
        }
    }
}
