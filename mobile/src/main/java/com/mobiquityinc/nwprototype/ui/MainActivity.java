package com.mobiquityinc.nwprototype.ui;

import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.widget.CardView;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TableLayout;
import android.widget.TextView;

import com.mobiquityinc.nwprototype.R;
import com.mobiquityinc.nwprototype.events.WeatherEvent;
import com.mobiquityinc.nwprototype.rest.WeatherService;
import com.mobiquityinc.nwprototype.rest.model.City;
import com.squareup.otto.Subscribe;


import java.text.DecimalFormat;

import static javax.measure.unit.NonSI.*;
import static javax.measure.unit.SI.*;

import javax.inject.Inject;
import javax.measure.converter.UnitConverter;

import butterknife.InjectView;
import butterknife.OnClick;
import butterknife.Optional;
import retrofit.RestAdapter;

public class MainActivity extends BaseActivity
{
    @InjectView(R.id.btn_get_weather) Button weatherButton;
    @InjectView(R.id.city_info) ViewGroup cityInfo;

    @InjectView(R.id.city_name) TextView cityTest;
    @InjectView(R.id.city_coordinates) TextView cityCoordinates;
    @InjectView(R.id.city_temperature) TextView cityTemperature;
    //@Optional @InjectView(R.id.weather_image) ImageView weatherImage;

    @Inject RestAdapter restAdapter;

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
    }

    @Override
    protected int getLayoutResource() {
        return R.layout.activity_main;
    }

    @OnClick(R.id.btn_get_weather)
    void getWeather() {
        new WeatherAsyncTask(getString(R.string.city)).execute();
    }

    @Subscribe
    public void onWeatherDataReceived(WeatherEvent weatherEvent) {
        City city = weatherEvent.getCity();

        UnitConverter toFahrenheit = KELVIN.getConverterTo(FAHRENHEIT);
        DecimalFormat df = new DecimalFormat("#.##");

        cityInfo.setVisibility(View.VISIBLE);
        cityTest.setText(city.getName());
        cityCoordinates.setText(city.getCoord().toString());

        double temperature = toFahrenheit.convert(city.getMain().getTemp());
        cityTemperature.setText(df.format(temperature) + FAHRENHEIT.toString());

    }


    private class WeatherAsyncTask extends AsyncTask<Void, Void, City> {

        private String cityName;

        WeatherAsyncTask(String cityName) {
            this.cityName = cityName;
        }

        @Override
        protected City doInBackground(Void... params) {
            WeatherService weatherService = restAdapter.create(WeatherService.class);
            City cityWeather = weatherService.getCityWeatherData(cityName);
            return cityWeather;
        }

        @Override
        protected void onPostExecute(City city) {
            eventBus.post(new WeatherEvent(city));
        }
    }


}
