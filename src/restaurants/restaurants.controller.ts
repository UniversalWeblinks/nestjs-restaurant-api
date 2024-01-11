import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schema/restaurant.schema';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Query as ExpressQuery} from 'express-serve-static-core';
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

    @Post()
    // @UseGuards(AuthGuard(), RolesGuard)
    // @Roles('admin', 'user')
    async createNewRestaurant(
        @Body()
        restaurant: CreateRestaurantDto,
        // @CurrentUser() user: User,
    ): Promise<Restaurant> {
        return this.restaurantsService.create(restaurant);
        // return this.restaurantsService.create(restaurant, user);
    }

    @Get(':id')
    async getRestaurantByID(
        @Param('id') 
        id: string
    ): Promise<Restaurant> {
        return this.restaurantsService.findByID(id);
    }

    @Put(':id')
    async updateRestaurantByID(
        @Param('id') 
        id: string,
        @Body()
        restaurant: UpdateRestaurantDto
    ): Promise<Restaurant> {
        await this.restaurantsService.findByID(id);
        return this.restaurantsService.update(id, restaurant);
    }

    @Delete(':id')
    async deleteRestaurantByID(
        @Param('id') 
        id: string,
    ): Promise<{deleted: Boolean}> {
        await this.restaurantsService.findByID(id);
        const restaurant = this.restaurantsService.deleteById(id);

        if (restaurant) {
            return {
                deleted: true
            }
        }
    }

}
