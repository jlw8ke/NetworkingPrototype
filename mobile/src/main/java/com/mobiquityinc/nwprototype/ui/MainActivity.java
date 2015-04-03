package com.mobiquityinc.nwprototype.ui;

import android.os.AsyncTask;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;

import com.mobiquityinc.nwprototype.R;
import com.mobiquityinc.nwprototype.rest.WeatherService;
import com.mobiquityinc.nwprototype.rest.model.City;

import javax.inject.Inject;

import butterknife.InjectView;
import butterknife.OnClick;
import retrofit.RestAdapter;

public class MainActivity extends BaseActivity
{
    @InjectView(R.id.btn_get_weather) Button weatherButton;
    @InjectView(R.id.weather_content) TextView weatherContent;

    @Inject RestAdapter restAdapter;

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
    }

    @Override
    protected int getLayoutResource() {
        return R.layout.main;
    }

    @OnClick(R.id.btn_get_weather)
    void getWeather() {
        new WeatherAsyncTask(getString(R.string.city)).execute();
    }

    class WeatherAsyncTask extends AsyncTask<Void, Void, City> {

        String cityName;

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
            weatherContent.setText(city.getName());
        }
    }


}
