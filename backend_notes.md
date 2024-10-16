manage restaurant db fully works

```javascript
restaurant.restaurantName = req.body.restaurantName;
restaurant.city = req.body.city;
restaurant.country = req.body.country;
restaurant.deliveryPrice = req.body.deliveryPrice;
restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
restaurant.cuisines = req.body.cuisines;
restaurant.menuItems = req.body.menuItems;
restaurant.lastUpdated = new Date();
```

```javascript
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

```javascript
restaurant = {
  ...restaurant, // 保留 restaurant 对象原有的属性
  ...req.body, // 使用 req.body 中的新值更新相应的属性
  lastUpdated: new Date(), // 手动覆盖或新增 lastUpdated 属性
};
```

等价精简：

```javascript
if (selectedCuisines) {
  const cuisinesArray = selectedCuisines
    .split(',')
    .map((cuisine) => new RegExp(cuisine, 'i'));
  query['cuisines'] = { $all: cuisinesArray };
}
```

```javascript
if (selectedCuisines) {
  query['cuisines'] = {
    $all: selectedCuisines
      .split(',')
      .map((cuisine) => new RegExp(cuisine, 'i')),
  };
}
```
