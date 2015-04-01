package com.mobiquityinc.prototype.wwprototype;

import android.widget.Button;
import android.widget.TextView;

import com.mobiquityinc.prototype.wwprototype.ui.MainActivity;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.Robolectric;
import org.robolectric.RobolectricGradleTestRunner;
import org.robolectric.annotation.Config;

import butterknife.ButterKnife;

import static org.junit.Assert.*;

@RunWith(RobolectricGradleTestRunner.class)
@Config(constants = BuildConfig.class, emulateSdk = 21)
public class MainActivityTest {

    MainActivity activity;

    @Before
    public void setup() {
        activity = Robolectric.setupActivity(MainActivity.class);
    }

    @Test
    public void hasUIElements() {
        TestUtils.assertView(
                ButterKnife.findById(activity, R.id.weather_content),
                TextView.class,
                true
        );

        TestUtils.assertView(
                ButterKnife.findById(activity, R.id.btn_get_weather),
                Button.class,
                true
        );
    }





}