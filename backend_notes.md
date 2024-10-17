### Backend notes

```js
restaurant.restaurantName = req.body.restaurantName;
restaurant.city = req.body.city;
restaurant.country = req.body.country;
restaurant.deliveryPrice = req.body.deliveryPrice;
restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
restaurant.cuisines = req.body.cuisines;
restaurant.menuItems = req.body.menuItems;
restaurant.lastUpdated = new Date();
```

```js
Object.assign(restaurant, {
  restaurantName: req.body.restaurantName,
  city: req.body.city,
  country: req.body.country,
  deliveryPrice: req.body.deliveryPrice,
  estimatedDeliveryTime: req.body.estimatedDeliveryTime,
  cuisines: req.body.cuisines,
  menuItems: req.body.menuItems,
  lastUpdated: new Date(),
});
```

？？？

```js
restaurant = {
  ...restaurant, 
  ...req.body, 
  lastUpdated: new Date(), 
};
```

equals to

```js
if (selectedCuisines) {
  const cuisinesArray = selectedCuisines
    .split(',')
    .map((cuisine) => new RegExp(cuisine, 'i'));
  query['cuisines'] = { $all: cuisinesArray };
}
```

```js
if (selectedCuisines) {
  query['cuisines'] = {
    $all: selectedCuisines
      .split(',')
      .map((cuisine) => new RegExp(cuisine, 'i')),
  };
}
```

app.use('/api/restaurant', RestaurantRoute); Do not miss that "/"
