package com.mobiquityinc.prototype.wwprototype.ui;

import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;

import com.mobiquityinc.prototype.wwprototype.R;
import com.mobiquityinc.prototype.wwprototype.ui.BaseActivity;

import butterknife.InjectView;
import butterknife.OnClick;

public class MainActivity extends BaseActivity
{
    @InjectView(R.id.btn_get_weather) Button weatherButton;
    @InjectView(R.id.weather_content) TextView weatherContent;

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

    }


}
