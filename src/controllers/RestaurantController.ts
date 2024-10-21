import { Request, Response } from 'express';
import Restaurant from '../models/restaurant';

const getRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurantId = req.params.restaurantId;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      res.status(404).json({ message: 'Restaurant not found' });
      return;
    }
    res.json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const searchRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const city = req.params.city;
    const searchQuery = (req.query.searchQuery as string) || '';
    const selectedCuisines = (req.query.selectedCuisines as string) || '';
    const sortOption = (req.query.sortOption as string) || 'lastUpdated';
    const page = parseInt(req.query.page as string, 10) || 1;

    const query: any = {};
    query['city'] = new RegExp(city, 'i');

    // Check if any restaurants exist in the specified city
    const cityCheck = await Restaurant.countDocuments(query);
    if (cityCheck === 0) {
      res.status(404).json({
        data: [],
        pagination: {
          total: 0,
          page: 1,
          pages: 1,
        },
      });
      return;
    }

    // If selectedCuisines is provided, filter by cuisines
    if (selectedCuisines) {
      const cuisinesArray = selectedCuisines
        .split(',')
        .map((cuisine) => new RegExp(cuisine, 'i'));
      if (cuisinesArray.length > 0) {
        query['cuisines'] = { $all: cuisinesArray };
      }
    }

    // Search by query string in restaurantName or cuisines
    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, 'i');
      query['$or'] = [
        { restaurantName: searchRegex },
        { cuisines: { $in: [searchRegex] } },
      ];
    }

    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    // Fetch restaurants based on query and apply sorting, pagination
    const restaurants = await Restaurant.find(query)
      .sort({ [sortOption]: 1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const total = await Restaurant.countDocuments(query);
    const totalPages = Math.ceil(total / pageSize);

    // If page number exceeds total pages, return error
    if (page > totalPages) {
      res.status(400).json({ message: 'Page number exceeds total pages.' });
      return;
    }

    // Send response with restaurant data and pagination info
    res.json({
      data: restaurants,
      pagination: {
        total,
        page,
        pages: totalPages,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export default { searchRestaurant, getRestaurant };
