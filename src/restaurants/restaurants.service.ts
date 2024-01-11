import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant } from './schema/restaurant.schema';
import * as mongoose from 'mongoose';
import { Query } from 'express-serve-static-core';
import { User } from 'src/user/schema/user.schema';
import APIUtils from 'src/utils/api.utils';

@Injectable()
export class RestaurantsService {
    constructor(
        @InjectModel(Restaurant.name)
        private restaurantModel: mongoose.Model<Restaurant>
    ) { }

    // Get all Restaurants
    async findAll(query: Query): Promise<Restaurant[]> {

        const resPerPage = 2;
        const currentPage = Number(query.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        const keyword = query.keyword ? {
            name: {
                $regex: query.keyword,
                $options: 'i'
            }
        } : {}
        const restaurants = await this.restaurantModel
            .find({ ...keyword })
            .limit(resPerPage)
            .skip(skip);
        return restaurants;
    }

    // create new restaurant
    async create(restaurant: Restaurant): Promise<Restaurant> {
        // const location = await APIUtils.getRestaurantLocation(
        //     restaurant.address,
        //   );
      
        // const data = Object.assign(restaurant, { user: user._id, location });
      
        const res = await this.restaurantModel.create(restaurant);
        return res;
    }

    // get restaurant by ID
    async findByID(id: string): Promise<Restaurant> {
        const res = await this.restaurantModel.findById(id);
        if (!res) {
            throw new NotFoundException('Do data found')
        }

        return res;
    }

    // update restaurant by ID
    async update(id: string, restaurant: Restaurant): Promise<Restaurant> {
        const res = await this.restaurantModel.findByIdAndUpdate(
            id,
            restaurant,
            {
                new: true,
                runValidators: true
            });
        return res;
    }

    // delete restaurant by ID
    async deleteById(id: string): Promise<Restaurant> {
        const res = await this.restaurantModel.findByIdAndDelete(
            id
        );
        return res;
    }
}