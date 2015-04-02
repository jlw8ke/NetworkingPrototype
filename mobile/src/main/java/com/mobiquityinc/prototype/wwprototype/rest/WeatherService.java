package com.mobiquityinc.prototype.wwprototype.rest;

import com.mobiquityinc.prototype.wwprototype.rest.model.City;

import retrofit.http.GET;
import retrofit.http.Query;

public interface WeatherService {
    @GET("/weather")
    City getCityWeatherData(@Query("q") String cityName);

}
