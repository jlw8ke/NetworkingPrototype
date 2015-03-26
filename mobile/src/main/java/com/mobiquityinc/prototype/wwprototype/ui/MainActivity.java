package com.mobiquityinc.prototype.wwprototype.ui;

import android.os.AsyncTask;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;

import com.mobiquityinc.prototype.wwprototype.R;
import com.mobiquityinc.prototype.wwprototype.rest.WeatherService;
import com.mobiquityinc.prototype.wwprototype.rest.model.City;

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
        new WeatherAsyncTask("Gainesville,FL").execute();
    }

    class WeatherAsyncTask extends AsyncTask<Void, Void, City> {

        String cityName;

        WeatherAsyncTask(String cityName) {
            this.cityName = cityName;
        }

        @Override
        protected City doInBackground(Void... params) {
            WeatherService weatherService = restAdapter.create(WeatherService.class);
            City cityWeather = weatherService.getCityWeatherData("Gainesville,FL");
            return cityWeather;
        }

        @Override
        protected void onPostExecute(City city) {
            weatherContent.setText(city.toString());
        }
    }


}
