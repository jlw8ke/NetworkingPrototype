package com.mobiquityinc.nwprototype.rest;


import com.mobiquityinc.nwprototype.rest.model.City;

import retrofit.http.GET;
import retrofit.http.Query;

public interface WeatherService {
    @GET("/data/2.5/weather")
    City getCityWeatherData(@Query("q") String cityName);

}
